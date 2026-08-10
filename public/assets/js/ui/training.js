import {
  applyHint,
  gradeOrder,
  moveItem,
  shuffleItems,
  toOrderItems
} from "../lib/ordering.js";
import {
  REDUCTION_LEVELS,
  buildReductionPrompt,
  localReduction
} from "../lib/reduction.js";
import { ensureSegments } from "../lib/segment.js";
import { recordAttempt } from "../lib/stats.js";
import { buildImagePrompt, inferConcept } from "../lib/visualPrompt.js";
import { PassageRepository } from "../storage/repository.js";
import { mountShareControls } from "./sharePanel.js";
const STAGES = [
  { id: "read", label: "Read", ready: true },
  { id: "understand", label: "Understand", ready: true },
  { id: "reduce", label: "Reduce", ready: true },
  { id: "visualize", label: "Visualize", ready: true },
  { id: "reconstruct", label: "Reconstruct", ready: true },
  { id: "recall", label: "Recall", ready: true },
  { id: "master", label: "Master", ready: true }
];
function renderTraining(root, repo, passageId, callbacks, stage = "read") {
  let passage = repo.getPassage(passageId);
  if (!passage) {
    callbacks.onBack();
    return;
  }
  passage = syncSegments(repo, passage);
  const libraryCount = repo.listPassages().length;
  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1 class="brand">Memorize <span>Script</span></h1>
          <p class="tagline">${esc(passage.title)}${passage.bibleReference ? ` \xB7 ${esc(passage.bibleReference)}` : ""}</p>
        </div>
        <nav class="row top-nav" aria-label="Primary">
          <button class="btn secondary" type="button" id="back-lib">Library (${libraryCount})</button>
        </nav>
      </header>
      <div id="share-host"></div>
      <nav class="stage-nav panel" aria-label="Training stages">
        ${STAGES.map(
    (s) => `<button type="button" class="stage-pill ${s.id === stage ? "active" : ""} ${s.ready ? "" : "soon"}" data-stage="${s.id}" ${s.ready ? "" : "disabled"}>${s.label}</button>`
  ).join("")}
      </nav>
      <section class="panel" id="stage-panel"></section>
    </div>
  `;
  root.querySelector("#back-lib")?.addEventListener("click", callbacks.onBack);
  const shareHost = root.querySelector("#share-host");
  if (shareHost) mountShareControls(shareHost, passage);
  root.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.stage;
      history.replaceState(null, "", `#passage/${passageId}/${next}`);
      renderTraining(root, repo, passageId, callbacks, next);
    });
  });
  const panel = root.querySelector("#stage-panel");
  if (!panel) return;
  if (stage === "read")
    renderRead(panel, repo, passage, () => {
      history.replaceState(null, "", `#passage/${passageId}/understand`);
      renderTraining(root, repo, passageId, callbacks, "understand");
    });
  else if (stage === "understand") renderUnderstand(panel, repo, passage);
  else if (stage === "reduce") renderReduce(panel, repo, passage);
  else if (stage === "visualize") renderVisualize(panel, repo, passage);
  else if (stage === "reconstruct") renderReconstruct(panel, repo, passage);
  else if (stage === "recall") renderRecall(panel, repo, passage);
  else if (stage === "master") renderMaster(panel, repo, passage);
  else {
    panel.innerHTML = `<h2>${stage}</h2><p class="empty">Unknown stage.</p>`;
  }
}
function syncSegments(repo, passage) {
  const segments = ensureSegments(passage.text, passage.segments);
  if (segments === passage.segments) return passage;
  const doc = repo.load();
  const updated = {
    ...passage,
    segments,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
  repo.save(doc);
  return updated;
}
function markStage(repo, passage, stage) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const updated = {
    ...passage,
    stageProgress: {
      ...passage.stageProgress,
      [stage]: { completed: true, updatedAt: now }
    },
    updatedAt: now
  };
  const doc = repo.load();
  doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
  repo.save(doc);
  return updated;
}
function renderRead(panel, repo, passage, onContinue) {
  panel.innerHTML = `
    <h2>Read</h2>
    <p class="empty">Read the full passage with segment markers. Absorb cadence before reducing.</p>
    <ol class="segment-list">
      ${passage.segments.map((s) => `<li><span class="seg-idx">${s.index + 1}</span> ${esc(s.text)}</li>`).join("")}
    </ol>
    <div class="row">
      <button class="btn" type="button" id="mark-read">Mark Read complete \u2192 Understand</button>
    </div>
  `;
  panel.querySelector("#mark-read")?.addEventListener("click", () => {
    markStage(repo, passage, "read");
    onContinue();
  });
}
function renderUnderstand(panel, repo, passage) {
  panel.innerHTML = `
    <h2>Understand</h2>
    <p class="empty">Capture meaning per segment. Notes stay on this device.</p>
    <div class="grid" id="notes">
      ${passage.segments.map(
    (s) => `<label>Segment ${s.index + 1}: ${esc(s.text)}
            <textarea data-note="${s.id}" placeholder="Meaning, emotion, or cue">${esc(passage.segmentNotes[s.id] ?? "")}</textarea>
          </label>`
  ).join("")}
    </div>
    <div class="row" style="margin-top:1rem">
      <button class="btn" type="button" id="save-notes">Save notes</button>
      <span class="toast" id="notes-toast" hidden></span>
    </div>
  `;
  panel.querySelector("#save-notes")?.addEventListener("click", () => {
    const notes = { ...passage.segmentNotes };
    panel.querySelectorAll("[data-note]").forEach((el) => {
      notes[el.dataset.note] = el.value;
    });
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      ...passage,
      segmentNotes: notes,
      stageProgress: {
        ...passage.stageProgress,
        understand: { completed: true, updatedAt: now }
      },
      updatedAt: now
    };
    const doc = repo.load();
    doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
    repo.save(doc);
    const toast = panel.querySelector("#notes-toast");
    if (toast) {
      toast.hidden = false;
      toast.textContent = "Notes saved.";
    }
  });
}
function savePassage(repo, passage) {
  const doc = repo.load();
  doc.passages = doc.passages.map((p) => p.id === passage.id ? passage : p);
  repo.save(doc);
}
function renderReconstruct(panel, repo, passage) {
  const correct = toOrderItems(passage.segments);
  const correctIds = correct.map((c) => c.id);
  let order = shuffleItems(correct);
  let selected = 0;
  let hintsUsed = 0;
  let checked = null;
  let message = "Bring the hint count down to 0.";
  const startedAt = Date.now();
  const paint = () => {
    panel.innerHTML = `
      <h2>Reconstruct</h2>
      <p class="empty"><strong>Bring the hint count down to 0.</strong> Drag segments, or use keyboard: \u2191/\u2193 move, Enter select.</p>
      <p class="stats-line">Hints this attempt: <strong id="hint-count">${hintsUsed}</strong> \xB7 Best: <strong>${passage.stats.bestHintCount ?? "\u2014"}</strong> \xB7 Zero-hint wins: <strong>${passage.stats.zeroHintCompletions}</strong></p>
      <ul class="order-list" id="order-list">
        ${order.map((item, i) => {
      const cls = [
        selected === i ? "selected" : "",
        checked ? checked[i] ? "correct" : "wrong" : ""
      ].filter(Boolean).join(" ");
      return `<li class="order-item ${cls}" draggable="true" tabindex="0" data-index="${i}" data-id="${item.id}">
              <span class="seg-idx">${i + 1}</span>
              <span>${esc(item.text)}</span>
            </li>`;
    }).join("")}
      </ul>
      <div class="row">
        <button class="btn" type="button" id="check-order">Check order</button>
        <button class="btn secondary" type="button" id="hint-btn">Hint (next phrase)</button>
        <button class="btn secondary" type="button" id="reshuffle">Reshuffle</button>
        <button class="btn secondary" type="button" id="reset-order">Reset attempt</button>
      </div>
      <p class="toast" id="order-toast">${esc(message)}</p>
    `;
    const list = panel.querySelector("#order-list");
    let dragFrom = null;
    list?.querySelectorAll(".order-item").forEach((el) => {
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
        correctIds
      );
      checked = grade.correctPositions;
      if (grade.allCorrect) {
        const updated = recordAttempt(passage, {
          stage: "reconstruct",
          hintsUsed,
          durationMs: Date.now() - startedAt,
          success: true
        });
        updated.stageProgress = {
          ...updated.stageProgress,
          reconstruct: { completed: true, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
        };
        savePassage(repo, updated);
        Object.assign(passage, updated);
        message = hintsUsed === 0 ? "Perfect \u2014 zero hints!" : `Correct with ${hintsUsed} hint(s). Aim for 0 next time.`;
      } else {
        message = "Not yet \u2014 correct phrases are highlighted.";
      }
      paint();
    });
    panel.querySelector("#hint-btn")?.addEventListener("click", () => {
      const result = applyHint(
        order.map((o) => o.id),
        correctIds
      );
      if (result.hintedIndex === -1) {
        message = "Nothing left to hint.";
        paint();
        return;
      }
      hintsUsed += 1;
      order = result.ids.map((id) => correct.find((c) => c.id === id));
      checked = null;
      selected = result.hintedIndex;
      message = `Hint placed phrase #${result.hintedIndex + 1}. Bring the hint count down to 0.`;
      paint();
    });
    panel.querySelector("#reshuffle")?.addEventListener("click", () => {
      order = shuffleItems(correct);
      checked = null;
      message = "Reshuffled. Bring the hint count down to 0.";
      paint();
    });
    panel.querySelector("#reset-order")?.addEventListener("click", () => {
      order = shuffleItems(correct);
      hintsUsed = 0;
      checked = null;
      message = "Attempt reset. Bring the hint count down to 0.";
      paint();
    });
  };
  paint();
}
function renderRecall(panel, repo, passage) {
  let level = "none";
  let reveal = false;
  const startedAt = Date.now();
  let hintsUsed = 0;
  const paint = () => {
    const cue = localReduction(level, passage.text, passage.reductions[level]);
    panel.innerHTML = `
      <h2>Recall</h2>
      <p class="empty">Speak or write from memory. Use fading cues only if needed \u2014 goal is still zero hints.</p>
      <label>Cue level
        <select id="recall-level">
          ${REDUCTION_LEVELS.map((l) => `<option value="${l.id}" ${l.id === level ? "selected" : ""}>${l.label}</option>`).join("")}
        </select>
      </label>
      <pre class="cue-pre">${esc(cue || "(no hints)")}</pre>
      <label>Your recall
        <textarea id="recall-text" placeholder="Type what you remember\u2026"></textarea>
      </label>
      ${reveal ? `<pre class="cue-pre original">${esc(passage.text)}</pre>` : ""}
      <div class="row">
        <button class="btn secondary" type="button" id="recall-reveal">${reveal ? "Hide original" : "Reveal original (counts as hint)"}</button>
        <button class="btn" type="button" id="recall-done">Mark recall attempt</button>
      </div>
      <p class="toast" id="recall-toast" hidden></p>
    `;
    panel.querySelector("#recall-level")?.addEventListener("change", (e) => {
      level = e.target.value;
      paint();
    });
    panel.querySelector("#recall-reveal")?.addEventListener("click", () => {
      if (!reveal) hintsUsed += 1;
      reveal = !reveal;
      paint();
    });
    panel.querySelector("#recall-done")?.addEventListener("click", () => {
      const text = panel.querySelector("#recall-text")?.value.trim() ?? "";
      const success = text.length > 0;
      const updated = recordAttempt(passage, {
        stage: "recall",
        hintsUsed,
        durationMs: Date.now() - startedAt,
        success
      });
      updated.stageProgress = {
        ...updated.stageProgress,
        recall: { completed: success, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
      };
      savePassage(repo, updated);
      Object.assign(passage, updated);
      const toast = panel.querySelector("#recall-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = success ? `Attempt saved (${hintsUsed} hint(s)). Bring the hint count down to 0.` : "Type a recall before marking complete.";
      }
    });
  };
  paint();
}
function renderMaster(panel, repo, passage) {
  const stages = [
    "read",
    "understand",
    "reduce",
    "visualize",
    "reconstruct",
    "recall",
    "master"
  ];
  const checklist = stages.map((s) => ({
    id: s,
    done: Boolean(passage.stageProgress[s]?.completed) || s === "master" && Boolean(passage.masteredAt)
  }));
  const zeroHint = passage.stats.zeroHintCompletions > 0;
  const ready = checklist.filter((c) => c.id !== "master").every((c) => c.done) && zeroHint;
  panel.innerHTML = `
    <h2>Master</h2>
    <p class="empty">Mastery means the full path is practiced and you have a zero-hint reconstruct/recall win.</p>
    <ul class="segment-list">
      ${checklist.map(
    (c) => `<li><span class="seg-idx">${c.done ? "\u2713" : "\xB7"}</span> ${c.id}${c.id === "master" ? " (this gate)" : ""}</li>`
  ).join("")}
      <li><span class="seg-idx">${zeroHint ? "\u2713" : "\xB7"}</span> At least one zero-hint completion</li>
    </ul>
    <div class="row">
      <button class="btn" type="button" id="mark-master" ${ready ? "" : "disabled"}>Mark mastered</button>
      <span class="toast" id="master-toast">${ready ? "Ready to mark mastery." : "Complete earlier stages and earn a zero-hint win first."}</span>
    </div>
  `;
  panel.querySelector("#mark-master")?.addEventListener("click", () => {
    if (!ready) return;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      ...passage,
      masteredAt: now,
      stageProgress: {
        ...passage.stageProgress,
        master: { completed: true, updatedAt: now }
      },
      updatedAt: now
    };
    updated.stats = {
      ...updated.stats,
      memorizationPercent: Math.max(updated.stats.memorizationPercent, 100)
    };
    savePassage(repo, updated);
    Object.assign(passage, updated);
    const toast = panel.querySelector("#master-toast");
    if (toast) toast.textContent = "Mastered. Keep drilling to stay sharp.";
  });
}
function renderVisualize(panel, repo, passage) {
  const paint = () => {
    panel.innerHTML = `
      <h2>Visualize</h2>
      <p class="empty">Build a storyboard of mental anchors. Copy each image prompt into ChatGPT image generation, then store your association here.</p>
      <div class="grid">
        ${passage.segments.map((seg) => {
      const anchor = passage.visualAnchors.find((a) => a.segmentId === seg.id);
      const concept = anchor?.concept || inferConcept(seg.text);
      const prompt = anchor?.imagePrompt || buildImagePrompt(seg, concept);
      return `<article class="visual-card">
              <h3>Segment ${seg.index + 1}</h3>
              <p>${esc(seg.text)}</p>
              <label>Visual concept
                <input data-concept="${seg.id}" value="${esc(concept)}" />
              </label>
              <label>Image prompt
                <textarea data-prompt="${seg.id}" readonly>${esc(prompt)}</textarea>
              </label>
              <label>Your note / image URL (optional)
                <input data-note="${seg.id}" value="${esc(anchor?.userNote || anchor?.imageUrl || "")}" />
              </label>
              <div class="row">
                <button class="btn secondary" type="button" data-copy="${seg.id}">Copy image prompt</button>
                <button class="btn" type="button" data-save="${seg.id}">Save anchor</button>
              </div>
            </article>`;
    }).join("")}
      </div>
      <p class="toast" id="viz-toast" hidden></p>
    `;
    const toast = (msg) => {
      const el = panel.querySelector("#viz-toast");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
    };
    panel.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.copy;
        const text = panel.querySelector(`[data-prompt="${id}"]`)?.value ?? "";
        await navigator.clipboard.writeText(text);
        toast("Image prompt copied.");
      });
    });
    panel.querySelectorAll("[data-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.save;
        const seg = passage.segments.find((s) => s.id === id);
        if (!seg) return;
        const concept = panel.querySelector(`[data-concept="${id}"]`)?.value || inferConcept(seg.text);
        const prompt = buildImagePrompt(seg, concept);
        const note = panel.querySelector(`[data-note="${id}"]`)?.value || void 0;
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const anchor = {
          segmentId: id,
          concept,
          imagePrompt: prompt,
          userNote: note,
          imageUrl: note?.startsWith("http") ? note : void 0,
          updatedAt: now
        };
        const others = passage.visualAnchors.filter((a) => a.segmentId !== id);
        const updated = {
          ...passage,
          visualAnchors: [...others, anchor],
          stageProgress: {
            ...passage.stageProgress,
            visualize: { completed: true, updatedAt: now }
          },
          updatedAt: now
        };
        savePassage(repo, updated);
        Object.assign(passage, updated);
        toast("Visual anchor saved.");
        paint();
      });
    });
    panel.querySelectorAll("[data-concept]").forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.dataset.concept;
        const seg = passage.segments.find((s) => s.id === id);
        if (!seg) return;
        const area = panel.querySelector(`[data-prompt="${id}"]`);
        if (area) area.value = buildImagePrompt(seg, input.value);
      });
    });
  };
  paint();
}
function renderReduce(panel, repo, passage) {
  let level = "full";
  let reveal = false;
  const paint = () => {
    const cue = localReduction(level, passage.text, passage.reductions[level]);
    const meta = REDUCTION_LEVELS.find((l) => l.id === level);
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
        <pre class="cue-pre">${esc(cue || "(no hints \u2014 recall from memory)")}</pre>
        ${reveal ? `<pre class="cue-pre original">${esc(passage.text)}</pre>` : ""}
      </div>
      <div class="row" style="margin-top:1rem">
        <button class="btn secondary" type="button" id="toggle-reveal">${reveal ? "Hide original" : "Reveal original"}</button>
        <button class="btn" type="button" id="mark-reduce">Mark Reduce practiced</button>
      </div>
      ${meta.needsPaste ? `<div class="grid" style="margin-top:1.25rem">
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
            </div>` : ""}
    `;
    panel.querySelector("#level")?.addEventListener("change", (e) => {
      level = e.target.value;
      reveal = false;
      paint();
    });
    panel.querySelector("#toggle-reveal")?.addEventListener("click", () => {
      reveal = !reveal;
      paint();
    });
    panel.querySelector("#mark-reduce")?.addEventListener("click", () => {
      markStage(repo, passage, "reduce");
      const toast = panel.querySelector("#reduce-toast");
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
      const text = panel.querySelector("#ai-prompt")?.value ?? "";
      await navigator.clipboard.writeText(text);
      const toast = panel.querySelector("#reduce-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Prompt copied.";
      }
    });
    panel.querySelector("#save-reduction")?.addEventListener("click", () => {
      const pasted = panel.querySelector("#paste-reduction")?.value ?? "";
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const prompt = buildReductionPrompt(
        level === "keywords" ? "keywords" : "essential",
        passage.title,
        passage.text
      );
      const updated = {
        ...passage,
        reductions: { ...passage.reductions, [level]: pasted },
        reductionMeta: { promptUsed: prompt, updatedAt: now },
        updatedAt: now
      };
      const doc = repo.load();
      doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
      repo.save(doc);
      passage = updated;
      const toast = panel.querySelector("#reduce-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Reduction saved locally.";
      }
      paint();
    });
  };
  paint();
}
function esc(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
export {
  renderTraining
};
