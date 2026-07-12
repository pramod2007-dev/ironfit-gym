/* ==========================================================================
   IRON FIT GYM — Shared Site Script
   Handles: navbar scroll state, scroll progress bar, scroll-to-top,
   animated counters, lazy-loaded images, gallery filter + lightbox,
   trainer search, blog search, membership plan filter, contact/login/
   register form validation, AOS init.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* ---------- Sticky navbar state ---------- */
  var navbar = document.querySelector('.navbar-glass');
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  var scrollProgress = document.getElementById('scrollProgress');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (navbar) {
      navbar.classList.toggle('scrolled', y > 40);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', y > 500);
    }
    if (scrollProgress) {
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = height > 0 ? (y / height) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile nav auto-close on link click ---------- */
  document.querySelectorAll('.navbar-nav .nav-link-custom').forEach(function (link) {
    link.addEventListener('click', function () {
      var navCollapse = document.getElementById('mainNav');
      if (navCollapse && navCollapse.classList.contains('show') && window.bootstrap) {
        var bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navCollapse);
        bsCollapse.hide();
      }
    });
  });

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
    var duration = 1600;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Lazy load images (native + fade-in) ---------- */
  document.querySelectorAll('img.lazy-img').forEach(function (img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('loaded'); });
    }
  });

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll('.gallery-filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var show = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightboxOverlay');
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector('img');
    var visibleItems = function () { return Array.from(galleryItems).filter(function (i) { return i.style.display !== 'none'; }); };
    var currentIndex = 0;

    function openLightbox(index) {
      var items = visibleItems();
      currentIndex = index;
      var img = items[currentIndex].querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.src;
      lightbox.classList.add('active');
    }
    function showRelative(dir) {
      var items = visibleItems();
      currentIndex = (currentIndex + dir + items.length) % items.length;
      var img = items[currentIndex].querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.src;
    }

    galleryItems.forEach(function (item, idx) {
      item.addEventListener('click', function () {
        openLightbox(visibleItems().indexOf(item));
      });
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    var nextBtn = lightbox.querySelector('.lightbox-nav.next');
    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.classList.remove('active'); });
    if (prevBtn) prevBtn.addEventListener('click', function () { showRelative(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showRelative(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') lightbox.classList.remove('active');
      if (e.key === 'ArrowLeft') showRelative(-1);
      if (e.key === 'ArrowRight') showRelative(1);
    });
  }

  /* ---------- Trainer search ---------- */
  var trainerSearch = document.getElementById('trainerSearch');
  if (trainerSearch) {
    trainerSearch.addEventListener('input', function () {
      var q = trainerSearch.value.toLowerCase();
      document.querySelectorAll('.trainer-item').forEach(function (item) {
        var name = item.getAttribute('data-name').toLowerCase();
        var spec = item.getAttribute('data-spec').toLowerCase();
        item.style.display = (name.includes(q) || spec.includes(q)) ? '' : 'none';
      });
    });
  }

  /* ---------- Blog search ---------- */
  var blogSearch = document.getElementById('blogSearch');
  if (blogSearch) {
    blogSearch.addEventListener('input', function () {
      var q = blogSearch.value.toLowerCase();
      document.querySelectorAll('.blog-item').forEach(function (item) {
        var title = item.getAttribute('data-title').toLowerCase();
        item.style.display = title.includes(q) ? '' : 'none';
      });
    });
  }

  /* ---------- Membership plan filter ---------- */
  var planFilterBtns = document.querySelectorAll('.plan-filter-btn');
  if (planFilterBtns.length) {
    planFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        planFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.plan-item').forEach(function (item) {
          var show = filter === 'all' || item.getAttribute('data-type') === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Generic bootstrap-style validation ---------- */
  function validateField(input) {
    var valid = input.checkValidity();
    input.classList.toggle('is-invalid', !valid);
    input.classList.toggle('is-valid', valid && input.value.trim() !== '');
    return valid;
  }

  function wireLiveValidation(form) {
    form.querySelectorAll('.form-control-custom, .form-select-custom').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    wireLiveValidation(contactForm);
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = contactForm.querySelectorAll('.form-control-custom');
      var allValid = true;
      fields.forEach(function (f) { if (!validateField(f)) allValid = false; });
      var successBox = document.getElementById('contactSuccess');
      if (allValid) {
        successBox.classList.remove('d-none');
        contactForm.reset();
        fields.forEach(function (f) { f.classList.remove('is-valid'); });
        setTimeout(function () { successBox.classList.add('d-none'); }, 4000);
      }
    });
  }

  /* ---------- Login form ---------- */
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    wireLiveValidation(loginForm);
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = loginForm.querySelectorAll('.form-control-custom');
      var allValid = true;
      fields.forEach(function (f) { if (!validateField(f)) allValid = false; });
      if (allValid) {
        window.location.href = 'dashboard.html';
      }
    });
  }

  /* ---------- Register form ---------- */
  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    wireLiveValidation(registerForm);
    var pass = document.getElementById('regPassword');
    var confirmPass = document.getElementById('regConfirmPassword');

    function checkPasswordsMatch() {
      if (!pass || !confirmPass || !confirmPass.value) return true;
      var match = pass.value === confirmPass.value;
      confirmPass.classList.toggle('is-invalid', !match);
      confirmPass.classList.toggle('is-valid', match);
      var feedback = confirmPass.parentElement.querySelector('.invalid-feedback-custom');
      if (feedback && !match) feedback.textContent = 'Passwords do not match.';
      return match;
    }
    if (confirmPass) confirmPass.addEventListener('input', checkPasswordsMatch);
    if (pass) pass.addEventListener('input', checkPasswordsMatch);

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = registerForm.querySelectorAll('.form-control-custom, .form-select-custom');
      var allValid = true;
      fields.forEach(function (f) { if (!validateField(f)) allValid = false; });
      var termsBox = document.getElementById('regTerms');
      if (termsBox && !termsBox.checked) allValid = false;
      if (!checkPasswordsMatch()) allValid = false;

      if (allValid) {
        var successBox = document.getElementById('registerSuccess');
        successBox.classList.remove('d-none');
        setTimeout(function () { window.location.href = 'login.html'; }, 1800);
      }
    });
  }

  /* ---------- Newsletter form (footer) ---------- */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      if (input && input.value.trim()) {
        input.value = '';
        var note = form.parentElement.querySelector('.newsletter-note');
        if (note) {
          note.textContent = 'Thanks — you are subscribed!';
          setTimeout(function () { note.textContent = ''; }, 3000);
        }
      }
    });
  });

});
