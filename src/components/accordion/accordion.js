export class Accordion {
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
export function initAccordions() {
  document.querySelectorAll('.wc-accordion').forEach(el => new Accordion(el));
}
