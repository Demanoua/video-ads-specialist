/* =========================================================
   LIFESCHÉDIO — Shared relay config + transport
   Loaded by BOTH index.html and the admin console, BEFORE
   tracker.js / main.js / admin-cms.js.

   The portfolio has no server (GitHub Pages is static): ALL
   outbound traffic goes through YOUR Google Apps Script Web
   App (assets/mail-relay.gs) — contact briefs, visit reports
   AND cms publishes (git pushes). NEVER put a Gmail/SMTP
   password or GitHub token anywhere in this repo — secrets
   live in the relay's Script Properties.
   ========================================================= */

/* ---- Relay endpoint (/exec URL of your Apps Script Web App) ---- */
window.GSA_RELAY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxgAGuQovEaknrXw7J8n6NHShF5ZFjQFifDimXMA8c0OKiia7lHuvymGaJFxTNrGTX9/exec';

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
      From: { Email: msg.from, Name: msg.fromName || 'LifeSchédio (local)' },
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

/* CMS publish/admin transport — REAL result via no-cors POST + JSONP receipt.
   Two hard limits make a direct read impossible: Apps Script sends no CORS
   header (fetch can't read the response) AND its /exec POST answer is a 302
   carrying "X-Frame-Options: SAMEORIGIN" + "frame-ancestors 'self'" (a receipt
   page can never render in a hidden iframe — verified empirically). What
   always works cross-origin: a fire-and-forget fetch to SEND, and a JSONP
   <script src> GET to READ. So gsaRelayPost POSTs the payload with a unique
   rid, then polls the relay's doGet(type=_receipt&rid=…) every 2 s until the
   result appears in the relay cache (written by doPost before answering).

   payload : any object; a unique rid is attached automatically.
   Returns a Promise resolving with the relay's result object
   ({ok:true} | {ok:false,error,detail?}) and rejecting after timeoutMs
   (default 30 s) = relay unreachable / network down. */
window.gsaRelayPost = function (payload, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var endpoint = window.GSA_RELAY_ENDPOINT;
    if (!endpoint) { reject(new Error('relay_not_configured')); return; }
    if (!window.gsaRelayPending) window.gsaRelayPending = {};
    var pending = window.gsaRelayPending;
    var rid = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    var deadline = Date.now() + (timeoutMs || 30000);
    var pollTimer = null;
    var lastScript = null;

    function cleanup() {
      clearTimeout(pollTimer);
      delete pending[rid];
      if (lastScript && lastScript.parentNode) lastScript.parentNode.removeChild(lastScript);
    }
    /* Global JSONP callback, shared by concurrent calls and filtered by rid.
       A null result means "not stored yet": polling keeps going. */
    window.gsaRelayReceipt = function (gotRid, result) {
      var entry = pending[gotRid];
      if (!entry) return;
      if (result) { entry.cleanup(); entry.resolve(result); }
    };

    pending[rid] = { resolve: resolve, reject: reject, cleanup: cleanup };

    // 1) send — fire-and-forget: the response is unreadable cross-origin anyway
    try {
      payload.rid = rid; // relay keys its cached result on this
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(function () { });
    } catch (e) { }

    // 2) JSONP receipt poll every 2 s until the overall deadline
    function poll() {
      if (Date.now() > deadline) {
        var entry = pending[rid];
        if (entry) { entry.cleanup(); entry.reject(new Error('relay_timeout')); }
        return;
      }
      if (lastScript && lastScript.parentNode) lastScript.parentNode.removeChild(lastScript);
      var s = document.createElement('script');
      s.src = endpoint +
        (endpoint.indexOf('?') === -1 ? '?' : '&') +
        'type=_receipt&rid=' + encodeURIComponent(rid) +
        '&_=' + Date.now(); // cache-buster
      s.onerror = function () { }; // transient failure: retried next cycle
      lastScript = s;
      document.body.appendChild(s);
      pollTimer = setTimeout(poll, 2000);
    }
    poll();
  });
};
