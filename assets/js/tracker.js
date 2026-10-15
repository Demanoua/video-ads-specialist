/* =========================================================
   GSA CREATIVES — Analytics tracker (100% client-side)
   Records every visit + action in localStorage
   ('gsa_analytics_v1') and optionally emails one session
   report per visit to the owner through the Google Apps
   Script relay (window.GSA_RELAY_ENDPOINT).
   Passive: observes the DOM, never breaks the site.
   ========================================================= */
(function () {
  'use strict';

  var REPORT_ENABLED = true; // false = keep data local only (no emails)
  var KEY = 'gsa_analytics_v1';

  /* ---- Shared relay config (SINGLE source of truth) ----
     The portfolio has no server (GitHub Pages is static): ALL outbound
     traffic goes through YOUR Google Apps Script Web App (assets/mail-
     relay.gs) — contact briefs, visit reports AND cms publishes (git
     pushes). Its /exec URL is below. NEVER put a Gmail/SMTP password
     or GitHub token anywhere in this repo — secrets live in the
     relay's Script Properties. main.js reads these variables (script
     order: tracker, then main). */
  window.GSA_RELAY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbym-a6FhQdI63QeFj6NRm5Ppr9ZXaOnD3SJgfZCd8r2R4yUkqJHNWBJEO8Rmv8h7GNL/exec';

  /* ---- Local testing intercept (Mailpit) ----
     When the site runs from localhost / 127.0.0.1 (or file://), NOTHING
     is sent to production: messages are captured by a local Mailpit and
     shown in its web UI (http://localhost:8025). Mailpit is a modern
     drop-in MailHog replacement — MailHog has NO HTTP send API.
     IMPORTANT — Mailpit blocks cross-origin API calls by default
     (CORS/DNS-rebinding protection), so start it by allowing your dev
     server's origin (port included), e.g.:
       mailpit --api-cors "localhost:5500,127.0.0.1:5500"
     or, for any local origin/port:
       mailpit --api-cors "*"
     Download: https://mailpit.axllent.org — one binary, run, done. */
  window.GSA_LOCAL_MAIL_API = 'http://localhost:8025/api/v1/send';
  // file:// (empty hostname) also counts as local: fail-safe to capture
  // rather than risk polluting the production inbox during dev.
  window.GSA_IS_LOCAL = window.location.hostname === '' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

  /* Shared transport — single call site for every outgoing message.
     local  → POST to Mailpit's HTTP API (captured, never delivered),
              in CORS mode so a blocked/failed send REJECTS and the UI
              shows a real error. Mailpit must be started with
              --api-cors (see the comment above) or it 403s the page.
     remote → POST `remote` payload to the Apps Script relay (no-cors:
              opaque response, request still delivered).
     msg    : { from, fromName, to, subject, text }
     keepalive: true for pagehide/unload sends (analytics report). */
  window.gsaSendMail = function (msg, remote, keepalive) {
    var opts = {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      keepalive: !!keepalive
    };
    if (window.GSA_IS_LOCAL) {
      opts.body = JSON.stringify({
        From: { Email: msg.from, Name: msg.fromName || 'Portfolio GSA (local)' },
        To: [{ Email: msg.to }],
        Subject: msg.subject,
        Text: msg.text
      });
      return fetch(window.GSA_LOCAL_MAIL_API, opts);
    }
    if (!window.GSA_RELAY_ENDPOINT) return Promise.reject(new Error('relay_not_configured'));
    opts.body = JSON.stringify(remote);
    opts.mode = 'no-cors';
    return fetch(window.GSA_RELAY_ENDPOINT, opts);
  };

  function safe(fn) { try { fn(); } catch (e) { } }

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.visits) return d;
    } catch (e) { }
    return { version: 1, visits: [] };
  }
  function save(d) {
    safe(function () {
      d.visits = d.visits.slice(-200);
      localStorage.setItem(KEY, JSON.stringify(d));
    });
  }

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

  var data = load();
  var session = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    startedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    device: parseDevice(navigator.userAgent),
    screen: (window.screen ? window.screen.width + 'x' + window.screen.height : ''),
    lang: document.documentElement.lang || 'en',
    tz: safe(function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; }) || '',
    referrer: document.referrer || 'direct',
    landing: window.location.hash || '(none)',
    ip: null,
    geo: null,
    events: [],
    videoWatch: {},
    uploaded: false
  };
  data.visits.push(session);
  save(data);

  function persist() {
    for (var i = data.visits.length - 1; i >= 0; i--) {
      if (data.visits[i].id === session.id) { data.visits[i] = session; break; }
    }
    save(data);
  }

  function logEvent(type, payload) {
    if (session.events.length >= 500) return;
    session.events.push({ t: new Date().toISOString(), type: type, data: payload || {} });
    persist();
  }

  /* ---- IP + geo enrichment (best effort) ---- */
  safe(function () {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 3000);
    fetch('https://ipapi.co/json/', ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        session.ip = j.ip || null;
        session.geo = [j.city, j.region, j.country_name].filter(Boolean).join(', ') || null;
        persist();
      })
      .catch(function () { })
      .then(function () { clearTimeout(timer); });
  });

  /* ---- Lightbox video watch time ---- */
  var watch = { title: null, last: 0, acc: 0 };

  function attachVideo() {
    var v = document.querySelector('#lightboxMedia video');
    if (!v) return;
    watch.last = 0;
    v.addEventListener('timeupdate', function () {
      var cur = v.currentTime || 0;
      var delta = cur - watch.last;
      if (delta > 0 && delta <= 3) {
        watch.acc += delta;
        session.videoWatch[watch.title] = Math.round(watch.acc);
        persist();
      }
      watch.last = cur;
    });
    v.addEventListener('play', function () { logEvent('video_play', { title: watch.title }); });
    v.addEventListener('pause', function () { logEvent('video_pause', { title: watch.title, seconds: Math.round(watch.acc) }); });
  }

  var lightbox = document.getElementById('lightbox');
  if (lightbox && 'MutationObserver' in window) {
    var lbOpen = false;
    new MutationObserver(function () {
      var open = lightbox.classList.contains('is-open');
      if (open && !lbOpen) {
        lbOpen = true;
        var titleEl = document.getElementById('lightboxTitle');
        watch.title = titleEl ? titleEl.textContent : 'unknown';
        watch.acc = session.videoWatch[watch.title] || 0;
        watch.last = 0;
        logEvent('video_open', { title: watch.title });
        setTimeout(attachVideo, 300);
      } else if (!open && lbOpen) {
        lbOpen = false;
        logEvent('video_close', { title: watch.title, seconds: Math.round(watch.acc) });
      }
    }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---- Contact modal ---- */
  var contactModal = document.getElementById('contactModal');
  if (contactModal && 'MutationObserver' in window) {
    var cmOpen = false;
    new MutationObserver(function () {
      var open = contactModal.classList.contains('is-open');
      if (open && !cmOpen) { cmOpen = true; logEvent('contact_open', {}); }
      else if (!open && cmOpen) { cmOpen = false; logEvent('contact_close', {}); }
    }).observe(contactModal, { attributes: true, attributeFilter: ['class'] });
  }
  var cForm = document.getElementById('contactForm');
  if (cForm) cForm.addEventListener('submit', function () { logEvent('contact_submit', {}); });

  /* ---- Share bar (selection mode) ---- */
  var sharebar = document.getElementById('sharebar');
  if (sharebar && 'MutationObserver' in window) {
    var sbOpen = false;
    new MutationObserver(function () {
      var open = sharebar.classList.contains('is-open');
      if (open && !sbOpen) { sbOpen = true; logEvent('selection_mode_open', {}); }
      else if (!open && sbOpen) { sbOpen = false; logEvent('selection_mode_close', {}); }
    }).observe(sharebar, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---- Delegated click tracking ---- */
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var el;
    if ((el = e.target.closest('a[href*="wa.me"]'))) logEvent('whatsapp_click', { href: el.href });
    else if (e.target.closest('#shareGenerate')) {
      var sl = document.getElementById('shareLink');
      logEvent('share_link_generated', { link: sl ? sl.value : '' });
    }
    else if ((el = e.target.closest('.suggest__item'))) logEvent('suggestion_click', {});
    else if ((el = e.target.closest('.reel'))) logEvent('reel_click', { id: el.dataset.id || '' });
    else if ((el = e.target.closest('a[target="_blank"]'))) logEvent('outbound_click', { href: el.href });
  }, true);

  window.addEventListener('gsa:lang', function (e) {
    logEvent('lang_switch', { lang: e.detail && e.detail.lang });
  });

  /* ---- Search queries ---- */
  var searchEl = document.getElementById('projectFilter');
  var searchTimer = null;
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var v = searchEl.value.trim();
      if (v.length < 2) return;
      searchTimer = setTimeout(function () { logEvent('search_query', { term: v }); }, 800);
    });
  }

  /* ---- Session report by email (one per visit) ----
     Local → captured by Mailpit; production → Apps Script relay. */
  function report() {
    if (!REPORT_ENABLED || session.uploaded) return;
    session.uploaded = true;
    persist();
    var summary = {};
    Object.keys(session).forEach(function (k) { summary[k] = session[k]; });
    summary.events = session.events.slice(-120);
    safe(function () {
      window.gsaSendMail(
        {
          from: 'monitoring@gsa-creatives.local',
          fromName: 'Monitoring Portfolio GSA (local)',
          to: 'gsacreatives@gmail.com',
          subject: '[GSA Analytics] Visite — ' + (session.geo || session.ip || session.device.type) + ' — ' + session.startedAt,
          text: JSON.stringify(summary, null, 2)
        },
        { type: 'analytics', session: summary },
        true
      ).catch(function () { });
    });
  }
  window.addEventListener('pagehide', report);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') report();
  });

  window.GSA_TRACKER = { getData: load, logEvent: logEvent };
})();
