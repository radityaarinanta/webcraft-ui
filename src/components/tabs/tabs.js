export class Tabs {
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
export function initTabsComponent() {
  document.querySelectorAll('.wc-tabs').forEach(el => new Tabs(el));
}
