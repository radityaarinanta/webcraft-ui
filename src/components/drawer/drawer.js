export class Drawer {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
  }
  open() { this.element?.classList.add('is-open'); }
  close() { this.element?.classList.remove('is-open'); }
}
export function initDrawers() {}
