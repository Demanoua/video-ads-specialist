/* =========================================================
   GSA CREATIVES — Shared relay config + transport
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
window.GSA_RELAY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzQHW_9XUpWJ5mfspPwZbFVRNvZs48Azu33gCy5W99aC0HqVSgjSorHGKJfR0VPUaFV/exec';

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
