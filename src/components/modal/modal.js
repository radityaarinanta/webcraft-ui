export class Modal {
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

export function initModals() {
  document.querySelectorAll('[data-wc-modal-trigger]').forEach(trigger => {
    const targetSelector = trigger.getAttribute('data-wc-modal-trigger');
    const modalEl = document.querySelector(targetSelector);
    if (modalEl) {
      const instance = new Modal(modalEl);
      trigger.addEventListener('click', () => instance.open());
    }
  });
}
