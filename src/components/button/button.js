export function initButtons() {
  document.querySelectorAll('[data-wc-button]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.hasAttribute('data-wc-ripple')) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.pointerEvents = 'none';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        
        this.appendChild(ripple);
        
        requestAnimationFrame(() => {
          ripple.style.transform = 'scale(2.5)';
          ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 500);
      }
    });
  });
}
