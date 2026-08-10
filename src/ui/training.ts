import {
  applyHint,
  gradeOrder,
  moveItem,
  reconstructCardLabel,
  shuffleItems,
  toOrderItems,
  type ReconstructCueMode,
} from "../lib/ordering";
import { gradeRecall } from "../lib/recallGrade";
import {
  REDUCTION_LEVELS,
  buildReductionPrompt,
  localReduction,
} from "../lib/reduction";
import { ensureSegments } from "../lib/segment";
import { hintKindLabel, recordAttempt, resetMastery } from "../lib/stats";
import { buildImagePrompt, inferConcept } from "../lib/visualPrompt";
import { PassageRepository } from "../storage/repository";
import type { HintEvent, Passage, ReductionLevel, TrainingStage, VisualAnchor } from "../types";
import { mountShareControls } from "./sharePanel";

export type TrainingCallbacks = {
  onBack: () => void;
};

const STAGE_ORDER: TrainingStage[] = [
  "read",
  "understand",
  "reduce",
  "visualize",
  "reconstruct",
  "recall",
  "master",
];

function isComplete(passage: Passage, stage: TrainingStage): boolean {
  return Boolean(passage.stageProgress[stage]?.completed);
}

function isUnlocked(passage: Passage, stage: TrainingStage): boolean {
  if (stage === "read") return true;
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx <= 0) return true;
  return isComplete(passage, STAGE_ORDER[idx - 1]!);
}

function nextStage(stage: TrainingStage): TrainingStage | null {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1]!;
}

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
  const libraryCount = repo.listPassages().length;

  const activeStage = isUnlocked(passage, stage) ? stage : "read";

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1 class="brand">Memorize <span>Script</span></h1>
          <p class="tagline">${esc(passage.title)}${passage.bibleReference ? ` · ${esc(passage.bibleReference)}` : ""}</p>
        </div>
        <nav class="row top-nav" aria-label="Primary">
          <button class="btn secondary" type="button" id="back-lib">Library (${libraryCount})</button>
        </nav>
      </header>
      <div id="share-host"></div>
      <nav class="stage-nav panel" aria-label="Training stages">
        ${STAGE_ORDER.map((s) => {
          const done = isComplete(passage, s);
          const unlocked = isUnlocked(passage, s);
          const classes = [
            "stage-pill",
            s === activeStage ? "active" : "",
            done ? "done" : "",
            unlocked ? "" : "locked",
          ]
            .filter(Boolean)
            .join(" ");
          const label = `${done ? "✓ " : ""}${s[0]!.toUpperCase()}${s.slice(1)}`;
          return `<button type="button" class="${classes}" data-stage="${s}" ${unlocked ? "" : "disabled"} title="${unlocked ? s : "Complete the previous stage first"}">${label}</button>`;
        }).join("")}
      </nav>
      <p class="toast" id="stage-toast" hidden></p>
      <section class="panel" id="stage-panel"></section>
    </div>
  `;

  const go = (next: TrainingStage) => {
    history.replaceState(null, "", `#passage/${passageId}/${next}`);
    renderTraining(root, repo, passageId, callbacks, next);
  };

  const toast = (msg: string) => {
    const el = root.querySelector<HTMLElement>("#stage-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
  };

  root.querySelector("#back-lib")?.addEventListener("click", callbacks.onBack);
  const shareHost = root.querySelector<HTMLElement>("#share-host");
  if (shareHost) mountShareControls(shareHost, passage);
  root.querySelectorAll<HTMLButtonElement>("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.stage as TrainingStage;
      if (!isUnlocked(passage, next)) {
        toast("Complete the previous stage first.");
        return;
      }
      go(next);
    });
  });

  const panel = root.querySelector<HTMLElement>("#stage-panel");
  if (!panel) return;

  const continueRow = (from: TrainingStage, label: string) => {
    const n = nextStage(from);
    if (!n) return "";
    return `<div class="row stage-next-row">
      <button class="btn stage-next" type="button" id="continue-next">${esc(label)}</button>
    </div>`;
  };

  const bindContinue = (from: TrainingStage) => {
    panel.querySelector("#continue-next")?.addEventListener("click", () => {
      const n = nextStage(from);
      if (n) go(n);
    });
  };

  if (activeStage === "read") {
    renderRead(panel, repo, passage, () => {
      const updated = markStage(repo, passage, "read");
      Object.assign(passage, updated);
      go("understand");
    });
  } else if (activeStage === "understand") {
    renderUnderstand(panel, repo, passage, (updated) => {
      Object.assign(passage, updated);
      go("understand");
      // re-render to show continue
      renderTraining(root, repo, passageId, callbacks, "understand");
    });
    if (isComplete(passage, "understand")) {
      panel.insertAdjacentHTML(
        "beforeend",
        continueRow("understand", "Continue → Reduce"),
      );
      bindContinue("understand");
    }
  } else if (activeStage === "reduce") {
    renderReduce(panel, repo, passage, (updated) => {
      Object.assign(passage, updated);
      renderTraining(root, repo, passageId, callbacks, "reduce");
    });
    if (isComplete(passage, "reduce")) {
      panel.insertAdjacentHTML(
        "beforeend",
        continueRow("reduce", "Continue → Visualize"),
      );
      bindContinue("reduce");
    }
  } else if (activeStage === "visualize") {
    renderVisualize(panel, repo, passage, (updated) => {
      Object.assign(passage, updated);
      renderTraining(root, repo, passageId, callbacks, "visualize");
    });
    if (isComplete(passage, "visualize")) {
      panel.insertAdjacentHTML(
        "beforeend",
        continueRow("visualize", "Continue → Reconstruct"),
      );
      bindContinue("visualize");
    }
  } else if (activeStage === "reconstruct") {
    renderReconstruct(panel, repo, passage, (updated) => {
      Object.assign(passage, updated);
      renderTraining(root, repo, passageId, callbacks, "reconstruct");
    });
  } else if (activeStage === "recall") {
    renderRecall(panel, repo, passage, (updated) => {
      Object.assign(passage, updated);
      renderTraining(root, repo, passageId, callbacks, "recall");
    });
  } else if (activeStage === "master") {
    renderMaster(panel, repo, passage, (updated) => {
      Object.assign(passage, updated);
      go("read");
    });
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
  savePassage(repo, updated);
  return updated;
}

