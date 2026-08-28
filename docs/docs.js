import { initWebCraft, Toast, Modal } from './webcraft.js';

document.addEventListener('DOMContentLoaded', () => {
  initWebCraft();
  initThemeToggle();
  initTabs();
  initCopyCode();
  initSearch();
  initComponentDemos();
});

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('wc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('wc-theme', nextTheme);
  });
}

function initTabs() {
  document.querySelectorAll('.docs-preview-card').forEach(card => {
    const tabBtns = card.querySelectorAll('.docs-tab-btn');
    const previewArea = card.querySelector('.docs-preview-area');
    const codeArea = card.querySelector('.docs-code-area');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const target = btn.getAttribute('data-tab');
        if (target === 'code') {
          previewArea.style.display = 'none';
          codeArea.classList.add('is-active');
        } else {
          previewArea.style.display = 'flex';
          codeArea.classList.remove('is-active');
        }
      });
    });
  });
}

function initCopyCode() {
  document.querySelectorAll('.docs-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.docs-preview-card');
      const codeEl = card.querySelector('.docs-code-area pre');
      if (!codeEl) return;

      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code', err);
      }
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('docs-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const sections = document.querySelectorAll('.docs-component-section');
    const navItems = document.querySelectorAll('.docs-nav-item');

    sections.forEach(sec => {
      const title = sec.querySelector('.docs-section-title')?.textContent.toLowerCase() || '';
      const desc = sec.querySelector('.docs-section-desc')?.textContent.toLowerCase() || '';
      const match = title.includes(query) || desc.includes(query);
      sec.style.display = match ? 'block' : 'none';
    });

    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(query);
      item.style.display = match ? 'flex' : 'none';
    });
  });
}

function initComponentDemos() {
  const toastSuccessBtn = document.getElementById('demo-toast-success');
  if (toastSuccessBtn) {
    toastSuccessBtn.addEventListener('click', () => {
      Toast.show({
        type: 'success',
        title: 'Changes Saved',
        message: 'Your project configurations have been updated successfully.'
      });
    });
  }

  const toastErrorBtn = document.getElementById('demo-toast-error');
  if (toastErrorBtn) {
    toastErrorBtn.addEventListener('click', () => {
      Toast.show({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to remote repository. Check token.'
      });
    });
  }

  const toastInfoBtn = document.getElementById('demo-toast-info');
  if (toastInfoBtn) {
    toastInfoBtn.addEventListener('click', () => {
      Toast.show({
        type: 'info',
        title: 'Update Available',
        message: 'A new component version is ready in catalog.'
      });
    });
  }
}
