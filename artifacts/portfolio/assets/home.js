// ===== STATS =====
async function loadStats() {
  try {
    const res = await fetch('/api/projects/stats');
    if (!res.ok) return;
    const stats = await res.json();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-total', stats.total ?? 0);
    set('stat-featured', stats.featured ?? 0);
    set('stat-categories', stats.byCategory?.length ?? 0);
  } catch(e) {}
}

// ===== PROJECTS =====
const CATEGORY_ICONS = {
  'E-commerce': '🛒', 'Logistique / GPS': '📍', 'Streaming / Live': '📡',
  'Crypto / Blockchain': '⛓', 'Outils Metier': '🔧', 'Chat / Temps reel': '💬',
  'Landing Page': '🌐', 'Application Web': '⚡'
};

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  if (!projects || projects.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">📂</div>
      <h3>Aucun projet trouvé</h3>
      <p>Ajustez votre filtre pour voir plus de résultats.</p>
    </div>`;
    return;
  }
  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card reveal" data-href="/project/?id=${p.id}" style="transition-delay:${i*0.07}s">
      <div class="project-card-img">
        ${p.imageUrl
          ? `<img src="${p.imageUrl}" alt="${p.title}" loading="lazy">`
          : `<span class="project-card-img-placeholder">${CATEGORY_ICONS[p.category] || '💻'}</span>`}
        ${p.featured ? '<span class="badge badge-primary" style="position:absolute;top:1rem;right:1rem">Vedette</span>' : ''}
      </div>
      <div class="project-card-body">
        <div class="project-card-category">${p.category}</div>
        <div class="project-card-title">${p.title}</div>
        <div class="project-card-desc">${p.description}</div>
        <div class="project-card-tags">${(p.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-card-links">
          <a href="/project/?id=${p.id}" class="btn btn-outline btn-sm">Voir le détail →</a>
          ${p.projectUrl ? `<a href="${p.projectUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">Site ↗</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
  // Make whole card clickable (but inner links keep their own behavior)
  grid.querySelectorAll('.project-card[data-href]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.location.href = card.dataset.href;
    });
  });
  // Re-observe new cards
  grid.querySelectorAll('.reveal').forEach(el => {
    if (window._revealObserver) window._revealObserver.observe(el);
    else setTimeout(() => el.classList.add('visible'), 100);
  });
}

let activeCategory = null;

async function loadProjects(category) {
  const grid = document.getElementById('projects-grid');
  if (grid) grid.innerHTML = '<div class="skeleton" style="height:340px;grid-column:1/-1"></div>';
  try {
    const url = category ? `/api/projects?category=${encodeURIComponent(category)}` : '/api/projects';
    const res = await fetch(url);
    const projects = await res.json();
    renderProjects(projects);
  } catch(e) {
    if (grid) grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚠️</div><h3>Erreur de chargement</h3><p>Vérifiez votre connexion.</p></div>';
  }
}

// Category filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category === 'all' ? null : btn.dataset.category;
    loadProjects(activeCategory);
  });
});

// Contact form
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type=submit]');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 800));
  document.getElementById('contact-form-wrap')?.classList.add('hidden');
  document.getElementById('contact-success')?.classList.remove('hidden');
});

// Init
loadStats();
loadProjects(null);
