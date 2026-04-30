// ===== ADMIN CRUD =====
let allProjects = [];
let editingId = null;

async function loadAdminProjects() {
  try {
    const res = await fetch('/api/admin/projects');
    allProjects = await res.json();
    renderTable(allProjects);
  } catch(e) {
    document.getElementById('projects-table-body').innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:#64748b">Erreur de chargement</td></tr>';
  }
}

function renderTable(projects) {
  const tbody = document.getElementById('projects-table-body');
  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:3rem;color:#64748b">Aucun projet. Créez le premier !</td></tr>';
    return;
  }
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td class="td-title">${escHtml(p.title)}</td>
      <td><span class="badge badge-primary">${escHtml(p.category)}</span></td>
      <td>${(p.tags || []).slice(0,3).map(t => `<span class="tag">${escHtml(t)}</span>`).join(' ')}</td>
      <td><span class="badge ${p.featured ? 'badge-orange' : ''}" style="${!p.featured ? 'opacity:.4' : ''}">${p.featured ? 'Vedette' : 'Non'}</span></td>
      <td><span class="badge ${p.published ? 'badge-green' : 'badge-red'}">${p.published ? 'Publié' : 'Brouillon'}</span></td>
      <td>
        <div class="td-actions">
          <button class="btn btn-ghost btn-sm" onclick="openEdit(${p.id})">Modifier</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.id}, '${escHtml(p.title)}')">Suppr.</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== MODAL =====
function openModal(title) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('project-form').reset();
  editingId = null;
  document.getElementById('form-id').value = '';
}

window.openCreate = function() {
  editingId = null;
  document.getElementById('form-id').value = '';
  document.getElementById('project-form').reset();
  document.getElementById('form-published').checked = true;
  openModal('Nouveau projet');
};

window.openEdit = function(id) {
  const p = allProjects.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('form-id').value = id;
  document.getElementById('form-title').value = p.title || '';
  document.getElementById('form-description').value = p.description || '';
  document.getElementById('form-long-description').value = p.longDescription || '';
  document.getElementById('form-category').value = p.category || '';
  document.getElementById('form-tags').value = (p.tags || []).join(', ');
  document.getElementById('form-image-url').value = p.imageUrl || '';
  document.getElementById('form-project-url').value = p.projectUrl || '';
  document.getElementById('form-github-url').value = p.githubUrl || '';
  document.getElementById('form-featured').checked = !!p.featured;
  document.getElementById('form-published').checked = !!p.published;
  document.getElementById('form-order').value = p.order ?? 0;
  openModal('Modifier le projet');
};

window.deleteProject = async function(id, name) {
  if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
  try {
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      showToast(`"${name}" supprimé`);
      loadAdminProjects();
    } else {
      showToast('Erreur lors de la suppression', 'error');
    }
  } catch(e) {
    showToast('Erreur réseau', 'error');
  }
};

// ===== FORM SUBMIT =====
document.getElementById('project-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enregistrement...';

  const tagsRaw = document.getElementById('form-tags').value;
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  const body = {
    title: document.getElementById('form-title').value.trim(),
    description: document.getElementById('form-description').value.trim(),
    longDescription: document.getElementById('form-long-description').value.trim() || null,
    category: document.getElementById('form-category').value.trim(),
    tags,
    imageUrl: document.getElementById('form-image-url').value.trim() || null,
    projectUrl: document.getElementById('form-project-url').value.trim() || null,
    githubUrl: document.getElementById('form-github-url').value.trim() || null,
    featured: document.getElementById('form-featured').checked,
    published: document.getElementById('form-published').checked,
    order: parseInt(document.getElementById('form-order').value) || 0,
  };

  try {
    const url = editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      showToast(editingId ? 'Projet mis à jour !' : 'Projet créé !');
      closeModal();
      loadAdminProjects();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || 'Erreur lors de la sauvegarde', 'error');
    }
  } catch(e) {
    showToast('Erreur réseau', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enregistrer';
  }
});

// ===== SEARCH =====
document.getElementById('search')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  renderTable(allProjects.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.toLowerCase().includes(q))
  ));
});

// Expose closeModal globally for onclick handlers in HTML
window.closeModal = closeModal;

// Close modal on overlay click
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Init
loadAdminProjects();