function savePassage(repo: PassageRepository, passage: Passage): void {
  const doc = repo.load();
  doc.passages = doc.passages.map((p) => (p.id === passage.id ? passage : p));
  repo.save(doc);
}

function renderRead(
  panel: HTMLElement,
  _repo: PassageRepository,
  passage: Passage,
  onContinue: () => void,
): void {
  const empty = passage.segments.length === 0 || !passage.text.trim();
  panel.innerHTML = `
    <h2>Read</h2>
    ${
      empty
        ? `<p class="empty">This passage has no text yet. Go to <strong>Library</strong>, edit it, and paste the wording you want to memorize.</p>
           <div class="row stage-next-row"><button class="btn stage-next" type="button" id="mark-read" disabled>Mark Read complete → Understand</button></div>`
        : `<p class="empty">Read the full passage with segment markers. Absorb cadence before reducing.</p>
           <ol class="segment-list">
             ${passage.segments.map((s) => `<li><span class="seg-idx">${s.index + 1}</span> ${esc(s.text)}</li>`).join("")}
           </ol>
           <div class="row stage-next-row">
             <button class="btn stage-next" type="button" id="mark-read">Mark Read complete → Understand</button>
           </div>`
    }
  `;
  panel.querySelector("#mark-read")?.addEventListener("click", () => {
    if (empty) return;
    onContinue();
  });
}

