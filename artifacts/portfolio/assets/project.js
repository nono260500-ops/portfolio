const CATEGORY_ICONS = {
  'E-commerce': '🛒', 'Logistique / GPS': '📍', 'Streaming / Live': '📡',
  'Crypto / Blockchain': '⛓', 'Outils Metier': '🔧', 'Chat / Temps reel': '💬',
  'Landing Page': '🌐', 'Application Web': '⚡'
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function show(id) { const el = document.getElementById(id); if (el) el.style.display = ''; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val || '—'; }

async function loadProject() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id || isNaN(Number(id))) {
    hide('state-loading');
    show('state-error');
    return;
  }

  try {
    const res = await fetch(`/api/projects/${id}`);

    if (!res.ok) {
      hide('state-loading');
      show('state-error');
      return;
    }

    const p = await res.json();

    // Titre de l'onglet
    document.title = `${p.title} — DEV.PRO`;

    // Remplissage des champs
    setText('proj-title', p.title);
    setText('proj-category', p.category);
    setText('proj-info-category', p.category);
    setText('proj-desc', p.description);
    setText('proj-info-date', formatDate(p.createdAt));

    // Description longue
    const longDescEl = document.getElementById('proj-long-desc');
    if (longDescEl) {
      longDescEl.textContent = p.longDescription || '';
      if (!p.longDescription) longDescEl.style.display = 'none';
    }

    // Badge vedette
    if (p.featured) show('proj-featured');

    // Image
    const imgWrap = document.getElementById('proj-image-wrap');
    if (imgWrap) {
      if (p.imageUrl) {
        imgWrap.innerHTML = `<img src="${p.imageUrl}" alt="${p.title}" class="project-detail-image">`;
      } else {
        const icon = CATEGORY_ICONS[p.category] || '💻';
        imgWrap.innerHTML = `<div class="project-detail-image-placeholder">${icon}</div>`;
      }
    }

    // Tags
    const tagsEl = document.getElementById('proj-tags');
    if (tagsEl && p.tags?.length) {
      tagsEl.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    }

    // Liens (sidebar)
    const linksEl = document.getElementById('proj-links');
    if (linksEl) {
      const links = [];
      if (p.projectUrl) {
        links.push(`<a href="${p.projectUrl}" target="_blank" rel="noopener" class="btn btn-primary">Voir le site ↗</a>`);
      }
      if (p.githubUrl) {
        links.push(`<a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-outline">Code source ↗</a>`);
      }
      if (links.length === 0) {
        links.push(`<p style="color:var(--muted);font-size:.875rem">Aucun lien disponible.</p>`);
      }
      linksEl.innerHTML = links.join('');
    }

    // Affichage
    hide('state-loading');
    show('state-content');
    show('proj-cta');

  } catch (e) {
    hide('state-loading');
    show('state-error');
  }
}

loadProject();
