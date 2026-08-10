import { ensureSegments } from "../lib/segment";
import { PassageRepository } from "../storage/repository";
import type { Passage, TrainingStage } from "../types";

export type TrainingCallbacks = {
  onBack: () => void;
};

const STAGES: { id: TrainingStage; label: string; ready: boolean }[] = [
  { id: "read", label: "Read", ready: true },
  { id: "understand", label: "Understand", ready: true },
  { id: "reduce", label: "Reduce", ready: false },
  { id: "visualize", label: "Visualize", ready: false },
  { id: "reconstruct", label: "Reconstruct", ready: false },
  { id: "recall", label: "Recall", ready: false },
  { id: "master", label: "Master", ready: false },
];

export function renderTraining(
  root: HTMLElement,
  repo: PassageRepository,
  passageId: string,
  callbacks: TrainingCallbacks,
  stage: TrainingStage = "read",
): void {
  let passage = repo.getPassage(passageId);
  if (!passage) {
    callbacks.onBack();
    return;
  }

  passage = syncSegments(repo, passage);

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1 class="brand">Memorize <span>Script</span></h1>
          <p class="tagline">${esc(passage.title)}${passage.bibleReference ? ` · ${esc(passage.bibleReference)}` : ""}</p>
        </div>
        <button class="btn secondary" type="button" id="back-lib">Library</button>
      </header>
      <nav class="stage-nav panel" aria-label="Training stages">
        ${STAGES.map(
          (s) =>
            `<button type="button" class="stage-pill ${s.id === stage ? "active" : ""} ${s.ready ? "" : "soon"}" data-stage="${s.id}" ${s.ready ? "" : "disabled"}>${s.label}</button>`,
        ).join("")}
      </nav>
      <section class="panel" id="stage-panel"></section>
    </div>
  `;

  root.querySelector("#back-lib")?.addEventListener("click", callbacks.onBack);
  root.querySelectorAll<HTMLButtonElement>("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.stage as TrainingStage;
      history.replaceState(null, "", `#passage/${passageId}/${next}`);
      renderTraining(root, repo, passageId, callbacks, next);
    });
  });

  const panel = root.querySelector<HTMLElement>("#stage-panel");
  if (!panel) return;
  if (stage === "read") renderRead(panel, repo, passage, () => {
    history.replaceState(null, "", `#passage/${passageId}/understand`);
    renderTraining(root, repo, passageId, callbacks, "understand");
  });
  else if (stage === "understand") renderUnderstand(panel, repo, passage);
  else {
    panel.innerHTML = `<h2>${stage}</h2><p class="empty">This stage arrives in a later milestone.</p>`;
  }
}

function syncSegments(repo: PassageRepository, passage: Passage): Passage {
  const segments = ensureSegments(passage.text, passage.segments);
  if (segments === passage.segments) return passage;
  const doc = repo.load();
  const updated: Passage = {
    ...passage,
    segments,
    updatedAt: new Date().toISOString(),
  };
  doc.passages = doc.passages.map((p) => (p.id === updated.id ? updated : p));
  repo.save(doc);
  return updated;
}

function markStage(repo: PassageRepository, passage: Passage, stage: TrainingStage): Passage {
  const now = new Date().toISOString();
  const updated: Passage = {
    ...passage,
    stageProgress: {
      ...passage.stageProgress,
      [stage]: { completed: true, updatedAt: now },
    },
    updatedAt: now,
  };
  const doc = repo.load();
  doc.passages = doc.passages.map((p) => (p.id === updated.id ? updated : p));
  repo.save(doc);
  return updated;
}

function renderRead(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onContinue: () => void,
): void {
  panel.innerHTML = `
    <h2>Read</h2>
    <p class="empty">Read the full passage with segment markers. Absorb cadence before reducing.</p>
    <ol class="segment-list">
      ${passage.segments.map((s) => `<li><span class="seg-idx">${s.index + 1}</span> ${esc(s.text)}</li>`).join("")}
    </ol>
    <div class="row">
      <button class="btn" type="button" id="mark-read">Mark Read complete → Understand</button>
    </div>
  `;
  panel.querySelector("#mark-read")?.addEventListener("click", () => {
    markStage(repo, passage, "read");
    onContinue();
  });
}

function renderUnderstand(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
): void {
  panel.innerHTML = `
    <h2>Understand</h2>
    <p class="empty">Capture meaning per segment. Notes stay on this device.</p>
    <div class="grid" id="notes">
      ${passage.segments
        .map(
          (s) => `<label>Segment ${s.index + 1}: ${esc(s.text)}
            <textarea data-note="${s.id}" placeholder="Meaning, emotion, or cue">${esc(passage.segmentNotes[s.id] ?? "")}</textarea>
          </label>`,
        )
        .join("")}
    </div>
    <div class="row" style="margin-top:1rem">
      <button class="btn" type="button" id="save-notes">Save notes</button>
      <span class="toast" id="notes-toast" hidden></span>
    </div>
  `;
  panel.querySelector("#save-notes")?.addEventListener("click", () => {
    const notes: Record<string, string> = { ...passage.segmentNotes };
    panel.querySelectorAll<HTMLTextAreaElement>("[data-note]").forEach((el) => {
      notes[el.dataset.note!] = el.value;
    });
    const now = new Date().toISOString();
    const updated: Passage = {
      ...passage,
      segmentNotes: notes,
      stageProgress: {
        ...passage.stageProgress,
        understand: { completed: true, updatedAt: now },
      },
      updatedAt: now,
    };
    const doc = repo.load();
    doc.passages = doc.passages.map((p) => (p.id === updated.id ? updated : p));
    repo.save(doc);
    const toast = panel.querySelector<HTMLElement>("#notes-toast");
    if (toast) {
      toast.hidden = false;
      toast.textContent = "Notes saved.";
    }
  });
}

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
