/* =========================================================
   KAI ROMÁN — Portfolio · Vanilla JS
   - Mobile menu toggle
   - Smooth scroll close
   - IntersectionObserver reveal
   - Showreel lightbox
   - Dynamic footer year
   ========================================================= */
(function () {
  'use strict';

  // ---- Footer year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile menu ----
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

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      // small stagger inside same parent
      el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Showreel lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxTag = document.getElementById('lightboxTag');
  var lightboxMedia = document.getElementById('lightboxMedia');
  var reels = document.querySelectorAll('.reel');

  function openLightbox(title, tag, videoUrl) {
    if (!lightbox) return;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Preview';
    if (lightboxTag) lightboxTag.textContent = tag || 'Showreel';
    
    // Charger la vidéo si une URL est fournie
    if (lightboxMedia) {
      if (videoUrl) {
        lightboxMedia.innerHTML = generateVideoHtml(videoUrl);
      } else {
        // Fallback si pas de vidéo
        lightboxMedia.innerHTML = '<span class="lightbox__demo">PREVIEW · DEMO PLACEHOLDER</span>';
      }
    }
    
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    
    // Stopper la vidéo lors de la fermeture
    if (lightboxMedia) {
      const iframe = lightboxMedia.querySelector('iframe');
      if (iframe) {
        // Réinitialiser l'iframe pour arrêter la lecture
        const src = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = src;
        }, 100);
      }
      const video = lightboxMedia.querySelector('video');
      if (video) {
        video.pause();
      }
    }
    
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function generateVideoHtml(url) {
    if (!url) return '<span class="lightbox__demo">PREVIEW · DEMO PLACEHOLDER</span>';
    
    // Détecter YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      return `
        <div style="position:relative;width:100%;height:100%;">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
          </iframe>
          <span class="lightbox__demo">PREVIEW · DEMO PLACEHOLDER</span>
        </div>
      `;
    }
    
    // Détecter Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `
        <div style="position:relative;width:100%;height:100%;">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0" 
            frameborder="0" 
            allow="autoplay; fullscreen" 
            allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
          </iframe>
          <span class="lightbox__demo">PREVIEW · DEMO PLACEHOLDER</span>
        </div>
      `;
    }
    
    // Fichier vidéo local
    return `
      <div style="position:relative;width:100%;height:100%;">
        <video controls autoplay width="100%" height="100%" style="position:absolute;top:0;left:0;width:100%;height:100%;">
          <source src="${url}" type="video/mp4">
          <source src="${url.replace('.mp4', '.webm')}" type="video/webm">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
        <span class="lightbox__demo">PREVIEW · DEMO PLACEHOLDER</span>
      </div>
    `;
  }

  function extractYouTubeId(url) {
    // Patterns pour différents formats d'URL YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/,
      /(?:youtube\.com\/shorts\/)([^?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url; // Fallback
  }

  // Gestion des clics sur les reels
  reels.forEach(function (reel) {
    reel.addEventListener('click', function () {
      const title = reel.getAttribute('data-title');
      const tag = reel.getAttribute('data-tag');
      const video = reel.getAttribute('data-video');
      openLightbox(title, tag, video);
    });
  });

  // Fermeture
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
      if (typeof setMenu === 'function') setMenu(false);
    }
  });

  // ---- Nav background intensity on scroll ----
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.04)';
      else nav.style.boxShadow = 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
