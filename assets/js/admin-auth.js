/* =========================================================
   LIFESCHÉDIO — Admin access gate (OTP by email)
   The console page is locked by default. On load a 6-digit code
   is requested from the relay (admin_code), emailed to the owner
   (valid 10 min, 5 attempts max, 60 s send cooldown). The right
   code (admin_login) is exchanged for a 30-min session token,
   kept in sessionStorage — closing the tab logs out. At expiry
   the page re-locks itself (reload: the gate is the HTML default).
   The dashboard/CMS scripts only bootstrap on 'ls:admin-unlock'.
   Local dev (localhost/file://) unlocks immediately, no code.
   Every access is journaled like tracker.js and emailed on
   page leave (type 'admin_log' → '[LifeSchédio Admin] Accès …').
   Transport: gsaRelayPost (iframe form POST + postMessage receipt)
   so the real relay result is shown (wrong code, expiry, lockout).
   ========================================================= */
(function () {
  'use strict';

  var TOKEN_KEY = 'ls_admin_token';
  var EXPIRES_KEY = 'ls_admin_expires';
  var CODE_TTL_MIN = 10;
  var SESSION_MIN = 30;
  var OWNER_EMAIL = 'gsacreatives@gmail.com';

  function $(id) { return document.getElementById(id); }
  function safe(fn) { try { return fn(); } catch (e) { return null; } }

  /* ---------- access journal (emailed on page leave) ---------- */
  function parseDevice(ua) {
    var browser = 'Other', os = 'Other', type = 'desktop';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/OPR\//.test(ua)) browser = 'Opera';
    else if (/Chrome\//.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua)) browser = 'Safari';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    if (/Android|iPhone/.test(ua)) type = 'mobile';
    else if (/iPad|Tablet/.test(ua) || (/MacIntel/.test(ua) && navigator.maxTouchPoints > 1)) type = 'tablet';
    return { browser: browser, os: os, type: type };
  }

  var session = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    startedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    device: parseDevice(navigator.userAgent),
    screen: (window.screen ? window.screen.width + 'x' + window.screen.height : ''),
    lang: document.documentElement.lang || 'en',
    tz: safe(function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; }) || '',
    referrer: document.referrer || 'direct',
    ip: null,
    geo: null,
    events: [],
    uploaded: false
  };

  function logEvent(type, payload) {
    if (session.events.length >= 200) return;
    session.events.push({ t: new Date().toISOString(), type: type, data: payload || {} });
  }

  /* IP + geo enrichment (best effort — same as tracker.js) */
  safe(function () {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 3000);
    fetch('https://ipapi.co/json/', ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        session.ip = j.ip || null;
        session.geo = [j.city, j.region, j.country_name].filter(Boolean).join(', ') || null;
      })
      .catch(function () { })
      .then(function () { clearTimeout(timer); });
  });

  function report() {
    if (session.uploaded) return;
    session.uploaded = true;
    safe(function () {
      window.gsaSendMail(
        {
          from: 'admin-gate@lifeschedio.local',
          fromName: 'Admin Gate LifeSchédio (local)',
          to: OWNER_EMAIL,
          subject: '[LifeSchédio Admin] Accès — ' + (session.geo || session.ip || session.device.type) + ' — ' + session.startedAt,
          text: JSON.stringify(session, null, 2)
        },
        { type: 'admin_log', session: session },
        true
      ).catch(function () { });
    });
  }
  window.addEventListener('pagehide', report);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') report();
  });

  /* ---------- gate UI ---------- */
  var gate = $('adminGate');
  var dash = $('dash');
  var gateStatus = $('gateStatus');
  var codeInput = $('gateCode');
  var unlockBtn = $('gateUnlock');
  var resendBtn = $('gateResend');
  var sessionTimer = null;

  function gateFlash(msg, kind) {
    if (!gateStatus) return;
    gateStatus.textContent = msg;
    gateStatus.className = 'gate__status is-' + (kind || 'ok');
  }

  function showDash() {
    if (dash) dash.hidden = false;
    if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
    window.LS_ADMIN_UNLOCKED = true;
    try {
      window.dispatchEvent(new CustomEvent('ls:admin-unlock'));
    } catch (e) {
      var ev = document.createEvent('Event');
      ev.initEvent('ls:admin-unlock', true, true);
      window.dispatchEvent(ev);
    }
  }

  function armSessionTimer(expiresAt) {
    clearTimeout(sessionTimer);
    var delay = Math.max(1000, expiresAt - Date.now());
    sessionTimer = setTimeout(function () {
      logEvent('session_expired', { auto: true });
      safe(function () {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(EXPIRES_KEY);
      });
      // the gate is the HTML default: reloading re-locks the page
      window.location.reload();
    }, delay);
  }

  function clearStoredSession() {
    safe(function () {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(EXPIRES_KEY);
    });
  }

  /* ---------- relay round-trips (with receipt) ---------- */
  function requestCode() {
    gateFlash('Sending an access code to ' + OWNER_EMAIL + '…', 'ok');
    window.gsaRelayPost({ type: 'admin_code', receipt: true })
      .then(function (r) {
        if (r && r.ok) {
          logEvent('code_sent', {});
          gateFlash('Code sent — valid ' + CODE_TTL_MIN + ' min. Check your inbox.', 'ok');
        } else if (r && r.error === 'code_just_sent') {
          gateFlash('A code was already sent less than a minute ago — check your inbox (valid ' + CODE_TTL_MIN + ' min).', 'ok');
        } else {
          gateFlash('Could not send the code (' + (r && r.error || 'unknown') + '). Try « Resend code ».', 'err');
        }
      })
      .catch(function () {
        gateFlash('Network error — the relay is unreachable. Try « Resend code ».', 'err');
      });
  }

  function tryLogin() {
    var code = codeInput ? codeInput.value.trim() : '';
    if (!/^\d{6}$/.test(code)) {
      gateFlash('Enter the 6-digit code from the email.', 'err');
      return;
    }
    logEvent('login_attempt', {});
    gateFlash('Checking…', 'ok');
    window.gsaRelayPost({ type: 'admin_login', code: code, receipt: true })
      .then(function (r) {
        if (r && r.ok && r.token) {
          logEvent('login_success', {});
          safe(function () {
            sessionStorage.setItem(TOKEN_KEY, r.token);
            sessionStorage.setItem(EXPIRES_KEY, String(Date.now() + SESSION_MIN * 60000));
          });
          armSessionTimer(Date.now() + SESSION_MIN * 60000);
          showDash();
        } else if (r && r.error === 'code_expired') {
          logEvent('login_fail', { reason: 'code_expired' });
          gateFlash('Code expired — request a new one (« Resend code »).', 'err');
        } else if (r && r.error === 'code_locked') {
          logEvent('login_fail', { reason: 'code_locked' });
          gateFlash('Too many wrong attempts — this code is locked. Request a new one.', 'err');
        } else if (r && r.error === 'bad_code') {
          logEvent('login_fail', { left: r.left });
          gateFlash('Wrong code — ' + (r.left != null ? r.left + ' attempt(s) left.' : 'try again.'), 'err');
        } else {
          logEvent('login_fail', { reason: r && r.error });
          gateFlash('Login failed (' + (r && r.error || 'unknown') + ').', 'err');
        }
      })
      .catch(function () {
        gateFlash('Network error — could not reach the relay.', 'err');
      });
  }

  function restoreSession() {
    var token = safe(function () { return sessionStorage.getItem(TOKEN_KEY); }) || null;
    var expiresAt = parseInt(safe(function () { return sessionStorage.getItem(EXPIRES_KEY); }) || '0', 10);
    if (!token || !expiresAt || Date.now() >= expiresAt) {
      clearStoredSession();
      return false;
    }
    gateFlash('Validating your session…', 'ok');
    window.gsaRelayPost({ type: 'admin_session', token: token, receipt: true })
      .then(function (r) {
        if (r && r.ok) {
          logEvent('session_restored', {});
          armSessionTimer(expiresAt);
          showDash();
        } else {
          clearStoredSession();
          logEvent('session_expired', {});
          gateFlash('Session expired — a new code was sent to your inbox.', 'ok');
          requestCode();
        }
      })
      .catch(function () {
        gateFlash('Network error — could not validate the session. Try « Resend code ».', 'err');
      });
    return true;
  }

  /* ---------- wiring + boot ---------- */
  if (unlockBtn) unlockBtn.addEventListener('click', tryLogin);
  if (resendBtn) resendBtn.addEventListener('click', requestCode);
  if (codeInput) codeInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); tryLogin(); }
  });

  logEvent('page_view', { gated: true });
  if (window.GSA_IS_LOCAL) {
    // dev on localhost/file://: no relay, no code — unlock straight away
    logEvent('local_unlock', {});
    showDash();
    return;
  }
  if (typeof window.gsaRelayPost !== 'function') {
    gateFlash('Relay transport missing (assets/js/gsa-config.js not loaded?).', 'err');
    return;
  }
  if (!restoreSession()) requestCode();
})();
