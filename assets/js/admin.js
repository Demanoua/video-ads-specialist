/* =========================================================
   GSA CREATIVES — Admin dashboard
   Reads 'gsa_analytics_v1' written by tracker.js.
   Gate: SHA-256 password check (client-side obfuscation only
   — a static host has no real auth; keep this URL private).
   Default password: gsa2025 — to change it, replace
   ADMIN_HASH with sha256 hex of your new password.
   ========================================================= */
(function () {
  'use strict';

  var ADMIN_HASH = '945f8230fcba044c28541b38fcca399cdb11885addef3d485c5620b812c9d812'; // sha256('gsa2025')
  var KEY = 'gsa_analytics_v1';
  var UNLOCK_KEY = 'gsa_admin_unlocked';

  var gate = document.getElementById('gate');
  var dash = document.getElementById('dash');
  var passEl = document.getElementById('adminPass');
  var gateMsg = document.getElementById('gateMsg');

  function sha256(text) {
    if (!window.crypto || !crypto.subtle) return Promise.resolve(null);
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  function unlock() {
    gate.hidden = true;
    dash.hidden = false;
    try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch (e) { }
    render();
  }
  function lock() {
    dash.hidden = true;
    gate.hidden = false;
    try { sessionStorage.removeItem(UNLOCK_KEY); } catch (e) { }
    if (passEl) passEl.value = '';
  }

  function tryUnlock() {
    var val = passEl ? passEl.value : '';
    if (!val) { gateMsg.textContent = 'Enter your password.'; return; }
    sha256(val).then(function (hash) {
      if (hash && hash === ADMIN_HASH) {
        gateMsg.textContent = '';
        unlock();
      } else {
        gateMsg.textContent = 'Wrong password.';
      }
    });
  }

  var unlockBtn = document.getElementById('unlockBtn');
  if (unlockBtn) unlockBtn.addEventListener('click', tryUnlock);
  if (passEl) passEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });

  var lockBtn = document.getElementById('lockBtn');
  if (lockBtn) lockBtn.addEventListener('click', lock);

  try {
    if (sessionStorage.getItem(UNLOCK_KEY) === '1') { gate.hidden = true; dash.hidden = false; }
  } catch (e) { }

  /* ---------------- Data ---------------- */
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.visits) return d.visits;
    } catch (e) { }
    return [];
  }

  function fmtSeconds(s) {
    s = Math.round(s || 0);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    var out = '';
    if (h) out += h + 'h ';
    if (h || m) out += (h && m < 10 ? '0' + m : m) + 'min ';
    out += (sec < 10 ? '0' + sec : sec) + 's';
    return out.trim();
  }
  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    } catch (e) { return iso; }
  }
  function watchTotal(v) {
    var t = 0;
    Object.keys(v.videoWatch || {}).forEach(function (k) { t += v.videoWatch[k]; });
    return t;
  }
  function el(tag, text) {
    var e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  /* ---------------- Render ---------------- */
  function render() {
    var visits = load().slice().reverse(); // newest first
    var statCards = document.getElementById('statCards');
    var body = document.getElementById('visitsBody');
    var detail = document.getElementById('detail');
    if (!statCards || !body) return;

    var totalWatch = 0, withVideos = 0, totalEvents = 0;
    visits.forEach(function (v) {
      var wt = watchTotal(v);
      totalWatch += wt;
      if (Object.keys(v.videoWatch || {}).length) withVideos++;
      totalEvents += (v.events || []).length;
    });

    statCards.innerHTML = '';
    [
      [String(visits.length), 'Total visits'],
      [String(withVideos), 'Sessions with video plays'],
      [fmtSeconds(totalWatch), 'Total watch time'],
      [String(totalEvents), 'Actions logged']
    ].forEach(function (pair) {
      var box = el('div');
      box.appendChild(el('strong', pair[0]));
      box.appendChild(el('span', pair[1]));
      statCards.appendChild(box);
    });

    body.innerHTML = '';
    if (!visits.length) {
      var tr = el('tr');
      var td = el('td', 'No visits recorded yet. Browse the portfolio (same browser) and refresh.');
      td.colSpan = 9;
      td.style.textAlign = 'center';
      td.style.padding = '2.5rem 1rem';
      td.style.color = 'var(--text-2)';
      tr.appendChild(td);
      body.appendChild(tr);
    }

    visits.forEach(function (v) {
      var tr = el('tr');
      tr.appendChild(el('td', fmtDate(v.startedAt)));
      tr.appendChild(el('td', v.geo || '—'));
      tr.appendChild(el('td', v.ip || '—'));
      tr.appendChild(el('td', (v.device ? v.device.type + ' · ' + v.device.browser + ' · ' + v.device.os : '—')));
      tr.appendChild(el('td', v.lang || '—'));
      tr.appendChild(el('td', String(Object.keys(v.videoWatch || {}).length)));
      tr.appendChild(el('td', fmtSeconds(watchTotal(v))));
      tr.appendChild(el('td', String((v.events || []).length)));
      var repTd = el('td');
      var pill = el('span', v.uploaded ? 'email sent' : 'local only');
      pill.className = 'pill ' + (v.uploaded ? 'pill--ok' : 'pill--off');
      repTd.appendChild(pill);
      tr.appendChild(repTd);
      tr.addEventListener('click', function () { showDetail(v, detail, tr); });
      body.appendChild(tr);
    });
  }

  function showDetail(v, detail, row) {
    if (!detail) return;
    var already = detail.dataset.sid === v.id && detail.classList.contains('is-open');
    document.querySelectorAll('#visitsBody tr').forEach(function (r) { r.style.background = ''; });
    if (already) { detail.classList.remove('is-open'); detail.dataset.sid = ''; return; }
    row.style.background = 'rgba(204,255,0,0.06)';
    detail.dataset.sid = v.id;
    detail.innerHTML = '';
    detail.appendChild(el('h2', 'Session — ' + fmtDate(v.startedAt)));

    var dl = el('dl');
    [
      ['Device', v.device ? v.device.type + ' · ' + v.device.browser + ' · ' + v.device.os : '—'],
      ['Screen', v.screen || '—'],
      ['Language', v.lang || '—'],
      ['Timezone', v.tz || '—'],
      ['IP', v.ip || '—'],
      ['Location', v.geo || '—'],
      ['Referrer', v.referrer || 'direct'],
      ['Landing hash', v.landing || '—'],
      ['User-Agent', v.userAgent || '—']
    ].forEach(function (pair) {
      dl.appendChild(el('dt', pair[0]));
      dl.appendChild(el('dd', pair[1]));
    });
    detail.appendChild(dl);

    detail.appendChild(el('h3', 'Videos watched (' + Object.keys(v.videoWatch || {}).length + ')'));
    if (Object.keys(v.videoWatch || {}).length) {
      var vdl = el('dl');
      Object.keys(v.videoWatch).forEach(function (title) {
        vdl.appendChild(el('dt', title));
        vdl.appendChild(el('dd', fmtSeconds(v.videoWatch[title])));
      });
      detail.appendChild(vdl);
    } else {
      detail.appendChild(el('p', 'No video watched during this session.'));
    }

    detail.appendChild(el('h3', 'Event log (' + (v.events || []).length + ')'));
    var log = el('div');
    log.className = 'evlog';
    (v.events || []).slice().reverse().forEach(function (ev) {
      var line = el('div');
      line.appendChild(el('time', fmtDate(ev.t)));
      line.appendChild(el('span', ev.type));
      var code = el('code', JSON.stringify(ev.data || {}));
      line.appendChild(code);
      log.appendChild(line);
    });
    if (!(v.events || []).length) log.appendChild(el('div', '—'));
    detail.appendChild(log);

    detail.classList.add('is-open');
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  var refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', render);

  var exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', function () {
    var blob = new Blob([JSON.stringify({ version: 1, visits: load() }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gsa-analytics.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  var clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    if (!window.confirm('Delete all analytics data from this browser?')) return;
    try { localStorage.removeItem(KEY); } catch (e) { }
    render();
  });

  if (!dash.hidden) render();
})();