function renderUnderstand(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onSaved: (p: Passage) => void,
): void {
  if (passage.segments.length === 0) {
    panel.innerHTML = `<h2>Understand</h2><p class="empty">Add passage text first (Library → Edit), then return here.</p>`;
    return;
  }
  panel.innerHTML = `
    <h2>Understand</h2>
    <p class="empty">Optional: jot a meaning, emotion, or cue for any segment that helps you. Leave the rest blank if you like.</p>
    <div class="grid" id="notes">
      ${passage.segments
        .map(
          (s) => `<label>Segment ${s.index + 1}: ${esc(s.text)}
            <textarea data-note="${s.id}" placeholder="Meaning, emotion, or cue (optional)">${esc(passage.segmentNotes[s.id] ?? "")}</textarea>
          </label>`,
        )
        .join("")}
    </div>
    <div class="row stage-next-row">
      <button class="btn ${isComplete(passage, "understand") ? "secondary" : "stage-next"}" type="button" id="save-notes">${isComplete(passage, "understand") ? "Save notes" : "Save &amp; complete Understand"}</button>
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
    savePassage(repo, updated);
    const toast = panel.querySelector<HTMLElement>("#notes-toast");
    if (toast) {
      toast.hidden = false;
      toast.textContent = "Understand complete.";
    }
    onSaved(updated);
  });
}

function renderReconstruct(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onDone: (p: Passage) => void,
): void {
  if (passage.segments.length < 2) {
    panel.innerHTML = `<h2>Reconstruct</h2><p class="empty">Need at least two segments to practice ordering. Add more text in Library → Edit.</p>`;
    return;
  }
  const correct = toOrderItems(passage.segments);
  const correctIds = correct.map((c) => c.id);
  let order = shuffleItems(correct);
  let selected = 0;
  let hintsUsed = 0;
  const hintEvents: HintEvent[] = [];
  let checked: boolean[] | null = null;
  let cueMode: ReconstructCueMode = "first_word";
  let message = "Drag the cards into the correct order, then check.";
  const startedAt = Date.now();

  const paint = () => {
    panel.innerHTML = `
      <h2>Reconstruct</h2>
      <p class="empty"><strong>Put the passage back in order.</strong> The cards are shuffled — drag them (or use ↑/↓) until the sequence matches the original. A card shows a cue until it sits in the right slot; then it expands to the full segment. Hint clicks and choosing <strong>Full segment</strong> each count as hints.</p>
      <label>Card cue while out of place
        <select id="reconstruct-cue">
          <option value="first_word" ${cueMode === "first_word" ? "selected" : ""}>First word</option>
          <option value="keywords" ${cueMode === "keywords" ? "selected" : ""}>Keywords</option>
          <option value="full" ${cueMode === "full" ? "selected" : ""}>Full segment (counts as hint)</option>
        </select>
      </label>
      <p class="stats-line">Hints this attempt: <strong id="hint-count">${hintsUsed}</strong> · Best: <strong>${passage.stats.bestHintCount ?? "—"}</strong> · Zero-hint wins: <strong>${passage.stats.zeroHintCompletions}</strong></p>
      <p class="order-legend"><span class="order-legend-cue">Cue</span> = still rearranging · <span class="order-legend-full">Full line</span> = correct place</p>
      <ul class="order-list" id="order-list" aria-label="Shuffled segments — rearrange into the correct order">
        ${order
          .map((item, i) => {
            const inPlace = item.id === correctIds[i];
            const label = reconstructCardLabel(item.text, cueMode, inPlace);
            const cls = [
              selected === i ? "selected" : "",
              inPlace ? "in-place" : "out-of-place",
              label.revealed ? "revealed" : "cue-only",
              checked ? (checked[i] ? "correct" : "wrong") : "",
            ]
              .filter(Boolean)
              .join(" ");
            return `<li class="order-item ${cls}" draggable="true" tabindex="0" data-index="${i}" data-id="${item.id}">
              <span class="seg-idx" title="Current slot ${i + 1}">${i + 1}</span>
              <span class="order-card-body">
                <span class="order-card-meta">${label.revealed ? "Full segment · slot correct" : "Cue · rearrange"}</span>
                <span class="order-card-text">${esc(label.text)}</span>
              </span>
            </li>`;
          })
          .join("")}
      </ul>
      <div class="row">
        <button class="btn ${isComplete(passage, "reconstruct") ? "secondary" : ""}" type="button" id="check-order">Check order</button>
        <button class="btn secondary" type="button" id="hint-btn">Hint (place next segment)</button>
        <button class="btn secondary" type="button" id="reshuffle">Reshuffle</button>
        <button class="btn secondary" type="button" id="reset-order">Reset attempt</button>
      </div>
      <p class="toast" id="order-toast">${esc(message)}</p>
      ${
        isComplete(passage, "reconstruct")
          ? `<div class="row stage-next-row"><button class="btn stage-next" type="button" id="continue-recall">Continue → Recall</button></div>`
          : ""
      }
    `;

    panel.querySelector("#reconstruct-cue")?.addEventListener("change", (e) => {
      const next = (e.target as HTMLSelectElement).value as ReconstructCueMode;
      if (
        next === "full" &&
        cueMode !== "full" &&
        !hintEvents.some((h) => h.kind === "full_cue")
      ) {
        hintsUsed += 1;
        hintEvents.push({
          kind: "full_cue",
          at: new Date().toISOString(),
          detail: "Switched card cue to Full segment",
        });
      }
      cueMode = next;
      paint();
    });

    let dragFrom: number | null = null;
    panel.querySelectorAll<HTMLElement>(".order-item").forEach((el) => {
      el.addEventListener("dragstart", () => {
        dragFrom = Number(el.dataset.index);
      });
      el.addEventListener("dragover", (e) => e.preventDefault());
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        const to = Number(el.dataset.index);
        if (dragFrom === null || Number.isNaN(to)) return;
        order = moveItem(order, dragFrom, to);
        checked = null;
        selected = to;
        paint();
      });
      el.addEventListener("click", () => {
        selected = Number(el.dataset.index);
        paint();
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          order = moveItem(order, selected, Math.max(0, selected - 1));
          selected = Math.max(0, selected - 1);
          checked = null;
          paint();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          order = moveItem(order, selected, Math.min(order.length - 1, selected + 1));
          selected = Math.min(order.length - 1, selected + 1);
          checked = null;
          paint();
        }
      });
    });

    panel.querySelector("#check-order")?.addEventListener("click", () => {
      const grade = gradeOrder(
        order.map((o) => o.id),
        correctIds,
      );
      checked = grade.correctPositions;
      if (grade.allCorrect) {
        let updated = recordAttempt(passage, {
          stage: "reconstruct",
          hintsUsed,
          hintEvents: hintEvents.slice(),
          durationMs: Date.now() - startedAt,
          success: true,
        });
        updated = {
          ...updated,
          stageProgress: {
            ...updated.stageProgress,
            reconstruct: { completed: true, updatedAt: new Date().toISOString() },
          },
        };
        savePassage(repo, updated);
        Object.assign(passage, updated);
        message =
          hintsUsed === 0
            ? "Perfect order — zero hints!"
            : `Correct order with ${hintsUsed} hint(s). Aim for 0 next time.`;
        onDone(updated);
        return;
      }
      message = "Not in order yet — green slots are right; keep rearranging the rest.";
      paint();
    });

    panel.querySelector("#hint-btn")?.addEventListener("click", () => {
      const result = applyHint(
        order.map((o) => o.id),
        correctIds,
      );
      if (result.hintedIndex === -1) {
        message = "Everything is already in order.";
        paint();
        return;
      }
      hintsUsed += 1;
      hintEvents.push({
        kind: "place_hint",
        at: new Date().toISOString(),
        detail: `Hint button placed the correct segment in slot ${result.hintedIndex + 1}`,
      });
      order = result.ids.map((id) => correct.find((c) => c.id === id)!);
      checked = null;
      selected = result.hintedIndex;
      message = `Hint: placed the correct segment in slot ${result.hintedIndex + 1}. Keep rearranging.`;
      paint();
    });

    panel.querySelector("#reshuffle")?.addEventListener("click", () => {
      order = shuffleItems(correct);
      checked = null;
      message = "Reshuffled — rearrange the cards into the correct order.";
      paint();
    });

    panel.querySelector("#reset-order")?.addEventListener("click", () => {
      order = shuffleItems(correct);
      hintsUsed = 0;
      hintEvents.length = 0;
      checked = null;
      cueMode = "first_word";
      message = "Attempt reset — rearrange from scratch.";
      paint();
    });

    panel.querySelector("#continue-recall")?.addEventListener("click", () => {
      history.replaceState(null, "", `#passage/${passage.id}/recall`);
      window.dispatchEvent(new Event("hashchange"));
    });
  };

  paint();
}

