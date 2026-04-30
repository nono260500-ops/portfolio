// ===== NAVIGATION =====
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

navToggle?.addEventListener('click', () => {
  navMobile?.classList.toggle('open');
  const icon = navToggle.querySelector('.toggle-icon');
  if (icon) icon.textContent = navMobile?.classList.contains('open') ? '✕' : '☰';
});

// Active nav link
const path = window.location.pathname;
document.querySelectorAll('[data-nav]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  const isActive = href === '/' ? (path === '/' || path === '') : path.startsWith(href);
  if (isActive) link.classList.add('active');
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      revealObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.07}s`;
  revealObserver.observe(el);
});

// ===== TOAST =====
window.showToast = function(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
};
