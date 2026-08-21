import { downloadText, exportDocument, importDocument } from "../lib/backup.js";
import { PassageRepository } from "../storage/repository.js";
import { PASSAGE_TYPES, STORAGE_KEY } from "../types.js";
import {
  PSALM_91_STARTER,
  PSALM_23_STARTER,
  PSALM_21_STARTER,
  ARMOR_OF_GOD_STARTER,
  RESIST_THE_DEVIL_STARTER,
  GET_BEHIND_ME_SATAN_STARTER,
  DAILY_BREAD_PRAYER_STARTER,
  COMING_TO_CHRIST_STARTER,
  EXODUS_15_26_STARTER
} from "../data/starters.js";
const OUR_LIBRARY = [
  { key: "psalm91", starter: PSALM_91_STARTER },
  { key: "psalm23", starter: PSALM_23_STARTER },
  { key: "psalm21", starter: PSALM_21_STARTER },
  { key: "armor-of-god", starter: ARMOR_OF_GOD_STARTER },
  { key: "resist-the-devil", starter: RESIST_THE_DEVIL_STARTER },
  { key: "get-behind-me-satan", starter: GET_BEHIND_ME_SATAN_STARTER },
  { key: "daily-bread", starter: DAILY_BREAD_PRAYER_STARTER },
  { key: "coming-to-christ", starter: COMING_TO_CHRIST_STARTER },
  { key: "exodus-15-26", starter: EXODUS_15_26_STARTER }
];
let libraryTab = "our";
let libraryToast = "";
function typeLabel(t) {
  return t.replaceAll("_", " ");
}
function starterByKey(key) {
  return OUR_LIBRARY.find((item) => item.key === key)?.starter;
}
function renderLibrary(root, repo, callbacks, editing) {
  const passages = repo.listPassages();
  const count = passages.length;
  const ourList = `<ul class="passage-list">${OUR_LIBRARY.map((item) => renderItem(item.starter, { catalogKey: item.key })).join("")}</ul>`;
  const myList = count === 0 ? `<p class="empty">No passages yet. Add one above, or copy one from Our Library.</p>` : `<ul class="passage-list">${passages.map((p) => renderItem(p)).join("")}</ul>`;
  root.innerHTML = `
    <div class="app-shell">
    <header class="topbar">
      <div>
        <button class="brand" type="button" id="brand-home" title="Back to library">Memorize <span>Script</span></button>
        <p class="tagline">Train long spoken material until hints drop to zero.</p>
      </div>
      <nav class="row top-nav" aria-label="Primary">
        <button class="btn secondary nav-current" type="button" id="goto-library" aria-current="page">Library (${count})</button>
        <button class="btn secondary" type="button" id="goto-scoreboard">Scoreboard</button>
        <button class="btn secondary" type="button" id="export-data">Export</button>
        <label class="btn secondary" style="cursor:pointer">Import<input id="import-data" type="file" accept="application/json,.json" hidden /></label>
      </nav>
    </header>
    <section class="panel">
      <h2>${editing ? "Edit passage" : "Add passage"}</h2>
      <form id="passage-form" class="grid">
        <label>Title
          <input name="title" required value="${escapeAttr(editing?.title ?? "")}" />
        </label>
        <label>Type
          <select name="type">
            ${PASSAGE_TYPES.map(
    (t) => `<option value="${t}" ${editing?.type === t ? "selected" : t === "custom" && !editing ? "selected" : ""}>${typeLabel(t)}</option>`
  ).join("")}
          </select>
        </label>
        <label>Bible reference (optional)
          <input name="bibleReference" placeholder="Psalm 91" value="${escapeAttr(editing?.bibleReference ?? "")}" />
        </label>
        <label>Version hint (optional)
          <input name="versionHint" placeholder="ESV" value="${escapeAttr(editing?.versionHint ?? "")}" />
        </label>
        <label>Passage text
          <textarea name="text" required placeholder="Paste the wording you want to memorize">${escapeHtml(editing?.text ?? "")}</textarea>
        </label>
        <div class="row">
          <button class="btn" type="submit">${editing ? "Save changes" : "Save passage"}</button>
          ${editing ? `<button class="btn secondary" type="button" id="cancel-edit">Cancel</button>` : ""}
        </div>
        <p class="toast" id="form-toast" hidden></p>
      </form>
    </section>
    <section class="panel" id="library-panel">
      <div class="library-head">
        <div class="library-tabs" role="tablist" aria-label="Library">
          <button class="btn secondary${libraryTab === "our" ? " nav-current" : ""}" type="button" id="tab-our" role="tab" aria-selected="${libraryTab === "our"}" aria-controls="library-tab-panel">Our Library</button>
          <button class="btn secondary${libraryTab === "mine" ? " nav-current" : ""}" type="button" id="tab-mine" role="tab" aria-selected="${libraryTab === "mine"}" aria-controls="library-tab-panel">My Library (${count})</button>
        </div>
      </div>
      <div id="library-tab-panel" role="tabpanel">
        ${libraryTab === "our" ? ourList : myList}
      </div>
      <p class="toast" id="library-toast" hidden></p>
    </section>
    </div>
  `;
  const form = root.querySelector("#passage-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const saved = repo.upsertPassage({
      id: editing?.id,
      title: String(data.get("title") ?? ""),
      type: String(data.get("type") ?? "custom"),
      bibleReference: String(data.get("bibleReference") ?? "") || void 0,
      versionHint: String(data.get("versionHint") ?? "") || void 0,
      text: String(data.get("text") ?? "")
    });
    const toast = root.querySelector("#form-toast");
    if (toast) {
      toast.hidden = false;
      toast.textContent = `Saved \u201C${saved.title}\u201D.`;
    }
    libraryTab = "mine";
    renderLibrary(root, repo, callbacks, null);
  });
  root.querySelector("#cancel-edit")?.addEventListener("click", () => {
    renderLibrary(root, repo, callbacks, null);
  });
  root.querySelector("#brand-home")?.addEventListener("click", () => {
    history.replaceState(null, "", "#");
    renderLibrary(root, repo, callbacks, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  root.querySelector("#goto-library")?.addEventListener("click", () => {
    root.querySelector("#library-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  root.querySelector("#goto-scoreboard")?.addEventListener("click", () => {
    callbacks.onScoreboard?.();
  });
  root.querySelector("#tab-our")?.addEventListener("click", () => {
    libraryTab = "our";
    renderLibrary(root, repo, callbacks, editing);
  });
  root.querySelector("#tab-mine")?.addEventListener("click", () => {
    libraryTab = "mine";
    renderLibrary(root, repo, callbacks, editing);
  });
  root.querySelector("#export-data")?.addEventListener("click", () => {
    downloadText("memorize-script-backup.json", exportDocument(repo.load()));
  });
  root.querySelector("#import-data")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const doc = importDocument(text);
      if (!confirm("Replace all local passages with this backup?")) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      renderLibrary(root, repo, callbacks, null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    }
  });
  function showLibraryToast(message) {
    const toast = root.querySelector("#library-toast");
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = message;
  }
  if (libraryToast) {
    showLibraryToast(libraryToast);
    libraryToast = "";
  }
  root.querySelectorAll("[data-copy-starter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const starter = starterByKey(btn.dataset.copyStarter);
      if (!starter) return;
      const existed = Boolean(callbacks.onFindStarter?.(starter));
      const saved = callbacks.onApplyStarter?.(starter);
      if (!saved) return;
      libraryToast = existed ? `\u201C${starter.title}\u201D is already in My Library.` : `Copied \u201C${starter.title}\u201D to My Library.`;
      renderLibrary(root, repo, callbacks, editing);
    });
  });
  root.querySelectorAll("[data-open-starter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const starter = starterByKey(btn.dataset.openStarter);
      if (!starter) return;
      const saved = callbacks.onApplyStarter?.(starter);
      if (saved) callbacks.onOpenPassage(saved.id);
    });
  });
  root.querySelectorAll("[data-edit-starter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const starter = starterByKey(btn.dataset.editStarter);
      if (!starter) return;
      const saved = callbacks.onApplyStarter?.(starter);
      if (saved) {
        libraryTab = "mine";
        renderLibrary(root, repo, callbacks, saved);
      }
    });
  });
  root.querySelectorAll("[data-delete-starter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const starter = starterByKey(btn.dataset.deleteStarter);
      if (!starter) return;
      const match = callbacks.onFindStarter?.(starter);
      if (!match) {
        alert(`\u201C${starter.title}\u201D is not in My Library yet.`);
        return;
      }
      if (!confirm(`Delete \u201C${match.title}\u201D from My Library?`)) return;
      repo.deletePassage(match.id);
      renderLibrary(root, repo, callbacks, null);
    });
  });
  root.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => callbacks.onOpenPassage(btn.dataset.open));
  });
  root.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = repo.getPassage(btn.dataset.edit);
      if (p) renderLibrary(root, repo, callbacks, p);
    });
  });
  root.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.delete;
      const p = repo.getPassage(id);
      if (!p) return;
      if (!confirm(`Delete \u201C${p.title}\u201D?`)) return;
      repo.deletePassage(id);
      renderLibrary(root, repo, callbacks, null);
    });
  });
}
function passagePreview(p) {
  const custom = p.description?.trim();
  if (custom) return { text: custom, ellipsis: "" };
  const body = p.text.trim();
  if (!body) return { text: "(no text yet)", ellipsis: "" };
  return { text: body.slice(0, 80), ellipsis: body.length > 80 ? "\u2026" : "" };
}
function renderItem(p, opts = {}) {
  const { text: preview, ellipsis } = passagePreview(p);
  const meta = [typeLabel(p.type), p.bibleReference].filter(Boolean).join(" \xB7 ");
  const key = opts.catalogKey;
  const openAttr = key ? `data-open-starter="${key}"` : `data-open="${p.id}"`;
  const editAttr = key ? `data-edit-starter="${key}"` : `data-edit="${p.id}"`;
  const deleteAttr = key ? `data-delete-starter="${key}"` : `data-delete="${p.id}"`;
  const copyBtn = key ? `<button class="copy-to-library" type="button" data-copy-starter="${key}">Copy to my library</button>` : "";
  return `<li class="passage-item">
    <div>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(meta)}</p>
      <p>${escapeHtml(preview)}${ellipsis}</p>
    </div>
    <div class="passage-actions">
      <div class="passage-actions-row">
        <button class="btn" type="button" ${openAttr}>Open</button>
        <button class="btn secondary" type="button" ${editAttr}>Edit</button>
        <button class="btn danger" type="button" ${deleteAttr}>Delete</button>
      </div>
      ${copyBtn}
    </div>
  </li>`;
}
function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function escapeAttr(s) {
  return escapeHtml(s).replaceAll("`", "&#96;");
}
export {
  renderLibrary
};