function renderRecall(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onDone: (p: Passage) => void,
): void {
  let level: ReductionLevel = "none";
  let reveal = false;
  const startedAt = Date.now();
  let hintsUsed = 0;
  const hintEvents: HintEvent[] = [];

  const paint = () => {
    const cue = localReduction(level, passage.text, passage.reductions[level]);
    panel.innerHTML = `
      <h2>Recall</h2>
      <p class="empty">Type the passage from memory. Checking is <strong>case-insensitive</strong> and <strong>lax about punctuation</strong> — but key words still need to be there. Revealing the original counts as a hint.</p>
      <label>Cue level
        <select id="recall-level">
          ${REDUCTION_LEVELS.map((l) => `<option value="${l.id}" ${l.id === level ? "selected" : ""}>${l.label}</option>`).join("")}
        </select>
      </label>
      <pre class="cue-pre">${esc(cue || "(no hints)")}</pre>
      <label>Your recall
        <textarea id="recall-text" placeholder="Type what you remember…"></textarea>
      </label>
      ${reveal ? `<pre class="cue-pre original">${esc(passage.text)}</pre>` : ""}
      <div class="row">
        <button class="btn secondary" type="button" id="recall-reveal">${reveal ? "Hide original" : "Reveal original (counts as hint)"}</button>
        <button class="btn ${isComplete(passage, "recall") ? "secondary" : ""}" type="button" id="recall-done">Check recall</button>
      </div>
      <p class="stats-line">Hints this attempt: <strong>${hintsUsed}</strong></p>
      <p class="toast" id="recall-toast" hidden></p>
      ${
        isComplete(passage, "recall")
          ? `<div class="row stage-next-row"><button class="btn stage-next" type="button" id="continue-master">Continue → Master</button></div>`
          : ""
      }
    `;
    panel.querySelector("#recall-level")?.addEventListener("change", (e) => {
      level = (e.target as HTMLSelectElement).value as ReductionLevel;
      paint();
    });
    panel.querySelector("#recall-reveal")?.addEventListener("click", () => {
      if (!reveal) {
        hintsUsed += 1;
        hintEvents.push({
          kind: "reveal_original",
          at: new Date().toISOString(),
          detail: "Revealed the full original passage",
        });
      }
      reveal = !reveal;
      paint();
    });
    panel.querySelector("#recall-done")?.addEventListener("click", () => {
      const text = panel.querySelector<HTMLTextAreaElement>("#recall-text")?.value ?? "";
      const grade = gradeRecall(passage.text, text);
      const toast = panel.querySelector<HTMLElement>("#recall-toast");
      if (grade.empty) {
        if (toast) {
          toast.hidden = false;
          toast.textContent = "Type your recall before checking.";
        }
        return;
      }
      let updated = recordAttempt(passage, {
        stage: "recall",
        hintsUsed,
        hintEvents: hintEvents.slice(),
        durationMs: Date.now() - startedAt,
        success: grade.ok,
      });
      if (grade.ok) {
        updated = {
          ...updated,
          stageProgress: {
            ...updated.stageProgress,
            recall: { completed: true, updatedAt: new Date().toISOString() },
          },
        };
      }
      savePassage(repo, updated);
      Object.assign(passage, updated);
      if (toast) {
        toast.hidden = false;
        toast.textContent = grade.ok
          ? `Correct (${Math.round(grade.similarity * 100)}% match, ${hintsUsed} hint(s)).`
          : `Not yet (${Math.round(grade.similarity * 100)}% match). Keep the wording closer to the original.`;
      }
      if (grade.ok) onDone(updated);
    });
    panel.querySelector("#continue-master")?.addEventListener("click", () => {
      history.replaceState(null, "", `#passage/${passage.id}/master`);
      location.hash = `#passage/${passage.id}/master`;
      window.dispatchEvent(new Event("hashchange"));
    });
  };
  paint();
}

