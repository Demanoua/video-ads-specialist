/* =========================================================
   GSA CREATIVES — Admin CMS (site content manager)
   Stores overrides in localStorage ('gsa_cms_v1'), read by
   main.js on the homepage: site name, extra projects,
   extra testimonials.
   Per-browser by design (static host = no database).
   Use "Export JSON" to persist changes into the code.
   ========================================================= */
(function () {
  'use strict';

  var KEY = 'gsa_cms_v1';
  var MAX_IMG = 1.5 * 1024 * 1024; // 1.5 MB before base64 inflation
  var MAX_VID = 3 * 1024 * 1024;   // 3 MB — videos this small are rare;
                                   // prefer a direct URL (see placeholder)

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s); }

  function load() {
    var empty = { siteName: '', projects: [], testimonials: [] };
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && typeof d === 'object') {
        empty.siteName = typeof d.siteName === 'string' ? d.siteName : '';
        empty.projects = Array.isArray(d.projects) ? d.projects : [];
        empty.testimonials = Array.isArray(d.testimonials) ? d.testimonials : [];
      }
    } catch (e) { }
    return empty;
  }
  function save(d) {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
      flash('Saved. Reload the homepage (this browser) to see it.', 'ok');
      return true;
    } catch (e) {
      flash('Storage full — browser quota ~5 MB. Use direct URLs or smaller files.', 'err');
      return false;
    }
  }

  var flashTimer = null;
  function flash(msg, kind) {
    var el = $('cmsFlash');
    if (!el) return;
    el.textContent = msg;
    el.className = 'cms__flash is-' + (kind || 'ok');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.className = 'cms__flash'; }, 5000);
  }

  /* ---------------- Settings (site name) ---------------- */
  var siteInput = $('cmsSiteName');
  if (siteInput) {
    siteInput.value = load().siteName;
    var siteBtn = $('cmsSiteSave');
    if (siteBtn) siteBtn.addEventListener('click', function () {
      var d = load();
      d.siteName = siteInput.value.trim();
      if (save(d)) renderAll();
    });
  }

  /* ---------------- File -> base64 data URL ---------------- */
  function readFile(input, maxBytes, label, done) {
    var f = input && input.files && input.files[0];
    if (!f) { done(null); return; }
    if (f.size > maxBytes) {
      flash(label + ' is too large (' + Math.round(f.size / 1024) + ' KB). Max ' +
        Math.round(maxBytes / 1024) + ' KB — prefer a direct URL.', 'err');
      input.value = '';
      done(null);
      return;
    }
    var r = new FileReader();
    r.onload = function () { done(String(r.result)); };
    r.onerror = function () { flash('Could not read ' + label + '.', 'err'); done(null); };
    r.readAsDataURL(f);
  }

  /* ---------------- Projects ---------------- */
  var projList = $('projList');
  function renderProjects() {
    if (!projList) return;
    var items = load().projects;
    projList.innerHTML = '';
    if (!items.length) {
      projList.innerHTML = '<li class="cms__empty">No custom projects yet — the homepage shows the built-in catalog only.</li>';
      return;
    }
    items.forEach(function (p) {
      var li = document.createElement('li');
      var thumb = document.createElement('span');
      thumb.className = 'cms__thumb';
      if (p.img) {
        var im = document.createElement('img');
        im.src = p.img;
        im.alt = '';
        thumb.appendChild(im);
      } else {
        thumb.textContent = p.title.charAt(0).toUpperCase();
      }
      li.appendChild(thumb);
      var mid = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = p.title;
      mid.appendChild(strong);
      var meta = document.createElement('span');
      meta.textContent = p.tag + ' · ' + (p.img ? 'image set' : 'no image') + ' · video: ' +
        (p.video.indexOf('data:') === 0 ? 'embedded file' : p.video);
      mid.appendChild(meta);
      li.appendChild(mid);
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn--ghost btn--sm';
      del.textContent = 'Delete';
      del.addEventListener('click', function () {
        var d = load();
        d.projects = d.projects.filter(function (x) { return x.id !== p.id; });
        if (save(d)) renderAll();
      });
      li.appendChild(del);
      projList.appendChild(li);
    });
  }

  var projForm = $('projForm');
  if (projForm) projForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = $('cf-p-title').value.trim();
    var tag = $('cf-p-tag').value.trim();
    var imgUrl = $('cf-p-img-url').value.trim();
    var vidUrl = $('cf-p-vid-url').value.trim();
    if (!title) { flash('Project title is required.', 'err'); return; }

    var pending = 2; // image + video async reads
    var imgData = null, vidData = null;
    function finish() {
      if (--pending > 0) return;
      var d = load();
      d.projects.push({
        id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        title: title,
        tag: tag || 'Custom project',
        img: imgData || imgUrl || '',
        video: vidData || vidUrl || ''
      });
      if (!d.projects[d.projects.length - 1].video) {
        flash('A video (URL or small file) is required for the project to display.', 'err');
        return;
      }
      if (save(d)) {
        projForm.reset();
        renderAll();
      }
    }
    readFile($('cf-p-img-file'), MAX_IMG, 'Image', function (data) { imgData = data; finish(); });
    readFile($('cf-p-vid-file'), MAX_VID, 'Video file', function (data) { vidData = data; finish(); });
  });

  /* ---------------- Testimonials ---------------- */
  var tmnList = $('tmnList');
  function renderTmn() {
    if (!tmnList) return;
    var items = load().testimonials;
    tmnList.innerHTML = '';
    if (!items.length) {
      tmnList.innerHTML = '<li class="cms__empty">No custom testimonials yet.</li>';
      return;
    }
    items.forEach(function (t) {
      var li = document.createElement('li');
      var div = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = t.name;
      div.appendChild(strong);
      var meta = document.createElement('span');
      meta.textContent = (t.role || '') + (t.photo ? ' · photo set' : '');
      div.appendChild(meta);
      li.appendChild(div);
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn--ghost btn--sm';
      del.textContent = 'Delete';
      del.addEventListener('click', function () {
        var d = load();
        d.testimonials = d.testimonials.filter(function (x) { return x.id !== t.id; });
        if (save(d)) renderAll();
      });
      li.appendChild(del);
      tmnList.appendChild(li);
    });
  }

  var tmnForm = $('tmnForm');
  if (tmnForm) tmnForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('cf-t-name').value.trim();
    var text = $('cf-t-text').value.trim();
    if (!name || !text) { flash('Name and testimonial text are required.', 'err'); return; }
    var d = load();
    d.testimonials.push({
      id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      name: name,
      role: $('cf-t-role').value.trim(),
      text: text,
      photo: $('cf-t-photo').value.trim()
    });
    if (save(d)) {
      tmnForm.reset();
      renderAll();
    }
  });

  /* ---------------- Export ---------------- */
  var exportBtn = $('cmsExport');
  if (exportBtn) exportBtn.addEventListener('click', function () {
    var d = load();
    var hasContent = d.siteName || d.projects.length || d.testimonials.length;
    if (!hasContent) { flash('Nothing to export yet.', 'err'); return; }
    var blob = new Blob([JSON.stringify({ key: KEY, data: d }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gsa-cms.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    flash('Exported gsa-cms.json — keep it as a backup or send it to persist into the code.', 'ok');
  });

  /* ---------------- Publish to the site (commit cms.json to git) ----------------
     Local → the push is CAPTURED by Mailpit, the repo is untouched.
     Production → the relay commits assets/data/cms.json to the repo;
     GitHub Pages rebuilds (~1 min) and every visitor sees the change. */
  var PUBKEY_KEY = 'gsa_pub_key';
  var pubKeyInput = $('cmsPubKey');
  if (pubKeyInput) {
    try { pubKeyInput.value = localStorage.getItem(PUBKEY_KEY) || ''; } catch (e) { }
  }
  var pubBtn = $('cmsPublish');
  var pubStatus = $('pubStatus');
  function pubFlash(msg, kind) {
    if (pubStatus) {
      pubStatus.textContent = msg;
      pubStatus.className = 'cms__flash is-' + (kind || 'ok');
    }
    flash(msg, kind);
  }
  if (pubBtn) pubBtn.addEventListener('click', function () {
    var key = pubKeyInput ? pubKeyInput.value.trim() : '';
    if (!key) { pubFlash('Enter your publish key first (GSA_PUBLISH_KEY in the Apps Script project).', 'err'); return; }
    try { localStorage.setItem(PUBKEY_KEY, key); } catch (e) { }
    var d = load();
    if (!d.siteName && !d.projects.length && !d.testimonials.length) {
      pubFlash('Nothing to publish yet — first add a project, a testimonial or a site name (panels 1-3).', 'err');
      return;
    }
    var target, body;
    if (window.GSA_IS_LOCAL) {
      target = window.GSA_LOCAL_MAIL_API;
      body = JSON.stringify({
        From: { Email: 'cms@gsa-creatives.local', Name: 'CMS Publish (local test)' },
        To: [{ Email: 'gsacreatives@gmail.com' }],
        Subject: '[CMS push — local test] assets/data/cms.json',
        Text: JSON.stringify(d, null, 2)
      });
    } else {
      target = window.GSA_RELAY_ENDPOINT;
      body = JSON.stringify({ type: 'cms_push', key: key, cms: d });
    }
    if (!target) { pubFlash('Relay URL missing (GSA_RELAY_ENDPOINT in assets/js/tracker.js).', 'err'); return; }
    pubBtn.classList.add('is-loading');
    pubFlash(window.GSA_IS_LOCAL ? 'Capturing in Mailpit (repo untouched)…' : 'Publishing…', 'ok');
    var fetchOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body
    };
    if (!window.GSA_IS_LOCAL) fetchOpts.mode = 'no-cors'; // local: CORS mode to read the result
    fetch(target, fetchOpts)
      .then(function (res) {
        if (window.GSA_IS_LOCAL && res && !res.ok) throw new Error('mailpit rejected the push');
        pubFlash(window.GSA_IS_LOCAL
          ? 'Local test OK — captured by Mailpit. In production this commits cms.json; Pages rebuilds in ~1 min.'
          : 'Publish sent — GitHub Pages rebuilds in ~1 minute. Hard-reload the homepage to see it live for everyone.', 'ok');
      })
      .catch(function () {
        pubFlash(window.GSA_IS_LOCAL
          ? 'Local capture failed — is Mailpit running with --api-cors?'
          : 'Publish failed — network error.', 'err');
      })
      .finally(function () { pubBtn.classList.remove('is-loading'); });
  });

  function renderAll() { renderProjects(); renderTmn(); }
  renderAll();
})();
