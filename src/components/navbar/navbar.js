export class Navbar {
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

export function initNavbars() {
  document.querySelectorAll('.wc-navbar').forEach(nav => {
    new Navbar(nav);
  });
}
