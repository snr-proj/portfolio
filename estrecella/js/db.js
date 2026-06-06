/**
 * Estreccella — localStorage Database
 * Replaces Firebase Firestore with simple localStorage CRUD.
 * Each collection is stored as a JSON array under key "es_{collection}".
 */

function _key(col) { return `es_${col}`; }

function _load(col) {
  try { return JSON.parse(localStorage.getItem(_key(col)) || "[]"); }
  catch { return []; }
}

function _save(col, docs) {
  localStorage.setItem(_key(col), JSON.stringify(docs));
}

function _uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const db = {
  /** Return all docs in a collection, optionally filtered */
  getAll(col, filterFn = null) {
    const docs = _load(col);
    return filterFn ? docs.filter(filterFn) : docs;
  },

  /** Return one doc by id */
  get(col, id) {
    return _load(col).find(d => d.id === id) || null;
  },

  /** Insert a new doc; returns the new doc with generated id */
  add(col, data) {
    const docs = _load(col);
    const doc  = { ...data, id: _uuid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    docs.push(doc);
    _save(col, docs);
    return doc;
  },

  /** Update fields of an existing doc by id */
  update(col, id, data) {
    const docs  = _load(col);
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return null;
    docs[index] = { ...docs[index], ...data, updatedAt: new Date().toISOString() };
    _save(col, docs);
    return docs[index];
  },

  /** Delete a doc by id */
  delete(col, id) {
    const docs = _load(col).filter(d => d.id !== id);
    _save(col, docs);
  },
};

/** User profile helpers */
export const profile = {
  get() {
    try { return JSON.parse(localStorage.getItem("es_profile") || "null"); }
    catch { return null; }
  },
  set(data) {
    localStorage.setItem("es_profile", JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem("es_profile");
  }
};

/** Show a toast notification */
export function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/** Render the sidebar user info from profile */
export function renderUser() {
  const p = profile.get();
  if (!p) return;
  const nameEl  = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  const avatarEl = document.getElementById("user-avatar");
  if (nameEl)  nameEl.textContent  = p.name  || "You";
  if (emailEl) emailEl.textContent = p.role  || "Project Manager";
  if (avatarEl) {
    if (avatarEl.tagName === "IMG") {
      // replace img with div for initials
      const div = document.createElement("div");
      div.className = "user-avatar";
      div.title = "Edit profile";
      div.textContent = (p.name || "U")[0].toUpperCase();
      div.onclick = () => openProfileModal();
      avatarEl.replaceWith(div);
    } else {
      avatarEl.textContent = (p.name || "U")[0].toUpperCase();
    }
  }
}

/** Open a small profile-edit modal */
export function openProfileModal() {
  let overlay = document.getElementById("profile-modal");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "profile-modal";
    overlay.className = "modal-overlay";
    const p = profile.get() || {};
    overlay.innerHTML = `
      <div class="modal" style="max-width:360px;">
        <h2 class="modal-title">Edit Profile</h2>
        <div class="form-group">
          <label class="label">Your name</label>
          <input id="pm-name" class="input" style="width:100%;" value="${p.name||''}" placeholder="Your name"/>
        </div>
        <div class="form-group">
          <label class="label">Role / subtitle</label>
          <input id="pm-role" class="input" style="width:100%;" value="${p.role||''}" placeholder="e.g. Project Manager"/>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" id="pm-cancel">Cancel</button>
          <button class="btn-primary" id="pm-save">Save</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById("pm-cancel").onclick = () => overlay.classList.add("hidden");
    document.getElementById("pm-save").onclick = () => {
      const name = document.getElementById("pm-name").value.trim();
      if (!name) { alert("Name is required"); return; }
      profile.set({ name, role: document.getElementById("pm-role").value.trim() });
      renderUser();
      overlay.classList.add("hidden");
      showToast("Profile updated!");
    };
  } else {
    overlay.classList.remove("hidden");
  }
}
