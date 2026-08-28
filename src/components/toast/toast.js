const icons = {
  success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
};

const closeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

export class Toast {
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

export function initToasts() {
  document.querySelectorAll('[data-wc-toast-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const type = trigger.getAttribute('data-wc-toast-type') || 'info';
      const title = trigger.getAttribute('data-wc-toast-title') || 'Notification';
      const message = trigger.getAttribute('data-wc-toast-message') || 'Action completed successfully.';
      Toast.show({ title, message, type });
    });
  });
}
