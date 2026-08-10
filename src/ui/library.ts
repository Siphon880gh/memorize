import { downloadText, exportDocument, importDocument } from "../lib/backup";
import { PassageRepository } from "../storage/repository";
import { PASSAGE_TYPES, STORAGE_KEY, type Passage, type PassageType } from "../types";

export type LibraryCallbacks = {
  onOpenPassage: (id: string) => void;
  onScoreboard?: () => void;
  onPsalm91Starter?: () => void;
};

function typeLabel(t: PassageType): string {
  return t.replaceAll("_", " ");
}

export function renderLibrary(
  root: HTMLElement,
  repo: PassageRepository,
  callbacks: LibraryCallbacks,
  editing?: Passage | null,
): void {
  const passages = repo.listPassages();
  root.innerHTML = `
    <header class="topbar">
      <div>
        <h1 class="brand">Memorize <span>Script</span></h1>
        <p class="tagline">Train long spoken material until hints drop to zero.</p>
      </div>
      <div class="row">
        <button class="btn secondary" type="button" id="goto-scoreboard">Scoreboard</button>
        <button class="btn secondary" type="button" id="add-psalm91">Psalm 91 starter</button>
        <button class="btn secondary" type="button" id="export-data">Export</button>
        <label class="btn secondary" style="cursor:pointer">Import<input id="import-data" type="file" accept="application/json,.json" hidden /></label>
      </div>
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
              (t) =>
                `<option value="${t}" ${editing?.type === t ? "selected" : t === "custom" && !editing ? "selected" : ""}>${typeLabel(t)}</option>`,
            ).join("")}
          </select>
        </label>
        <label>Bible reference (optional)
          <input name="bibleReference" placeholder="Psalm 91" value="${escapeAttr(editing?.bibleReference ?? "")}" />
        </label>
        <label>Version hint (optional)
          <input name="versionHint" placeholder="NIV" value="${escapeAttr(editing?.versionHint ?? "")}" />
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
    <section class="panel">
      <h2>Your library</h2>
      ${
        passages.length === 0
          ? `<p class="empty">No passages yet. Add a speech, monologue, or scripture text to begin.</p>`
          : `<ul class="passage-list">${passages.map(renderItem).join("")}</ul>`
      }
    </section>
  `;

  const form = root.querySelector<HTMLFormElement>("#passage-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const saved = repo.upsertPassage({
      id: editing?.id,
      title: String(data.get("title") ?? ""),
      type: String(data.get("type") ?? "custom") as PassageType,
      bibleReference: String(data.get("bibleReference") ?? "") || undefined,
      versionHint: String(data.get("versionHint") ?? "") || undefined,
      text: String(data.get("text") ?? ""),
    });
    const toast = root.querySelector<HTMLElement>("#form-toast");
    if (toast) {
      toast.hidden = false;
      toast.textContent = `Saved “${saved.title}”.`;
    }
    renderLibrary(root, repo, callbacks, null);
  });

  root.querySelector("#cancel-edit")?.addEventListener("click", () => {
    renderLibrary(root, repo, callbacks, null);
  });
  root.querySelector("#goto-scoreboard")?.addEventListener("click", () => {
    callbacks.onScoreboard?.();
  });
  root.querySelector("#add-psalm91")?.addEventListener("click", () => {
    callbacks.onPsalm91Starter?.();
  });
  root.querySelector("#export-data")?.addEventListener("click", () => {
    downloadText("memorize-script-backup.json", exportDocument(repo.load()));
  });
  root.querySelector<HTMLInputElement>("#import-data")?.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
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

  root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => callbacks.onOpenPassage(btn.dataset.open!));
  });
  root.querySelectorAll<HTMLButtonElement>("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = repo.getPassage(btn.dataset.edit!);
      if (p) renderLibrary(root, repo, callbacks, p);
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.delete!;
      const p = repo.getPassage(id);
      if (!p) return;
      if (!confirm(`Delete “${p.title}”?`)) return;
      repo.deletePassage(id);
      renderLibrary(root, repo, callbacks, null);
    });
  });
}

function renderItem(p: Passage): string {
  const preview = p.text.trim().slice(0, 80) || "(no text yet)";
  const meta = [typeLabel(p.type), p.bibleReference].filter(Boolean).join(" · ");
  return `<li class="passage-item">
    <div>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(meta)}</p>
      <p>${escapeHtml(preview)}${p.text.trim().length > 80 ? "…" : ""}</p>
    </div>
    <div class="row">
      <button class="btn" type="button" data-open="${p.id}">Open</button>
      <button class="btn secondary" type="button" data-edit="${p.id}">Edit</button>
      <button class="btn danger" type="button" data-delete="${p.id}">Delete</button>
    </div>
  </li>`;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replaceAll("`", "&#96;");
}