function renderMaster(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onResetToRead: (p: Passage) => void,
): void {
  const checklist = STAGE_ORDER.map((s) => ({
    id: s,
    done: isComplete(passage, s) || (s === "master" && Boolean(passage.masteredAt)),
  }));
  const zeroHint = passage.stats.zeroHintCompletions > 0;
  const ready =
    checklist.filter((c) => c.id !== "master").every((c) => c.done) && zeroHint;
  const scoredAttempts = passage.attempts.filter((a) => a.stage === "reconstruct" || a.stage === "recall");

  panel.innerHTML = `
    <h2>Master</h2>
    <p class="empty">Mastery means every stage is truly completed and you have a <strong>correct zero-hint</strong> Reconstruct or Recall win. Hints include <strong>hint buttons you click</strong> and <strong>revealing the full segment/original</strong> (including Full-segment cue on Reconstruct).</p>
    <p class="stats-line">
      Zero-hint wins: <strong>${passage.stats.zeroHintCompletions}</strong>
      · Best hints on a win: <strong>${passage.stats.bestHintCount ?? "—"}</strong>
      · <button type="button" class="linkish" id="hint-details">Details</button>
    </p>
    <ul class="segment-list">
      ${checklist
        .map(
          (c) =>
            `<li><span class="seg-idx">${c.done ? "✓" : "·"}</span> ${c.id}${c.id === "master" ? " (this gate)" : ""}</li>`,
        )
        .join("")}
      <li><span class="seg-idx">${zeroHint ? "✓" : "·"}</span> At least one correct zero-hint completion</li>
    </ul>
    <div class="row stage-next-row">
      <button class="btn stage-next" type="button" id="mark-master" ${ready ? "" : "disabled"}>Mark mastered</button>
      <button class="btn danger" type="button" id="reset-mastery">Reset mastery</button>
    </div>
    <p class="toast" id="master-toast">${
      passage.masteredAt
        ? "Mastered. Reset anytime to train again from Read."
        : ready
          ? "Ready to mark mastery."
          : "Finish locked stages and earn a correct zero-hint win first."
    }</p>
  `;

  panel.querySelector("#hint-details")?.addEventListener("click", () => {
    const body =
      scoredAttempts.length === 0
        ? `<p>No Reconstruct or Recall attempts recorded yet.</p>
           <p>Hints count when you click a hint button, reveal the original text, or use the Full-segment cue while rearranging.</p>`
        : `<p>Each attempt below lists what counted toward its hint total.</p>
           <ul class="hint-attempt-list">
             ${scoredAttempts
               .slice()
               .reverse()
               .map((a) => {
                 const when = new Date(a.completedAt).toLocaleString();
                 const events = a.hintEvents?.length
                   ? `<ul>${a.hintEvents
                       .map(
                         (h) =>
                           `<li><strong>${esc(hintKindLabel(h.kind))}</strong> — ${esc(h.detail)} <span class="empty">(${esc(new Date(h.at).toLocaleString())})</span></li>`,
                       )
                       .join("")}</ul>`
                   : a.hintsUsed === 0
                     ? `<p class="empty">No hints on this attempt.</p>`
                     : `<p class="empty">${a.hintsUsed} hint(s) (details unavailable for this older attempt).</p>`;
                 return `<li class="hint-attempt">
                   <strong>${esc(a.stage)}</strong>
                   · ${a.success ? "success" : "miss"}
                   · ${a.hintsUsed} hint(s)${a.zeroHint ? " · zero-hint win" : ""}
                   · <span class="empty">${esc(when)}</span>
                   ${events}
                 </li>`;
               })
               .join("")}
           </ul>`;
    openHelpModal("Hint details", body);
  });

  panel.querySelector("#mark-master")?.addEventListener("click", () => {
    if (!ready) return;
    const now = new Date().toISOString();
    const updated: Passage = {
      ...passage,
      masteredAt: now,
      stageProgress: {
        ...passage.stageProgress,
        master: { completed: true, updatedAt: now },
      },
      updatedAt: now,
    };
    updated.stats = {
      ...updated.stats,
      memorizationPercent: Math.max(updated.stats.memorizationPercent, 100),
    };
    savePassage(repo, updated);
    Object.assign(passage, updated);
    const toast = panel.querySelector<HTMLElement>("#master-toast");
    if (toast) toast.textContent = "Mastered. Keep drilling to stay sharp.";
    panel.querySelector<HTMLButtonElement>("#mark-master")!.disabled = true;
  });

  panel.querySelector("#reset-mastery")?.addEventListener("click", () => {
    openHelpModal(
      "Reset mastery?",
      `<p>This clears mastery, sets hints/wins back to <strong>0</strong>, unlocks stages from the start, and returns you to <strong>Read</strong>.</p>
       <p>Choose whether to keep study content you filled in (notes, ChatGPT reductions, visual anchors / image URLs).</p>
       <div class="row modal-actions">
         <button type="button" class="btn" id="reset-keep">Keep filled info</button>
         <button type="button" class="btn danger" id="reset-clear">Reset filled info too</button>
         <button type="button" class="btn secondary" id="reset-cancel">Cancel</button>
       </div>`,
    );
    const modal = document.getElementById("app-help-modal");
    const finish = (mode: "keep_content" | "clear_content") => {
      const updated = resetMastery(passage, mode);
      savePassage(repo, updated);
      modal?.remove();
      onResetToRead(updated);
    };
    modal?.querySelector("#reset-keep")?.addEventListener("click", () => finish("keep_content"));
    modal?.querySelector("#reset-clear")?.addEventListener("click", () => finish("clear_content"));
    modal?.querySelector("#reset-cancel")?.addEventListener("click", () => modal.remove());
  });
}


