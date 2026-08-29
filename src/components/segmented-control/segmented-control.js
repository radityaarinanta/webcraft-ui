export class SegmentedControl {
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
export function initSegmentedControls() {
  document.querySelectorAll('.wc-segmented').forEach(el => new SegmentedControl(el));
}
