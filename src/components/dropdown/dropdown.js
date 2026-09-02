export class Dropdown {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;
    this.trigger = this.element.querySelector('[data-wc-dropdown-trigger]');
    this.init();
  }
  init() {
    this.trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.element.classList.toggle('is-open');
    });
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) this.element.classList.remove('is-open');
    });
  }
}
export function initDropdowns() {
  document.querySelectorAll('.wc-dropdown').forEach(el => new Dropdown(el));
}
