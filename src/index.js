import { initButtons } from './components/button/button.js';
import { Modal, initModals } from './components/modal/modal.js';
import { Toast, initToasts } from './components/toast/toast.js';
import { Navbar, initNavbars } from './components/navbar/navbar.js';

export {
  initButtons,
  Modal,
  initModals,
  Toast,
  initToasts,
  Navbar,
  initNavbars
};

export function initWebCraft() {
  initButtons();
  initModals();
  initToasts();
  initNavbars();
}

if (typeof window !== 'undefined') {
  window.WebCraft = {
    init: initWebCraft,
    Modal,
    Toast,
    Navbar
  };
}