function openHelpModal(title: string, bodyHtml: string): void {
  document.getElementById("app-help-modal")?.remove();
  const backdrop = document.createElement("div");
  backdrop.id = "app-help-modal";
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
      <div class="modal-head">
        <h3 id="help-modal-title">${esc(title)}</h3>
        <button type="button" class="btn secondary modal-close" aria-label="Close">Close</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
    </div>
  `;
  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector(".modal-close")?.addEventListener("click", close);
  document.addEventListener(
    "keydown",
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        close();
        document.removeEventListener("keydown", onKey);
      }
    },
  );
  document.body.appendChild(backdrop);
  (backdrop.querySelector(".modal-close") as HTMLButtonElement | null)?.focus();
}

function renderVisualize(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onChanged: (p: Passage) => void,
): void {
  if (passage.segments.length === 0) {
    panel.innerHTML = `<h2>Visualize</h2><p class="empty">Add passage text first, then build visual anchors.</p>`;
    return;
  }

  const paint = () => {
    const saved = passage.segments.filter((s) =>
      passage.visualAnchors.some(
        (a) =>
          a.segmentId === s.id &&
          Boolean(a.imagePrompt.trim() || a.userNote?.trim() || a.imageUrl?.trim()),
      ),
    ).length;
    panel.innerHTML = `
      <h2>Visualize</h2>
      <p class="empty">Optional: build a mental picture for any segment that helps. Copy a prompt into ChatGPT, generate an image if you want, then save a note or image URL. Leave segments blank if you like (${saved} saved).</p>
      <div class="grid">
        ${passage.segments
          .map((seg) => {
            const anchor = passage.visualAnchors.find((a) => a.segmentId === seg.id);
            const concept = anchor?.concept || inferConcept(seg.text);
            const prompt = anchor?.imagePrompt || buildImagePrompt(seg, concept);
            const has = Boolean(
              anchor?.imagePrompt?.trim() || anchor?.userNote?.trim() || anchor?.imageUrl?.trim(),
            );
            return `<article class="visual-card">
              <h3>Segment ${seg.index + 1} ${has ? "✓" : ""}</h3>
              <p>${esc(seg.text)}</p>
              <label>Visual concept
                <input data-concept="${seg.id}" value="${esc(concept)}" />
              </label>
              <label>Image prompt
                <textarea data-prompt="${seg.id}" readonly>${esc(prompt)}</textarea>
              </label>
              <div class="row prompt-actions">
                <button class="btn secondary" type="button" data-copy="${seg.id}">Copy image prompt</button>
                <a class="btn secondary" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Open ChatGPT</a>
              </div>
              <label>
                <span class="label-row">
                  <span class="label-text">Your note / image URL <span class="optional-tag">(optional)</span></span>
                  <button type="button" class="help-icon" data-help-note="${seg.id}" aria-label="What goes in note or image URL?">?</button>
                </span>
                <input data-note="${seg.id}" placeholder="Short note or https://… image URL" value="${esc(anchor?.userNote || anchor?.imageUrl || "")}" />
              </label>
              <div class="row">
                <button class="btn" type="button" data-save="${seg.id}">Save anchor</button>
              </div>
            </article>`;
          })
          .join("")}
      </div>
      <div class="row stage-next-row">
        <button class="btn ${isComplete(passage, "visualize") ? "secondary" : "stage-next"}" type="button" id="mark-visualize">${isComplete(passage, "visualize") ? "Visualize completed" : "Mark Visualize complete"}</button>
        <span class="toast" id="viz-toast" hidden></span>
      </div>
    `;

    const toast = (msg: string) => {
      const el = panel.querySelector<HTMLElement>("#viz-toast");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
    };

    panel.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.copy!;
        const text = panel.querySelector<HTMLTextAreaElement>(`[data-prompt="${id}"]`)?.value ?? "";
        await navigator.clipboard.writeText(text);
        toast("Image prompt copied — open ChatGPT and paste it.");
      });
    });

    panel.querySelectorAll<HTMLButtonElement>("[data-help-note]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openHelpModal(
          "Your note / image URL",
          `<p>This field is optional. Use it in either of these ways:</p>
           <ul>
             <li><strong>Note</strong> — a short reminder of the picture in your mind (for example, “father on a high throne”).</li>
             <li><strong>Image URL</strong> — a link to the picture ChatGPT made.</li>
           </ul>
           <p>To get an image URL from ChatGPT:</p>
           <ol>
             <li>Open ChatGPT and paste the image prompt</li>
             <li>Ask it to generate the image</li>
             <li>Right-click the generated image → <strong>Copy image address</strong> (or Copy image link)</li>
             <li>Paste that URL here, then click Save anchor</li>
           </ol>`,
        );
      });
    });

    panel.querySelectorAll<HTMLButtonElement>("[data-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.save!;
        const seg = passage.segments.find((s) => s.id === id);
        if (!seg) return;
        const concept =
          panel.querySelector<HTMLInputElement>(`[data-concept="${id}"]`)?.value ||
          inferConcept(seg.text);
        const prompt =
          panel.querySelector<HTMLTextAreaElement>(`[data-prompt="${id}"]`)?.value ||
          buildImagePrompt(seg, concept);
        const note =
          panel.querySelector<HTMLInputElement>(`[data-note="${id}"]`)?.value || undefined;
        const now = new Date().toISOString();
        const anchor: VisualAnchor = {
          segmentId: id,
          concept,
          imagePrompt: prompt,
          userNote: note,
          imageUrl: note?.startsWith("http") ? note : undefined,
          updatedAt: now,
        };
        const others = passage.visualAnchors.filter((a) => a.segmentId !== id);
        const updated: Passage = {
          ...passage,
          visualAnchors: [...others, anchor],
          updatedAt: now,
        };
        savePassage(repo, updated);
        Object.assign(passage, updated);
        toast("Visual anchor saved.");
        onChanged(updated);
      });
    });

    panel.querySelectorAll<HTMLInputElement>("[data-concept]").forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.dataset.concept!;
        const seg = passage.segments.find((s) => s.id === id);
        if (!seg) return;
        const area = panel.querySelector<HTMLTextAreaElement>(`[data-prompt="${id}"]`);
        if (area) area.value = buildImagePrompt(seg, input.value);
      });
    });

    panel.querySelector("#mark-visualize")?.addEventListener("click", () => {
      const updated = markStage(repo, passage, "visualize");
      Object.assign(passage, updated);
      toast("Visualize complete.");
      onChanged(updated);
    });
  };

  paint();
}

function initialReduceLevel(passage: Passage): ReductionLevel {
  if (passage.reductions.keywords?.trim()) return "keywords";
  if (passage.reductions.essential?.trim()) return "essential";
  const last = passage.reductionMeta?.lastLevel;
  if (last && REDUCTION_LEVELS.some((l) => l.id === last)) return last;
  return "first_words";
}

function renderReduce(
  panel: HTMLElement,
  repo: PassageRepository,
  passage: Passage,
  onChanged: (p: Passage) => void,
): void {
  let level: ReductionLevel = initialReduceLevel(passage);
  let reveal = false;

  const canComplete = (): { ok: boolean; reason: string } => {
    if (level === "full") {
      return { ok: false, reason: "Practice a reduced level (not Full text) before completing." };
    }
    const meta = REDUCTION_LEVELS.find((l) => l.id === level)!;
    if (meta.needsPaste && !passage.reductions[level]?.trim()) {
      return {
        ok: false,
        reason: "Paste a ChatGPT reduction for this level (or switch to First words / First letters / No hints).",
      };
    }
    return { ok: true, reason: "" };
  };

  const paint = (notice?: { msg: string; kind?: "ok" | "warn" }) => {
    const cue = localReduction(level, passage.text, passage.reductions[level]);
    const meta = REDUCTION_LEVELS.find((l) => l.id === level)!;
    const pastedSaved = Boolean(passage.reductions[level]?.trim());
    const needsPaste = meta.needsPaste;
    const pasteMissing = needsPaste && !pastedSaved;
    const pasteMode = level === "keywords" ? "keywords" : "essential";
    const savedAt = pastedSaved ? passage.reductionMeta?.updatedAt : undefined;

    panel.innerHTML = `
      <h2>Reduce</h2>
      <p class="empty">Practice whether you can <strong>recall the passage from different cue formats</strong> — from fuller wording down to keywords, first letters, or no hints. Speak or recite from the cue, then reveal the original to check yourself. Complete the stage after practicing a <strong>reduced</strong> (not Full text) level.</p>
      <label>Cue format to practice from
        <select id="level">
          ${REDUCTION_LEVELS.map((l) => {
            const hasSaved = l.needsPaste && Boolean(passage.reductions[l.id]?.trim());
            return `<option value="${l.id}" ${l.id === level ? "selected" : ""}>${l.label}${hasSaved ? " · saved" : ""}</option>`;
          }).join("")}
        </select>
      </label>
      ${
        needsPaste
          ? `<section class="reduce-help ${pasteMissing ? "is-missing" : "is-ready"}" id="chatgpt-help" aria-live="polite">
              <div class="reduce-help-head">
                <strong>${pasteMissing ? "ChatGPT reduction required" : "ChatGPT reduction saved locally"}</strong>
                <span class="req-badge ${pasteMissing ? "missing" : "ok"}">${pasteMissing ? "Missing" : "Saved"}</span>
              </div>
              ${
                pastedSaved
                  ? `<p class="empty reduce-help-alt">This reduction stays with the passage until you reset it.${savedAt ? ` Last saved ${esc(new Date(savedAt).toLocaleString())}.` : ""}</p>`
                  : `<ol class="reduce-steps">
              <li>Copy the prompt below</li>
              <li>Open <a class="chatgpt-link" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT</a>, paste it, and generate</li>
              <li>Copy ChatGPT’s answer into the required field, then save</li>
            </ol>
            <p class="empty reduce-help-alt">Or switch cue level to <strong>First words</strong>, <strong>First letters</strong>, or <strong>No hints</strong> (no ChatGPT needed).</p>`
              }
              <label>1. ChatGPT prompt
                <textarea id="ai-prompt" readonly>${esc(buildReductionPrompt(pasteMode, passage.title, passage.text))}</textarea>
              </label>
              <div class="row">
                <button class="btn secondary" type="button" id="copy-prompt">Copy prompt</button>
                <a class="btn secondary" id="open-chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Open ChatGPT</a>
              </div>
              <label class="${pasteMissing ? "field-missing" : "field-ready"}">
                <span class="label-row">2. Paste ChatGPT reduction <span class="req-badge ${pasteMissing ? "missing" : "ok"}">${pasteMissing ? "Required — missing" : "Saved"}</span></span>
                <textarea id="paste-reduction" ${pasteMissing ? 'aria-invalid="true" aria-required="true"' : ""} placeholder="Paste ChatGPT’s reduced text here…">${esc(passage.reductions[level] ?? "")}</textarea>
              </label>
              <div class="row">
                <button class="btn" type="button" id="save-reduction">${pastedSaved ? "Update saved reduction" : "Save pasted reduction"}</button>
                ${pastedSaved ? `<button class="btn danger" type="button" id="reset-reduction">Reset saved reduction</button>` : ""}
              </div>
            </section>`
          : ""
      }
      <div class="cue-box panel" style="margin-top:1rem;box-shadow:none">
        <p><strong>Practice cue</strong> — try to recall the full passage from this alone</p>
        <pre class="cue-pre">${esc(cue || "(no hints — recall from memory)")}</pre>
        ${reveal ? `<pre class="cue-pre original">${esc(passage.text)}</pre>` : ""}
      </div>
      <div class="row stage-next-row">
        <button class="btn secondary" type="button" id="toggle-reveal">${reveal ? "Hide original" : "Reveal original to check"}</button>
        <button class="btn ${isComplete(passage, "reduce") ? "secondary" : "stage-next"}" type="button" id="mark-reduce" ${pasteMissing ? "disabled" : ""} title="${pasteMissing ? "Save a ChatGPT reduction first" : "Mark Reduce practiced"}">${isComplete(passage, "reduce") ? "Reduce completed" : "Mark Reduce practiced"}</button>
        <span class="toast" id="reduce-toast" hidden></span>
      </div>
    `;

    const toast = (msg: string, kind: "ok" | "warn" = "ok") => {
      const el = panel.querySelector<HTMLElement>("#reduce-toast");
      if (!el) return;
      el.hidden = false;
      el.classList.toggle("warn", kind === "warn");
      el.textContent = msg;
    };
    if (notice) toast(notice.msg, notice.kind ?? "ok");

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
      const gate = canComplete();
      if (!gate.ok) {
        toast(gate.reason, "warn");
        panel.querySelector("#chatgpt-help")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        panel.querySelector("#paste-reduction")?.classList.add("flash-missing");
        return;
      }
      const updated = markStage(repo, passage, "reduce");
      Object.assign(passage, updated);
      toast("Reduce complete.");
      onChanged(updated);
    });
    panel.querySelector("#copy-prompt")?.addEventListener("click", async () => {
      const text = panel.querySelector<HTMLTextAreaElement>("#ai-prompt")?.value ?? "";
      await navigator.clipboard.writeText(text);
      toast("Prompt copied — open ChatGPT and paste it.");
    });
    panel.querySelector("#save-reduction")?.addEventListener("click", () => {
      const pasted = panel.querySelector<HTMLTextAreaElement>("#paste-reduction")?.value ?? "";
      if (!pasted.trim()) {
        toast("Paste ChatGPT’s reduced text into the required field.", "warn");
        panel.querySelector<HTMLTextAreaElement>("#paste-reduction")?.focus();
        return;
      }
      const now = new Date().toISOString();
      const prompt = buildReductionPrompt(pasteMode, passage.title, passage.text);
      const updated: Passage = {
        ...passage,
        reductions: { ...passage.reductions, [level]: pasted },
        reductionMeta: { promptUsed: prompt, updatedAt: now, lastLevel: level },
        updatedAt: now,
      };
      savePassage(repo, updated);
      Object.assign(passage, updated);
      onChanged(updated);
    });
    panel.querySelector("#reset-reduction")?.addEventListener("click", () => {
      const reductions = { ...passage.reductions };
      delete reductions[level];
      const now = new Date().toISOString();
      const updated: Passage = {
        ...passage,
        reductions,
        reductionMeta: {
          ...passage.reductionMeta,
          updatedAt: now,
          lastLevel: level,
        },
        updatedAt: now,
      };
      savePassage(repo, updated);
      Object.assign(passage, updated);
      onChanged(updated);
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
