/* =========================================================
   GSA CREATIVES — Portfolio · Vanilla JS
   - Mobile menu toggle (+ auto-close on desktop resize)
   - IntersectionObserver reveal
   - Showreel engine: random 5 tiles, random layout per load
   - Project search across the full catalog
   - Client-link builder: select videos -> #selection=... slug
   - Hash routing (#selection=p1,p3 / #showreel=p5)
   - Showreel lightbox
   - Collapsible contact form (Formspree AJAX)
   - Dynamic footer year
   ========================================================= */
(function () {
  'use strict';

  /* =====================================================
     PROJECT CATALOG — single source of truth
     ===================================================== */
  var PROJECTS = [
    { id: 'p1', title: 'Aurora Apparel — Afro Kinky Bulk 100% unprocessed human hair', tag: 'E-commerce · TikTok', img: 'assets/images/Portrait-n_on-nocturnec.png', video: 'assets/videos/ad1.mp4' },
    { id: 'p2', title: 'Voice-over — Afro Kinky Bulk 100% human hair', tag: 'E-commerce · TikTok Pre-roll', img: 'assets/images/cta-kiss.png', video: 'assets/videos/voix_off.mp4' },
    { id: 'p3', title: 'Pulse — Faded utility jeans for women Campaign', tag: 'UGC Campaign · Meta Ads', img: 'assets/images/pose-lisse.png', video: 'assets/videos/first.mp4' },
    { id: 'p4', title: 'Hook Variations — Afro Kinky Bulk 100% human hair', tag: 'UGC · E-commerce · TikTok', img: 'assets/images/ugc.png', video: 'assets/videos/UGC.mp4' },
    { id: 'p5', title: 'Testimonial — Afro Kinky Bulk 100% human hair', tag: 'Testimonial · Multi-platform', img: 'assets/images/mirror-check.png', video: 'assets/videos/Temoignage.mp4' },
    { id: 'p6', title: 'Couple in the confessional — Problem Statement + Solution', tag: 'Double Root Coffee · 100% Natural and Vegetarian', img: 'assets/images/d2.png', video: 'assets/videos/d2.mp4' },
    { id: 'p7', title: 'UGC — Double Root Coffee', tag: 'Meta Ads Campaign', img: 'assets/images/d3.png', video: 'assets/videos/d3.mp4' },
    { id: 'p8', title: 'Podcast UGC — Problem Statement + Solution', tag: 'UGC — Hook Variations', img: 'assets/images/d1.jpeg', video: 'assets/videos/d1.mp4' },
    { id: 'p9', title: 'Street Interviews — Problem Statement + Solution', tag: 'Double Root Coffee · 100% Natural and Vegetarian', img: 'assets/images/d4.png', video: 'assets/videos/d4.mp4' },
    { id: 'p10', title: 'Hook variation — Meta Ads Campaign', tag: 'Lifestyle · Double Root Coffee', img: 'assets/images/d5.png', video: 'assets/videos/d5.mp4' },
    { id: 'p11', title: "Mothers' Days subscriber audience", tag: "Mothers' Days", img: 'assets/images/v1.png', video: 'assets/videos/V1.mp4' },
    { id: 'p12', title: 'Vin — Meta Ads Campaign', tag: 'Vin · Meta', img: 'assets/images/face-inquirer.png', video: 'assets/videos/celebration.mp4' },
    { id: 'p13', title: 'VIN — short film tv', tag: 'Vin · short film', img: 'assets/images/truck-bed.png', video: 'assets/videos/Metrage.mp4' },
    { id: 'p14', title: 'UGC Vin spot Campaign', tag: 'VIN · SPOT', img: 'assets/images/vin.png', video: 'assets/videos/vin.mp4' },
    { id: 'p15', title: 'Avatar — AI Coach Training', tag: 'Welcome · Training', img: 'assets/images/intro.png', video: 'assets/videos/Video_Intro.mp4' },
    { id: 'p16', title: 'UGC Razor Campaign', tag: 'Razor · Meta', img: 'assets/images/crea1.png', video: 'assets/videos/Creative1.mp4' },
    { id: 'p17', title: 'Pulse — UGC Razor Campaign', tag: 'Razor · Meta', img: 'assets/images/crea2.png', video: 'assets/videos/Creative2.mp4' },
    { id: 'p18', title: 'UGC Razor Campaign', tag: 'Razor · Meta', img: 'assets/images/crea3.png', video: 'assets/videos/Creative3.mp4' },
    { id: 'p19', title: 'Pulse — Support for the National Team', tag: 'influencer · Meta · TikTok', img: 'assets/images/insane_avatar.png', video: 'assets/videos/Voix-AI-emotion.mp4' }
  ];

  var SIZE_PATTERNS = [
    ['reel--lg', '', '', '', 'reel--wide'],
    ['', 'reel--lg', 'reel--wide', '', ''],
    ['reel--wide', '', '', 'reel--lg', ''],
    ['', 'reel--wide', '', 'reel--lg', ''],
    ['reel--lg', '', 'reel--wide', '', '']
  ];

  function byId(id) {
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].id === id) return PROJECTS[i];
    return null;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* =====================================================
     Footer year
     ===================================================== */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     Mobile menu
     ===================================================== */
  var burger = document.querySelector('.nav__burger');
  var menu = document.getElementById('mobileMenu');
  var menuLinks = menu ? menu.querySelectorAll('a') : [];

  function setMenu(open) {
    if (!burger || !menu) return;
    burger.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
  }
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  // The hamburger is mobile-only: never leave it open on desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) setMenu(false);
  });

  /* =====================================================
     Reveal on scroll
     ===================================================== */
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  function observeReveals(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.is-visible)');
    els.forEach(function (el, i) {
      if (io) {
        el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
        io.observe(el);
      } else {
        el.classList.add('is-visible');
      }
    });
  }
  observeReveals(document);

  /* =====================================================
     Showreel engine
     ===================================================== */
  var showreelSection = document.getElementById('showreel');
  var grid = document.getElementById('showreelGrid');
  var toolbar = document.querySelector('.showreel__toolbar');
  var searchInput = document.getElementById('projectFilter');
  var searchClear = document.getElementById('projectFilterClear');
  var countEl = document.getElementById('projectFilterCount');
  var notice = document.getElementById('selectionNotice');
  var noticeCount = document.getElementById('selectionCount');
  var exitSelectionBtn = document.getElementById('exitSelection');
  var shareToggle = document.getElementById('shareToggle');
  var sharebar = document.getElementById('sharebar');
  var shareCount = document.getElementById('shareCount');
  var shareLink = document.getElementById('shareLink');
  var shareGenerate = document.getElementById('shareGenerate');
  var shareCopy = document.getElementById('shareCopy');
  var shareExit = document.getElementById('shareExit');
  var shareStatus = document.getElementById('shareStatus');

  // Pages fixed once per load: same shuffled order until reload
  var defaultPages = [];
  (function () {
    var shuffled = shuffle(PROJECTS);
    for (var i = 0; i < shuffled.length; i += 5) defaultPages.push(shuffled.slice(i, i + 5));
  })();
  var pageIndex = 0;
  var track = null;
  var swipeSuppressUntil = 0;

  var stage = document.getElementById('showreelStage');
  var controls = document.getElementById('showreelControls');
  var prevBtn = document.getElementById('showreelPrev');
  var nextBtn = document.getElementById('showreelNext');
  var pagerEl = document.getElementById('showreelPager');

  var state = {
    term: '',
    selectMode: false,
    selected: [] // project ids, in pick order
  };

  function setCount(html) {
    if (!countEl) return;
    countEl.innerHTML = html || '';
  }

  function buildTile(p, sizeClass) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reel reveal' + (sizeClass ? ' ' + sizeClass : '');
    btn.setAttribute('data-testid', 'reel-' + p.id);
    btn.dataset.id = p.id;
    btn.setAttribute('aria-label', 'Play: ' + p.title);

    var img = document.createElement('img');
    img.src = p.img;
    img.alt = p.tag;
    img.loading = 'lazy';
    btn.appendChild(img);

    var overlay = document.createElement('div');
    overlay.className = 'reel__overlay';
    var tag = document.createElement('span');
    tag.className = 'reel__tag';
    tag.textContent = p.tag;
    var title = document.createElement('h3');
    title.className = 'reel__title';
    title.textContent = p.title;
    overlay.appendChild(tag);
    overlay.appendChild(title);
    btn.appendChild(overlay);

    var check = document.createElement('span');
    check.className = 'reel__check';
    check.setAttribute('aria-hidden', 'true');
    check.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
    btn.appendChild(check);

    var play = document.createElement('span');
    play.className = 'reel__play';
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    btn.appendChild(play);

    if (state.selected.indexOf(p.id) !== -1) btn.classList.add('is-selected');

    btn.addEventListener('click', function () {
      if (Date.now() < swipeSuppressUntil) return; // ignore the click that ends a swipe
      if (state.selectMode) {
        toggleSelect(p.id, btn);
      } else {
        openLightbox(p.title, p.tag, p.video);
      }
    });
    return btn;
  }

  function render(list, sizes) {
    if (!grid) return;
    grid.classList.remove('is-paged');
    track = null;
    if (controls) controls.hidden = true;
    grid.innerHTML = '';
    list.forEach(function (p, i) {
      grid.appendChild(buildTile(p, sizes ? sizes[i] : ''));
    });
    // Animated entrance for the fresh tiles
    var tiles = grid.querySelectorAll('.reel');
    tiles.forEach(function (tile, i) {
      setTimeout(function () { tile.classList.add('is-visible'); }, 40 + i * 55);
    });
  }

  function matches(p, term) {
    return (p.title + ' ' + p.tag).toLowerCase().indexOf(term) !== -1;
  }

  /* ---------- Paged swipe slider ---------- */
  function buildPaged(pages) {
    if (!grid) return;
    grid.classList.add('is-paged');
    grid.innerHTML = '';
    track = document.createElement('div');
    track.className = 'showreel__track';
    pages.forEach(function (pageProjects) {
      var page = document.createElement('div');
      page.className = 'showreel__page';
      var pattern = SIZE_PATTERNS[Math.floor(Math.random() * SIZE_PATTERNS.length)];
      pageProjects.forEach(function (p, i) {
        page.appendChild(buildTile(p, pattern[i]));
      });
      track.appendChild(page);
    });
    grid.appendChild(track);
    if (controls) controls.hidden = false;
    goToPage(0, true);
    var tiles = grid.querySelectorAll('.reel');
    tiles.forEach(function (tile, i) {
      setTimeout(function () { tile.classList.add('is-visible'); }, 40 + i * 40);
    });
  }

  function goToPage(i, instant) {
    if (!track) return;
    pageIndex = Math.max(0, Math.min(i, defaultPages.length - 1));
    if (instant) track.style.transition = 'none';
    track.style.transform = 'translateX(-' + pageIndex * 100 + '%)';
    if (instant) {
      void track.offsetWidth; // reflow, then restore the transition
      track.style.transition = '';
    }
    if (pagerEl) pagerEl.textContent = (pageIndex + 1) + ' / ' + defaultPages.length;
    if (prevBtn) prevBtn.disabled = pageIndex === 0;
    if (nextBtn) nextBtn.disabled = pageIndex === defaultPages.length - 1;
  }

  var dragStartX = 0, dragStartY = 0, dragDx = 0, dragActive = false, dragHorizontal = false;

  if (stage) {
    stage.addEventListener('pointerdown', function (e) {
      if (!grid.classList.contains('is-paged') || !track) return;
      dragActive = true;
      dragHorizontal = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragDx = 0;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragActive || !track) return;
      dragDx = e.clientX - dragStartX;
      var dy = e.clientY - dragStartY;
      if (!dragHorizontal) {
        if (Math.abs(dragDx) > 10 && Math.abs(dragDx) > Math.abs(dy)) dragHorizontal = true;
        else if (Math.abs(dy) > 10) dragActive = false; // vertical scroll wins
      }
      if (dragHorizontal) {
        var base = -pageIndex * grid.clientWidth;
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + (base + dragDx) + 'px)';
      }
    });
    window.addEventListener('pointerup', function () {
      if (!dragActive) return;
      dragActive = false;
      if (!track) return;
      track.style.transition = '';
      if (dragHorizontal) {
        if (Math.abs(dragDx) > 60) goToPage(pageIndex + (dragDx < 0 ? 1 : -1));
        else goToPage(pageIndex);
        swipeSuppressUntil = Date.now() + 350;
      }
      dragHorizontal = false;
      dragDx = 0;
    });
    if (prevBtn) prevBtn.addEventListener('click', function () {
      if (Date.now() < swipeSuppressUntil) return;
      goToPage(pageIndex - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (Date.now() < swipeSuppressUntil) return;
      goToPage(pageIndex + 1);
    });
  }

  function renderCurrent() {
    if (!grid) return;
    var term = state.term.replace(/\s+/g, ' ').trim().toLowerCase();

    if (term) {
      var results = PROJECTS.filter(function (p) { return matches(p, term); });
      render(results, null);
      if (results.length) {
        setCount('Showing <b>' + results.length + '</b> of ' + PROJECTS.length + ' projects — click a tile to preview.');
        clearEmpty();
      } else {
        setCount('');
        showEmpty(state.term.trim());
      }
      return;
    }

    clearEmpty();
    if (state.selectMode) {
      render(PROJECTS, null);
      setCount('Selection mode — tick any videos, then <b>Generate link</b> for your client.');
    } else {
      buildPaged(defaultPages);
      setCount('Showing <b>5</b> of ' + PROJECTS.length + ' projects — swipe or use the arrows to see more.');
    }
  }

  /* ---------- Empty state ---------- */
  var emptyState = null;
  function showEmpty(term) {
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'projects__empty';
      emptyState.setAttribute('data-testid', 'projects-empty');
      var heading = document.createElement('h3');
      var hint = document.createElement('p');
      hint.textContent = 'Try a platform like TikTok or Meta Ads, a brand like VIN or Pulse, or a format like UGC or spot TV.';
      emptyState.appendChild(heading);
      emptyState.appendChild(hint);
    }
    emptyState.querySelector('h3').textContent = 'No projects match "' + term + '"';
    if (!emptyState.parentNode) grid.appendChild(emptyState);
  }
  function clearEmpty() {
    if (emptyState && emptyState.parentNode) emptyState.parentNode.removeChild(emptyState);
  }

  /* ---------- Search + suggestions ---------- */
  var suggest = document.getElementById('searchSuggest');

  function hideSuggestions() {
    if (suggest) suggest.hidden = true;
  }

  function pickSuggestion(p) {
    hideSuggestions();
    searchInput.value = p.title;
    state.term = p.title;
    searchClear.hidden = false;
    renderCurrent();
    openLightbox(p.title, p.tag, p.video);
  }

  function showSuggestions() {
    if (!suggest || !searchInput || state.selectMode) return;
    var term = searchInput.value.replace(/\s+/g, ' ').trim().toLowerCase();
    var pool = term ? PROJECTS.filter(function (p) { return matches(p, term); }) : PROJECTS;
    if (!pool.length) { hideSuggestions(); return; }
    suggest.innerHTML = '';
    var label = document.createElement('span');
    label.className = 'showreel__suggest-label';
    label.textContent = term ? 'Matching projects' : 'Suggested projects';
    suggest.appendChild(label);
    pool.slice(0, 6).forEach(function (p) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'suggest__item';
      var t = document.createElement('span');
      t.className = 'suggest__item-title';
      t.textContent = p.title;
      var tg = document.createElement('span');
      tg.className = 'suggest__item-tag';
      tg.textContent = p.tag;
      item.appendChild(t);
      item.appendChild(tg);
      item.addEventListener('mousedown', function (e) {
        e.preventDefault(); // mousedown fires before blur, so the click always lands
        pickSuggestion(p);
      });
      suggest.appendChild(item);
    });
    suggest.hidden = false;
  }

  if (searchInput && searchClear) {
    searchInput.addEventListener('input', function () {
      state.term = searchInput.value;
      searchClear.hidden = state.term === '';
      renderCurrent();
      showSuggestions();
    });
    searchInput.addEventListener('focus', showSuggestions);
    searchInput.addEventListener('blur', function () {
      setTimeout(hideSuggestions, 140);
    });
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      state.term = '';
      searchClear.hidden = true;
      renderCurrent();
      hideSuggestions();
      searchInput.focus();
    });
  }

  /* ---------- Selection mode & client links ---------- */
  function toggleSelect(id, btn) {
    var idx = state.selected.indexOf(id);
    if (idx === -1) state.selected.push(id);
    else state.selected.splice(idx, 1);
    if (btn) btn.classList.toggle('is-selected', idx === -1);
    updateSharebar();
  }

  function updateSharebar() {
    var n = state.selected.length;
    shareCount.innerHTML = '<b>' + n + '</b> selected';
    shareGenerate.disabled = n === 0;
    if (n === 0) {
      shareLink.value = '';
      shareCopy.disabled = true;
      shareStatus.textContent = '';
    }
  }

  function setSelectMode(on) {
    state.selectMode = on;
    showreelSection.classList.toggle('is-select-mode', on);
    shareToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    shareToggle.querySelector('span').textContent = on ? 'Exit selection' : 'Build a client link';
    sharebar.classList.toggle('is-open', on);
    sharebar.setAttribute('aria-hidden', on ? 'false' : 'true');
    if (!on) {
      shareStatus.textContent = '';
      shareLink.value = '';
      shareCopy.disabled = true;
    }
    updateSharebar();
    renderCurrent();
  }

  if (shareToggle) {
    shareToggle.addEventListener('click', function () {
      setSelectMode(!state.selectMode);
    });
  }

  if (shareGenerate) {
    shareGenerate.addEventListener('click', function () {
      if (!state.selected.length) return;
      var base = window.location.href.split('#')[0];
      var url = base + '#selection=' + state.selected.join(',');
      shareLink.value = url;
      shareCopy.disabled = false;
      copyText(url, function (ok) {
        shareStatus.textContent = ok
          ? 'Link ready — copied to clipboard. Send it to your client.'
          : 'Link ready — copy it above and send it to your client.';
      });
    });
  }

  if (shareCopy) {
    shareCopy.addEventListener('click', function () {
      if (!shareLink.value) return;
      copyText(shareLink.value, function (ok) {
        shareStatus.textContent = ok ? 'Copied to clipboard.' : 'Copy failed — select the link and copy manually.';
      });
    });
  }

  if (shareExit) {
    shareExit.addEventListener('click', function () { setSelectMode(false); });
  }

  function copyText(text, cb) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(fallbackCopy(text)); });
    } else {
      cb(fallbackCopy(text));
    }
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ---------- Hash routing: #selection=... & #showreel=... ---------- */
  var customActive = false;

  function applyCustomSelection(ids) {
    var list = [];
    ids.forEach(function (id) {
      var p = byId(id);
      if (p && list.indexOf(p) === -1) list.push(p);
    });
    if (!list.length) return false;
    customActive = true;
    state.selected = list.map(function (p) { return p.id; });
    if (toolbar) toolbar.style.display = 'none';
    if (notice) {
      noticeCount.textContent = list.length;
      notice.hidden = false;
    }
    clearEmpty();
    setCount('');
    render(list, null);
    return true;
  }

  function clearCustomSelection() {
    if (!customActive) return;
    customActive = false;
    if (toolbar) toolbar.style.display = '';
    if (notice) notice.hidden = true;
    state.selected = [];
    renderCurrent();
  }

  function handleHash() {
    if (!grid) return;
    var h = window.location.hash || '';

    var sel = h.match(/^#selection=([a-z0-9,\-]+)/i);
    if (sel) {
      var ids = sel[1].split(',').map(function (s) { return s.trim().toLowerCase(); });
      if (applyCustomSelection(ids)) {
        showreelSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }

    var single = h.match(/^#showreel=([a-z0-9\-]+)/i);
    if (single) {
      var p = byId(single[1].toLowerCase());
      if (p) {
        renderCurrent();
        showreelSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        openLightbox(p.title, p.tag, p.video);
        return;
      }
    }

    clearCustomSelection();
  }

  if (exitSelectionBtn) {
    exitSelectionBtn.addEventListener('click', function () {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      clearCustomSelection();
    });
  }
  window.addEventListener('hashchange', handleHash);

  /* =====================================================
     Showreel lightbox
     ===================================================== */
  var lightbox = document.getElementById('lightbox');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxTag = document.getElementById('lightboxTag');
  var lightboxMedia = document.getElementById('lightboxMedia');

  function openLightbox(title, tag, videoUrl) {
    if (!lightbox) return;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Preview';
    if (lightboxTag) lightboxTag.textContent = tag || 'Showreel';
    if (lightboxMedia) {
      if (videoUrl) {
        lightboxMedia.innerHTML =
          '<video controls autoplay playsinline preload="metadata" style="position:absolute;top:0;left:0;width:100%;height:100%;">' +
          '<source src="' + videoUrl + '" type="video/mp4">' +
          'Your browser does not support video playback.' +
          '</video>';
      } else {
        lightboxMedia.innerHTML = '<span class="lightbox__demo">Preview unavailable</span>';
      }
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    var video = lightboxMedia ? lightboxMedia.querySelector('video') : null;
    if (video) video.pause();
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* =====================================================
     Custom selects (stylized dropdowns, design-matched)
     ===================================================== */
  function enhanceSelect(select) {
    var wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('custom-select__native');

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    var triggerText = document.createElement('span');
    triggerText.className = 'custom-select__trigger-text';
    var chev = document.createElement('span');
    chev.className = 'custom-select__chev';
    chev.setAttribute('aria-hidden', 'true');
    chev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
    trigger.appendChild(triggerText);
    trigger.appendChild(chev);
    wrapper.appendChild(trigger);

    var panel = document.createElement('div');
    panel.className = 'custom-select__panel';
    panel.setAttribute('role', 'listbox');
    var optionBtns = [];
    Array.prototype.forEach.call(select.options, function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-select__option';
      btn.setAttribute('role', 'option');
      btn.dataset.value = opt.value;
      var txt = document.createElement('span');
      txt.textContent = opt.textContent;
      var mark = document.createElement('span');
      mark.className = 'custom-select__option-check';
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
      btn.appendChild(txt);
      btn.appendChild(mark);
      btn.addEventListener('click', function () {
        select.value = opt.value;
        sync();
        closePanel();
      });
      panel.appendChild(btn);
      optionBtns.push(btn);
    });
    wrapper.appendChild(panel);

    function sync() {
      var selected = select.options[select.selectedIndex];
      triggerText.textContent = selected ? selected.textContent : '';
      trigger.classList.toggle('is-placeholder', select.value === '');
      optionBtns.forEach(function (btn) {
        btn.classList.toggle('is-selected', btn.dataset.value !== '' && btn.dataset.value === select.value);
      });
    }

    function openPanel() {
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      wrapper.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function () {
      if (wrapper.classList.contains('is-open')) closePanel();
      else openPanel();
    });
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePanel(); trigger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) closePanel();
    });

    wrapper.__resync = sync;
    sync();
  }

  document.querySelectorAll('select[data-custom-select]').forEach(enhanceSelect);

  /* =====================================================
     Contact modal + Formspree AJAX
     ===================================================== */
  var emailToggle = document.getElementById('emailToggle');
  var contactModal = document.getElementById('contactModal');
  var modalClose = contactModal ? contactModal.querySelector('.modal__close') : null;
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  function openContactModal() {
    if (!contactModal) return;
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (emailToggle) emailToggle.setAttribute('aria-expanded', 'true');
    var firstField = document.getElementById('cf-name');
    setTimeout(function () { if (firstField) firstField.focus({ preventScroll: true }); }, 250);
  }

  function closeContactModal() {
    if (!contactModal || !contactModal.classList.contains('is-open')) return;
    contactModal.classList.remove('is-open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (emailToggle) emailToggle.setAttribute('aria-expanded', 'false');
    if (emailToggle) emailToggle.focus({ preventScroll: true });
  }

  if (emailToggle) emailToggle.addEventListener('click', openContactModal);
  if (modalClose) modalClose.addEventListener('click', closeContactModal);
  if (contactModal) {
    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) closeContactModal();
    });
  }

  if (contactForm && formStatus) {
    var submitBtn = contactForm.querySelector('[type="submit"]');

    function setStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = 'form-status is-visible is-' + type;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Manual validation (form uses novalidate + custom-styled selects)
      var nameEl = contactForm.elements.namedItem('name');
      var emailEl = contactForm.elements.namedItem('email');
      var subjectEl = contactForm.elements.namedItem('subject');
      var messageEl = contactForm.elements.namedItem('message');
      var emailVal = emailEl ? emailEl.value.trim() : '';

      if (!nameEl || !nameEl.value.trim()) {
        setStatus('Please enter your name.', 'error');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!emailVal || emailVal.indexOf('@') === -1 || emailVal.indexOf('.') === -1) {
        setStatus('Please enter a valid email address.', 'error');
        if (emailEl) emailEl.focus();
        return;
      }
      if (!subjectEl || !subjectEl.value) {
        setStatus('Please select a subject.', 'error');
        return;
      }
      if (!messageEl || !messageEl.value.trim()) {
        setStatus('Please tell me a few words about your project.', 'error');
        if (messageEl) messageEl.focus();
        return;
      }

      if (contactForm.action.indexOf('YOUR_FORM_ID') !== -1) {
        setStatus('Form not connected yet — email gsacreatives@gmail.com directly.', 'error');
        return;
      }

      if (submitBtn) submitBtn.classList.add('is-loading');
      setStatus('Sending…', 'success');

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            contactForm.reset();
            document.querySelectorAll('.custom-select').forEach(function (w) {
              if (w.__resync) w.__resync();
            });
            setStatus('Thanks — your brief is on its way. I reply within 24 hours.', 'success');
            setTimeout(closeContactModal, 2600);
          } else {
            return res.json().then(function (data) {
              var msg = data && data.errors
                ? data.errors.map(function (err) { return err.message; }).join(', ')
                : 'Something went wrong. Please email gsacreatives@gmail.com directly.';
              setStatus(msg, 'error');
            });
          }
        })
        .catch(function () {
          setStatus('Network error. Please email gsacreatives@gmail.com directly.', 'error');
        })
        .finally(function () {
          if (submitBtn) submitBtn.classList.remove('is-loading');
        });
    });
  }

  /* =====================================================
     Nav background on scroll
     ===================================================== */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.style.boxShadow = window.scrollY > 24 ? '0 1px 0 rgba(255,255,255,0.04)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =====================================================
     Escape key
     ===================================================== */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
      closeContactModal();
      setMenu(false);
      if (state.selectMode) setSelectMode(false);
    }
  });

  /* =====================================================
     Boot: hash route first, otherwise the random five
     ===================================================== */
  if (window.location.hash && (window.location.hash.indexOf('#selection=') === 0 ||
      window.location.hash.indexOf('#showreel=') === 0)) {
    handleHash();
  } else {
    renderCurrent();
  }
})();
