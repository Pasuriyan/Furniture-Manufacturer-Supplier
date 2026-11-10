/**
 * MODURA OFFICE FURNISHINGS & SYSTEMS - COMMON JAVASCRIPT ENGINE
 * Handles: RTL/LTR toggle, Dark/Light mode engine, Mobile navigation drawer,
 * Dropdown menus, Quick View & RFQ Modals, Toast notifications, and Form handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initRtlEngine();
  initNavigation();
  initModals();
  initInteractiveForms();
  initAutoYear();
});

/* ===================================================================
   1. DARK / LIGHT THEME CONTROLLER
   =================================================================== */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('modura_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Apply initial theme
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('modura_theme', theme);

    if (themeToggleBtn) {
      if (theme === 'dark') {
        themeToggleBtn.innerHTML = `<svg class="icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>`;
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        themeToggleBtn.innerHTML = `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }
  }
}

/* ===================================================================
   2. RTL / LTR ENGINE (Requirement: RTL to LTR Button in Nav Bar)
   =================================================================== */
function initRtlEngine() {
  const rtlToggleBtn = document.getElementById('rtlToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved direction
  const savedDir = localStorage.getItem('modura_direction') || 'ltr';
  applyDirection(savedDir);

  if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', () => {
      const currentDir = htmlRoot.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      showToast(`Direction updated to ${newDir.toUpperCase()}`, 'info');
    });
  }

  function applyDirection(dir) {
    htmlRoot.setAttribute('dir', dir);
    localStorage.setItem('modura_direction', dir);

    if (rtlToggleBtn) {
      rtlToggleBtn.innerHTML = `<svg class="icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M15 3l5 4-5 4"></path><path d="M20 17H4"></path><path d="M9 13l-5 4 5 4"></path></svg>`;
      if (dir === 'rtl') {
        rtlToggleBtn.classList.add('rtl-active');
        rtlToggleBtn.setAttribute('title', 'Switch to Left-to-Right (LTR)');
        rtlToggleBtn.setAttribute('aria-label', 'Switch to Left-to-Right (LTR)');
      } else {
        rtlToggleBtn.classList.remove('rtl-active');
        rtlToggleBtn.setAttribute('title', 'Switch to Right-to-Left (RTL)');
        rtlToggleBtn.setAttribute('aria-label', 'Switch to Right-to-Left (RTL)');
      }
    }
  }
}

/* ===================================================================
   3. RESPONSIVE NAVIGATION & DROPDOWNS
   =================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  // Mobile drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('mobile-active');
      mobileToggle.classList.toggle('is-active', isActive);
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-active');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile dropdown toggle on click (320px to 725px)
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 725) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      });
    }
  });

  // Sticky header blur effect
  const navbar = document.querySelector('.navbar-wrapper');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
}

/* ===================================================================
   4. MODALS (Quick View & RFQ Quote Form)
   =================================================================== */
function initModals() {
  // RFQ Modal
  const rfqModal = document.getElementById('quoteModal');
  const rfqTriggers = document.querySelectorAll('.open-quote-modal');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-dismiss');

  rfqTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productPreselect = btn.getAttribute('data-product') || '';
      if (rfqModal) {
        const productInput = rfqModal.querySelector('#rfqProductInput');
        if (productInput && productPreselect) {
          productInput.value = productPreselect;
        }
        rfqModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Quick View Modal
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewTriggers = document.querySelectorAll('.open-quick-view');

  quickViewTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Commercial Furniture Item';
      const category = btn.getAttribute('data-category') || 'Executive Office';
      const sku = btn.getAttribute('data-sku') || 'MOD-2026';
      const price = btn.getAttribute('data-price') || '$1,299';
      const img = btn.getAttribute('data-img') || '';
      const specs = btn.getAttribute('data-specs') || 'BIFMA Certified, FSC Walnut Wood, 10-Year Warranty';

      if (quickViewModal) {
        quickViewModal.querySelector('#qvTitle').textContent = title;
        quickViewModal.querySelector('#qvCategory').textContent = category;
        quickViewModal.querySelector('#qvSku').textContent = `SKU: ${sku}`;
        quickViewModal.querySelector('#qvPrice').textContent = price;
        quickViewModal.querySelector('#qvSpecs').textContent = specs;
        const qvImgEl = quickViewModal.querySelector('#qvImage');
        if (qvImgEl && img) qvImgEl.src = img;

        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modals
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  // Dismiss on overlay background click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key dismiss
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

/* ===================================================================
   5. TOAST NOTIFICATION SYSTEM
   =================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '<i class="fa-solid fa-circle-check" style="color: var(--color-primary)"></i>';
  if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--color-warning)"></i>';
  if (type === 'error') iconHtml = '<i class="fa-solid fa-circle-xmark" style="color: var(--color-danger)"></i>';

  toast.innerHTML = `${iconHtml}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ===================================================================
   6. INTERACTIVE FORMS & SIMULATED SUBMISSION
   =================================================================== */
function initInteractiveForms() {
  const quoteForms = document.querySelectorAll('form.ajax-rfq-form');
  quoteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing RFQ...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Quote Submitted!';
        }
        showToast('Commercial Quote request received! A B2B representative will contact you within 2 business hours.', 'success');
        form.reset();

        // Close modal if form is in modal
        const parentModal = form.closest('.modal-overlay');
        if (parentModal) {
          setTimeout(() => {
            parentModal.classList.remove('active');
            document.body.style.overflow = '';
            if (submitBtn) submitBtn.innerHTML = originalText;
          }, 1200);
        } else {
          setTimeout(() => {
            if (submitBtn) submitBtn.innerHTML = originalText;
          }, 3000);
        }
      }, 1200);
    });
  });

  // Newsletter subscribe forms
  const newsletterForms = document.querySelectorAll('form.newsletter-form');
  newsletterForms.forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to Modura Architectural Dispatch!', 'success');
      f.reset();
    });
  });
}

/* ===================================================================
   7. AUTO COPYRIGHT YEAR
   =================================================================== */
function initAutoYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
/* ===================================================================
   ANIMATED STAT COUNTERS ENGINE (FOR ABOUT PAGE METRICS)
   =================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.35,
    rootMargin: '0px 0px -50px 0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateNumber(el);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));

  function animateNumber(element) {
    const rawTarget = element.getAttribute('data-target') || '0';
    const isDecimal = rawTarget.includes('.');
    const target = parseFloat(rawTarget.replace(/,/g, ''));
    const duration = 2000;
    const frameRate = 30;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Ease out cubic calculation
      const progress = 1 - Math.pow(1 - (frame / totalFrames), 3);
      const current = target * progress;

      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.round(current).toLocaleString();
      }

      if (frame >= totalFrames) {
        clearInterval(timer);
        if (isDecimal) {
          element.textContent = target.toFixed(1);
        } else {
          element.textContent = Math.round(target).toLocaleString();
        }
      }
    }, 1000 / frameRate);
  }
}