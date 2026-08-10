import {
  REDUCTION_LEVELS,
  buildReductionPrompt,
  localReduction,
} from "../lib/reduction";
import { ensureSegments } from "../lib/segment";
import { PassageRepository } from "../storage/repository";
import type { Passage, ReductionLevel, TrainingStage } from "../types";

export type TrainingCallbacks = {
  onBack: () => void;
};

const STAGES: { id: TrainingStage; label: string; ready: boolean }[] = [
  { id: "read", label: "Read", ready: true },
  { id: "understand", label: "Understand", ready: true },
  { id: "reduce", label: "Reduce", ready: true },
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
  if (stage === "read")
    renderRead(panel, repo, passage, () => {
      history.replaceState(null, "", `#passage/${passageId}/understand`);
      renderTraining(root, repo, passageId, callbacks, "understand");
    });
  else if (stage === "understand") renderUnderstand(panel, repo, passage);
  else if (stage === "reduce") renderReduce(panel, repo, passage);
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

function renderReduce(panel: HTMLElement, repo: PassageRepository, passage: Passage): void {
  let level: ReductionLevel = "full";
  let reveal = false;

  const paint = () => {
    const cue = localReduction(level, passage.text, passage.reductions[level]);
    const meta = REDUCTION_LEVELS.find((l) => l.id === level)!;
    panel.innerHTML = `
      <h2>Reduce</h2>
      <p class="empty">Practice from fuller cues down to none. For essential/keyword levels, copy a ChatGPT prompt, then paste the result back.</p>
      <label>Cue level
        <select id="level">
          ${REDUCTION_LEVELS.map((l) => `<option value="${l.id}" ${l.id === level ? "selected" : ""}>${l.label}</option>`).join("")}
        </select>
      </label>
      <div class="cue-box panel" style="margin-top:1rem;box-shadow:none">
        <p><strong>Cues</strong></p>
        <pre class="cue-pre">${esc(cue || "(no hints — recall from memory)")}</pre>
        ${reveal ? `<pre class="cue-pre original">${esc(passage.text)}</pre>` : ""}
      </div>
      <div class="row" style="margin-top:1rem">
        <button class="btn secondary" type="button" id="toggle-reveal">${reveal ? "Hide original" : "Reveal original"}</button>
        <button class="btn" type="button" id="mark-reduce">Mark Reduce practiced</button>
      </div>
      ${
        meta.needsPaste
          ? `<div class="grid" style="margin-top:1.25rem">
              <label>ChatGPT prompt
                <textarea id="ai-prompt" readonly>${esc(buildReductionPrompt(level === "keywords" ? "keywords" : "essential", passage.title, passage.text))}</textarea>
              </label>
              <div class="row">
                <button class="btn secondary" type="button" id="copy-prompt">Copy prompt</button>
              </div>
              <label>Paste ChatGPT reduction
                <textarea id="paste-reduction">${esc(passage.reductions[level] ?? "")}</textarea>
              </label>
              <div class="row">
                <button class="btn" type="button" id="save-reduction">Save pasted reduction</button>
                <span class="toast" id="reduce-toast" hidden></span>
              </div>
            </div>`
          : ""
      }
    `;

    panel.querySelector("#level")?.addEventListener("change", (e) => {
      level = (e.target as HTMLSelectElement).value as ReductionLevel;
      reveal = false;
      paint();
    });
    panel.querySelector("#toggle-reveal")?.addEventListener("click", () => {
      reveal = !reveal;
      paint();
    });
    panel.querySelector("#mark-reduce")?.addEventListener("click", () => {
      markStage(repo, passage, "reduce");
      const toast = panel.querySelector<HTMLElement>("#reduce-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Reduce marked complete.";
      } else {
        const row = panel.querySelector(".row");
        const span = document.createElement("span");
        span.className = "toast";
        span.textContent = "Reduce marked complete.";
        row?.appendChild(span);
      }
    });
    panel.querySelector("#copy-prompt")?.addEventListener("click", async () => {
      const text = panel.querySelector<HTMLTextAreaElement>("#ai-prompt")?.value ?? "";
      await navigator.clipboard.writeText(text);
      const toast = panel.querySelector<HTMLElement>("#reduce-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Prompt copied.";
      }
    });
    panel.querySelector("#save-reduction")?.addEventListener("click", () => {
      const pasted = panel.querySelector<HTMLTextAreaElement>("#paste-reduction")?.value ?? "";
      const now = new Date().toISOString();
      const prompt = buildReductionPrompt(
        level === "keywords" ? "keywords" : "essential",
        passage.title,
        passage.text,
      );
      const updated: Passage = {
        ...passage,
        reductions: { ...passage.reductions, [level]: pasted },
        reductionMeta: { promptUsed: prompt, updatedAt: now },
        updatedAt: now,
      };
      const doc = repo.load();
      doc.passages = doc.passages.map((p) => (p.id === updated.id ? updated : p));
      repo.save(doc);
      passage = updated;
      const toast = panel.querySelector<HTMLElement>("#reduce-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Reduction saved locally.";
      }
      paint();
    });
  };

  paint();
}

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
