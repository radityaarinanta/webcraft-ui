class Accordion {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.init();
  }
  init() {
    this.element.querySelectorAll('.wc-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.wc-accordion-item');
        const isExpanded = item.classList.contains('is-expanded');
        if (!this.element.hasAttribute('data-wc-multiple')) {
          this.element.querySelectorAll('.wc-accordion-item').forEach(i => i.classList.remove('is-expanded'));
        }
        item.classList.toggle('is-expanded', !isExpanded);
      });
    });
  }
}
function initAccordions() {
  document.querySelectorAll('.wc-accordion').forEach(el => new Accordion(el));
}


function initAvatars() {}


function initBadges() {}


function initBreadcrumbs() {}


function initButtons() {
  document.querySelectorAll('[data-wc-button]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.hasAttribute('data-wc-ripple')) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.pointerEvents = 'none';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        
        this.appendChild(ripple);
        
        requestAnimationFrame(() => {
          ripple.style.transform = 'scale(2.5)';
          ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 500);
      }
    });
  });
}


class Modal {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.closeButtons = this.element.querySelectorAll('[data-wc-modal-close]');
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.init();
  }

  init() {
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    this.element.addEventListener('click', this.handleBackdropClick);
  }

  handleBackdropClick(e) {
    if (e.target === this.element) {
      this.close();
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  open() {
    this.element.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.handleKeyDown);
    this.element.dispatchEvent(new CustomEvent('wc:modal:open', { bubbles: true }));
  }

  close() {
    this.element.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeyDown);
    this.element.dispatchEvent(new CustomEvent('wc:modal:close', { bubbles: true }));
  }

  isOpen() {
    return this.element.classList.contains('is-open');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}

function initModals() {
  document.querySelectorAll('[data-wc-modal-trigger]').forEach(trigger => {
    const targetSelector = trigger.getAttribute('data-wc-modal-trigger');
    const modalEl = document.querySelector(targetSelector);
    if (modalEl) {
      const instance = new Modal(modalEl);
      trigger.addEventListener('click', () => instance.open());
    }
  });
}


class Navbar {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.toggleButton = this.element.querySelector('[data-wc-navbar-toggle]');
    this.mobileMenu = this.element.querySelector('[data-wc-navbar-menu]');
    this.init();
  }

  init() {
    if (this.toggleButton && this.mobileMenu) {
      this.toggleButton.addEventListener('click', () => {
        this.toggle();
      });
    }
  }

  toggle() {
    this.mobileMenu.classList.toggle('is-open');
    const isOpen = this.mobileMenu.classList.contains('is-open');
    this.toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function initNavbars() {
  document.querySelectorAll('.wc-navbar').forEach(nav => {
    new Navbar(nav);
  });
}


function initProgressBars() {}


class SegmentedControl {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.buttons = this.element.querySelectorAll('.wc-segment-btn');
    this.init();
  }
  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  }
}
function initSegmentedControls() {
  document.querySelectorAll('.wc-segmented').forEach(el => new SegmentedControl(el));
}


function initSkeletons() {}


function initStatsCards() {}


class Tabs {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.tabs = this.element.querySelectorAll('.wc-tab');
    this.panels = this.element.querySelectorAll('.wc-tab-panel');
    this.init();
  }
  init() {
    this.tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => this.activate(idx));
    });
  }
  activate(index) {
    this.tabs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    this.panels.forEach((p, i) => p.classList.toggle('is-active', i === index));
  }
}
function initTabsComponent() {
  document.querySelectorAll('.wc-tabs').forEach(el => new Tabs(el));
}


const icons = {
  success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
};

const closeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

class Toast {
  static getContainer() {
    let container = document.querySelector('.wc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'wc-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  static show({ title = '', message = '', type = 'info', duration = 4000 }) {
    const container = Toast.getContainer();
    const toast = document.createElement('div');
    toast.className = `wc-toast wc-toast-${type}`;

    toast.innerHTML = `
      <div class="wc-toast-icon">${icons[type] || icons.info}</div>
      <div class="wc-toast-content">
        ${title ? `<div class="wc-toast-title">${title}</div>` : ''}
        ${message ? `<div class="wc-toast-message">${message}</div>` : ''}
      </div>
      <button class="wc-toast-close" aria-label="Close toast">${closeIcon}</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    const removeToast = () => {
      toast.classList.remove('is-visible');
      toast.classList.add('is-hiding');
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('.wc-toast-close').addEventListener('click', removeToast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    return toast;
  }
}

function initToasts() {
  document.querySelectorAll('[data-wc-toast-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const type = trigger.getAttribute('data-wc-toast-type') || 'info';
      const title = trigger.getAttribute('data-wc-toast-title') || 'Notification';
      const message = trigger.getAttribute('data-wc-toast-message') || 'Action completed successfully.';
      Toast.show({ title, message, type });
    });
  });
}


function initToggleSwitches() {}


function initTooltips() {}


export function initWebCraft() {
  initAccordions();
  initAvatars();
  initBadges();
  initBreadcrumbs();
  initButtons();
  initModals();
  initNavbars();
  initProgressBars();
  initSegmentedControls();
  initSkeletons();
  initStatsCards();
  initTabsComponent();
  initToasts();
  initToggleSwitches();
  initTooltips();
}

export {
  Accordion,
  Modal,
  Navbar,
  SegmentedControl,
  Tabs,
  Toast,
  initAccordions,
  initAvatars,
  initBadges,
  initBreadcrumbs,
  initButtons,
  initModals,
  initNavbars,
  initProgressBars,
  initSegmentedControls,
  initSkeletons,
  initStatsCards,
  initTabsComponent,
  initToasts,
  initToggleSwitches,
  initTooltips
};

if (typeof window !== 'undefined') {
  window.WebCraft = {
    init: initWebCraft,
    Accordion,
    Modal,
    Navbar,
    SegmentedControl,
    Tabs,
    Toast
  };
}