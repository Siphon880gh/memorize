"use strict";
(() => {
  // src/data/sampleDailyBread.ts
  var DAILY_BREAD_PRAYER_STARTER = {
    type: "bible",
    title: "Daily Bread Prayer",
    bibleReference: "Matthew 6:9-13",
    versionHint: "KJV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Matthew%206%3A9-13&version=KJV",
    text: [
      "Our Father which art in heaven, Hallowed be thy name.",
      "Thy kingdom come. Thy will be done in earth, as it is in heaven.",
      "Give us this day our daily bread.",
      "And forgive us our debts, as we forgive our debtors.",
      "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen."
    ].join("\n")
  };

  // src/data/samplePsalm91.ts
  var PSALM_91_STARTER = {
    type: "bible",
    title: "Psalm 91",
    bibleReference: "Psalm 91",
    versionHint: "NIV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Psalm%2091&version=NIV",
    text: ""
  };

  // src/lib/share.ts
  function buildSharePayload(passage, opts = {}) {
    const payload = {
      v: 1,
      type: passage.type,
      title: passage.title
    };
    if (passage.bibleReference) payload.bibleReference = passage.bibleReference;
    if (passage.versionHint) payload.versionHint = passage.versionHint;
    const includeText = opts.includeText === true && passage.type !== "bible" && Boolean(passage.text?.trim());
    if (passage.type === "bible") {
      return payload;
    }
    if (includeText) payload.text = passage.text;
    return payload;
  }
  function encodeSharePayload(payload) {
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  function decodeSharePayload(encoded) {
    try {
      const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - padded.length % 4);
      const json = decodeURIComponent(escape(atob(padded + pad)));
      const data = JSON.parse(json);
      if (data?.v !== 1 || !data.title || !data.type) return null;
      return data;
    } catch {
      return null;
    }
  }
  function shareUrlFromPayload(payload, origin = location.origin, path = location.pathname) {
    return `${origin}${path}#share/${encodeSharePayload(payload)}`;
  }

  // src/types.ts
  var STORAGE_KEY = "memorize-script.v1";
  var SCHEMA_VERSION = 1;
  var PASSAGE_TYPES = [
    "bible",
    "speech",
    "acting_script",
    "monologue",
    "presentation",
    "poem",
    "song_spoken",
    "custom"
  ];
  function emptyStats() {
    return {
      bestHintCount: null,
      latestHintCount: null,
      attemptCount: 0,
      zeroHintCompletions: 0,
      bestTimeMs: null,
      lastPracticedAt: null,
      memorizationPercent: 0
    };
  }
  function newId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  // src/storage/repository.ts
  function defaultSettings() {
    return { aiMode: "copy_paste", theme: "system" };
  }
  function emptyDocument() {
    return {
      schemaVersion: SCHEMA_VERSION,
      settings: defaultSettings(),
      passages: []
    };
  }
  function migrateDocument(raw) {
    if (!raw || typeof raw !== "object") return emptyDocument();
    const doc = raw;
    const version = doc.schemaVersion ?? 0;
    if (version > SCHEMA_VERSION) {
      throw new Error(`Unsupported schemaVersion ${version}`);
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      settings: {
        ...defaultSettings(),
        ...doc.settings ?? {},
        aiMode: "copy_paste"
      },
      passages: Array.isArray(doc.passages) ? doc.passages.map(normalizePassage) : []
    };
  }
  function normalizePassage(p) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: p.id || newId(),
      type: p.type || "custom",
      title: p.title || "Untitled",
      bibleReference: p.bibleReference,
      versionHint: p.versionHint,
      bibleGatewayUrl: p.bibleGatewayUrl,
      text: p.text || "",
      createdAt: p.createdAt || now,
      updatedAt: p.updatedAt || now,
      segments: Array.isArray(p.segments) ? p.segments : [],
      segmentNotes: p.segmentNotes && typeof p.segmentNotes === "object" ? p.segmentNotes : {},
      reductions: p.reductions && typeof p.reductions === "object" ? p.reductions : {},
      reductionMeta: p.reductionMeta,
      visualAnchors: Array.isArray(p.visualAnchors) ? p.visualAnchors : [],
      stageProgress: p.stageProgress && typeof p.stageProgress === "object" ? p.stageProgress : {},
      attempts: Array.isArray(p.attempts) ? p.attempts : [],
      stats: { ...emptyStats(), ...p.stats ?? {} },
      masteredAt: p.masteredAt ?? null
    };
  }
  var PassageRepository = class {
    storage;
    constructor(storage = localStorage) {
      this.storage = storage;
    }
    load() {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return emptyDocument();
      try {
        return migrateDocument(JSON.parse(raw));
      } catch {
        return emptyDocument();
      }
    }
    save(doc) {
      const payload = {
        ...doc,
        schemaVersion: SCHEMA_VERSION
      };
      this.storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    listPassages() {
      return this.load().passages.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    getPassage(id) {
      return this.load().passages.find((p) => p.id === id);
    }
    upsertPassage(input) {
      const doc = this.load();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const existing = input.id ? doc.passages.find((p) => p.id === input.id) : void 0;
      const passage = normalizePassage({
        ...existing ?? {},
        id: existing?.id ?? newId(),
        type: input.type,
        title: input.title.trim() || "Untitled",
        text: input.text,
        bibleReference: input.bibleReference?.trim() || void 0,
        versionHint: input.versionHint?.trim() || void 0,
        bibleGatewayUrl: input.bibleGatewayUrl?.trim() || void 0,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now
      });
      if (existing) {
        doc.passages = doc.passages.map((p) => p.id === passage.id ? passage : p);
      } else {
        doc.passages.push(passage);
      }
      this.save(doc);
      return passage;
    }
    deletePassage(id) {
      const doc = this.load();
      const before = doc.passages.length;
      doc.passages = doc.passages.filter((p) => p.id !== id);
      if (doc.passages.length === before) return false;
      this.save(doc);
      return true;
    }
    replaceDocument(doc) {
      this.save(migrateDocument(doc));
    }
  };

  // src/lib/backup.ts
  function exportDocument(doc) {
    return JSON.stringify(doc, null, 2);
  }
  function importDocument(raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Import failed: invalid JSON");
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Import failed: expected an object");
    }
    const version = parsed.schemaVersion;
    if (version == null) {
      throw new Error("Import failed: missing schemaVersion");
    }
    return migrateDocument(parsed);
  }
  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // src/ui/library.ts
  function typeLabel(t) {
    return t.replaceAll("_", " ");
  }
  function renderLibrary(root, repo2, callbacks, editing) {
    const passages = repo2.listPassages();
    root.innerHTML = `
    <header class="topbar">
      <div>
        <h1 class="brand">Memorize <span>Script</span></h1>
        <p class="tagline">Train long spoken material until hints drop to zero.</p>
      </div>
      <div class="row">
        <button class="btn secondary" type="button" id="goto-scoreboard">Scoreboard</button>
        <button class="btn secondary" type="button" id="add-psalm91">Psalm 91 starter</button>
        <button class="btn secondary" type="button" id="add-daily-bread">Daily Bread Prayer</button>
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
      (t) => `<option value="${t}" ${editing?.type === t ? "selected" : t === "custom" && !editing ? "selected" : ""}>${typeLabel(t)}</option>`
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
      ${passages.length === 0 ? `<p class="empty">No passages yet. Add a speech, monologue, or scripture text to begin.</p>` : `<ul class="passage-list">${passages.map(renderItem).join("")}</ul>`}
    </section>
  `;
    const form = root.querySelector("#passage-form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const saved = repo2.upsertPassage({
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
      renderLibrary(root, repo2, callbacks, null);
    });
    root.querySelector("#cancel-edit")?.addEventListener("click", () => {
      renderLibrary(root, repo2, callbacks, null);
    });
    root.querySelector("#goto-scoreboard")?.addEventListener("click", () => {
      callbacks.onScoreboard?.();
    });
    root.querySelector("#add-psalm91")?.addEventListener("click", () => {
      callbacks.onPsalm91Starter?.();
    });
    root.querySelector("#add-daily-bread")?.addEventListener("click", () => {
      callbacks.onDailyBreadStarter?.();
    });
    root.querySelector("#export-data")?.addEventListener("click", () => {
      downloadText("memorize-script-backup.json", exportDocument(repo2.load()));
    });
    root.querySelector("#import-data")?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const doc = importDocument(text);
        if (!confirm("Replace all local passages with this backup?")) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
        renderLibrary(root, repo2, callbacks, null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Import failed");
      }
    });
    root.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => callbacks.onOpenPassage(btn.dataset.open));
    });
    root.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = repo2.getPassage(btn.dataset.edit);
        if (p) renderLibrary(root, repo2, callbacks, p);
      });
    });
    root.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.delete;
        const p = repo2.getPassage(id);
        if (!p) return;
        if (!confirm(`Delete \u201C${p.title}\u201D?`)) return;
        repo2.deletePassage(id);
        renderLibrary(root, repo2, callbacks, null);
      });
    });
  }
  function renderItem(p) {
    const preview = p.text.trim().slice(0, 80) || "(no text yet)";
    const meta = [typeLabel(p.type), p.bibleReference].filter(Boolean).join(" \xB7 ");
    return `<li class="passage-item">
    <div>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(meta)}</p>
      <p>${escapeHtml(preview)}${p.text.trim().length > 80 ? "\u2026" : ""}</p>
    </div>
    <div class="row">
      <button class="btn" type="button" data-open="${p.id}">Open</button>
      <button class="btn secondary" type="button" data-edit="${p.id}">Edit</button>
      <button class="btn danger" type="button" data-delete="${p.id}">Delete</button>
    </div>
  </li>`;
  }
  function escapeHtml(s) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("`", "&#96;");
  }

  // src/lib/scoreboard.ts
  function toScoreboardRows(passages) {
    return passages.map((p) => ({
      id: p.id,
      title: p.title,
      bestHintCount: p.stats.bestHintCount,
      latestHintCount: p.stats.latestHintCount,
      attemptCount: p.stats.attemptCount,
      zeroHintCompletions: p.stats.zeroHintCompletions,
      memorizationPercent: p.stats.memorizationPercent,
      bestTimeMs: p.stats.bestTimeMs,
      lastPracticedAt: p.stats.lastPracticedAt
    }));
  }
  function sortScoreboard(rows, by = "lastPracticed") {
    const copy = rows.slice();
    if (by === "mastery") {
      return copy.sort((a, b) => b.memorizationPercent - a.memorizationPercent);
    }
    return copy.sort((a, b) => {
      const at = a.lastPracticedAt ?? "";
      const bt = b.lastPracticedAt ?? "";
      return bt.localeCompare(at);
    });
  }

  // src/ui/scoreboard.ts
  function renderScoreboard(root, repo2, opts) {
    let sortBy = "lastPracticed";
    const paint = () => {
      const rows = sortScoreboard(toScoreboardRows(repo2.listPassages()), sortBy);
      root.innerHTML = `
      <div class="app-shell">
        <header class="topbar">
          <div>
            <h1 class="brand">Memorize <span>Script</span></h1>
            <p class="tagline">Personal scoreboard \u2014 chase zero hints.</p>
          </div>
          <button class="btn secondary" type="button" id="back-lib">Library</button>
        </header>
        <section class="panel">
          <div class="row" style="justify-content:space-between;margin-bottom:1rem">
            <h2 style="margin:0">Scoreboard</h2>
            <label>Sort
              <select id="sort-by">
                <option value="lastPracticed" ${sortBy === "lastPracticed" ? "selected" : ""}>Last practiced</option>
                <option value="mastery" ${sortBy === "mastery" ? "selected" : ""}>Mastery %</option>
              </select>
            </label>
          </div>
          ${rows.length === 0 ? `<p class="empty">Practice a passage to populate your personal bests.</p>` : `<div class="table-wrap"><table class="score-table">
                  <thead><tr>
                    <th>Passage</th><th>Best hints</th><th>Latest</th><th>Attempts</th>
                    <th>Zero-hint</th><th>Mem %</th><th>Best time</th><th>Last practiced</th><th></th>
                  </tr></thead>
                  <tbody>
                    ${rows.map(
        (r) => `<tr>
                          <td>${esc(r.title)}</td>
                          <td>${r.bestHintCount ?? "\u2014"}</td>
                          <td>${r.latestHintCount ?? "\u2014"}</td>
                          <td>${r.attemptCount}</td>
                          <td>${r.zeroHintCompletions}</td>
                          <td>${r.memorizationPercent}%</td>
                          <td>${r.bestTimeMs == null ? "\u2014" : `${(r.bestTimeMs / 1e3).toFixed(1)}s`}</td>
                          <td>${r.lastPracticedAt ? esc(r.lastPracticedAt.slice(0, 10)) : "\u2014"}</td>
                          <td><button class="btn secondary" type="button" data-open="${r.id}">Open</button></td>
                        </tr>`
      ).join("")}
                  </tbody>
                </table></div>`}
        </section>
      </div>
    `;
      root.querySelector("#back-lib")?.addEventListener("click", opts.onBack);
      root.querySelector("#sort-by")?.addEventListener("change", (e) => {
        sortBy = e.target.value;
        paint();
      });
      root.querySelectorAll("[data-open]").forEach((btn) => {
        btn.addEventListener("click", () => opts.onOpen(btn.dataset.open));
      });
    };
    paint();
  }
  function esc(s) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  // src/lib/ordering.ts
  function toOrderItems(segments) {
    return segments.slice().sort((a, b) => a.index - b.index).map((s) => ({ id: s.id, text: s.text }));
  }
  function shuffleItems(items, rng = Math.random) {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.length > 1 && arr.every((v, i) => v === items[i])) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    return arr;
  }
  function gradeOrder(currentIds, correctIds) {
    const correctPositions = currentIds.map((id, i) => id === correctIds[i]);
    const allCorrect = correctPositions.every(Boolean) && currentIds.length === correctIds.length;
    const nextHintIndex = correctPositions.findIndex((ok) => !ok);
    return {
      correctPositions,
      allCorrect,
      nextHintIndex: nextHintIndex === -1 ? correctIds.length : nextHintIndex
    };
  }
  function moveItem(items, from, to) {
    if (from < 0 || from >= items.length || to < 0 || to >= items.length) return items.slice();
    const next = items.slice();
    const [picked] = next.splice(from, 1);
    next.splice(to, 0, picked);
    return next;
  }
  function applyHint(currentIds, correctIds) {
    const { nextHintIndex } = gradeOrder(currentIds, correctIds);
    if (nextHintIndex >= correctIds.length) {
      return { ids: currentIds.slice(), hintedIndex: -1 };
    }
    const needId = correctIds[nextHintIndex];
    const from = currentIds.indexOf(needId);
    if (from === -1) return { ids: currentIds.slice(), hintedIndex: -1 };
    return { ids: moveItem(currentIds, from, nextHintIndex), hintedIndex: nextHintIndex };
  }

  // src/lib/reduction.ts
  function firstWords(text) {
    return text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean).map((sentence) => {
      const word = sentence.split(/\s+/)[0] ?? "";
      return word;
    }).join(" \xB7 ");
  }
  function firstLetters(text) {
    return text.split(/\s+/).filter(Boolean).map((w) => {
      const ch = [...w].find((c) => /\p{L}/u.test(c));
      return ch ? ch.toUpperCase() : "";
    }).filter(Boolean).join(" ");
  }
  function localReduction(level, original, stored) {
    switch (level) {
      case "full":
        return original;
      case "none":
        return "";
      case "first_words":
        return firstWords(original);
      case "first_letters":
        return firstLetters(original);
      case "essential":
      case "keywords":
        return stored?.trim() || "";
      default:
        return original;
    }
  }
  function buildReductionPrompt(purpose, passageTitle, passageText) {
    const goal = purpose === "essential" ? "a simplified version containing only the essential memory words" : "key words only (memory anchors) while preserving original sequence and meaning";
    return [
      "You are helping me memorize a spoken passage.",
      `Passage title: ${passageTitle}`,
      "",
      "Reduce the passage into " + goal + ".",
      "Rules:",
      "- Preserve the original sequence and meaning.",
      "- Do not reorder ideas.",
      "- Do not add commentary before or after the reduced text.",
      "- Return plain text only.",
      "",
      "Passage:",
      passageText
    ].join("\n");
  }
  var REDUCTION_LEVELS = [
    { id: "full", label: "Full text", needsPaste: false },
    { id: "essential", label: "Essential words", needsPaste: true },
    { id: "keywords", label: "Keywords only", needsPaste: true },
    { id: "first_words", label: "First words", needsPaste: false },
    { id: "first_letters", label: "First letters", needsPaste: false },
    { id: "none", label: "No hints", needsPaste: false }
  ];

  // src/lib/segment.ts
  function segmentText(text) {
    const normalized = text.replace(/\r\n/g, "\n").trim();
    if (!normalized) return [];
    const rough = normalized.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    const pieces = [];
    for (const chunk of rough) {
      if (chunk.length > 80 && /[;:—]/.test(chunk)) {
        const parts = chunk.split(/\s*[;:—]\s*/).map((s) => s.trim()).filter(Boolean);
        pieces.push(...parts);
      } else {
        pieces.push(chunk);
      }
    }
    return pieces.map((t, index) => ({
      id: newId(),
      index,
      text: t
    }));
  }
  function ensureSegments(text, existing) {
    const next = segmentText(text);
    if (existing.length === next.length && existing.every((s, i) => s.text === next[i]?.text)) {
      return existing;
    }
    return next.map((seg, i) => {
      const prev = existing[i];
      if (prev && prev.text === seg.text) return { ...prev, index: i };
      return seg;
    });
  }

  // src/lib/stats.ts
  var STAGES = [
    "read",
    "understand",
    "reduce",
    "visualize",
    "reconstruct",
    "recall",
    "master"
  ];
  function computeMemorizationPercent(passage) {
    const segmentCount = Math.max(passage.segments.length, 1);
    const zeroHintBonus = passage.stats.zeroHintCompletions > 0 || passage.attempts.some((a) => a.zeroHint) ? 1 : 0;
    const best = passage.stats.bestHintCount;
    const hintFactor = best === null ? 0 : 1 - Math.min(best, segmentCount) / segmentCount;
    const completedStages = STAGES.filter((s) => passage.stageProgress[s]?.completed).length;
    const stageFactor = completedStages / 7;
    return Math.round(
      Math.max(0, Math.min(100, zeroHintBonus * 40 + hintFactor * 40 + stageFactor * 20))
    );
  }
  function recordAttempt(passage, input) {
    const completedAt = (/* @__PURE__ */ new Date()).toISOString();
    const zeroHint = input.success && input.hintsUsed === 0;
    const attempt = {
      id: newId(),
      stage: input.stage,
      hintsUsed: input.hintsUsed,
      durationMs: input.durationMs,
      zeroHint,
      completedAt,
      success: input.success
    };
    const stats = { ...passage.stats ?? emptyStats() };
    stats.attemptCount += 1;
    stats.latestHintCount = input.hintsUsed;
    stats.lastPracticedAt = completedAt;
    if (input.success) {
      if (stats.bestHintCount === null || input.hintsUsed < stats.bestHintCount) {
        stats.bestHintCount = input.hintsUsed;
      }
      if (stats.bestTimeMs === null || input.durationMs < stats.bestTimeMs) {
        stats.bestTimeMs = input.durationMs;
      }
      if (zeroHint) stats.zeroHintCompletions += 1;
    }
    const updated = {
      ...passage,
      attempts: [...passage.attempts, attempt],
      stats,
      updatedAt: completedAt
    };
    updated.stats.memorizationPercent = computeMemorizationPercent(updated);
    return updated;
  }

  // src/lib/visualPrompt.ts
  function inferConcept(segmentText2) {
    const cleaned = segmentText2.replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    return words.slice(0, 6).join(" ") || "memorable scene";
  }
  function buildImagePrompt(segment, concept) {
    const idea = (concept ?? inferConcept(segment.text)).trim();
    return [
      "Create a vivid, memorable illustration for memorizing a spoken passage.",
      `Visual concept: ${idea}`,
      `Passage segment: "${segment.text}"`,
      "Style: clear symbolic scene, strong focal subject, no text overlay, suitable as a mental memory palace image."
    ].join("\n");
  }

  // src/ui/sharePanel.ts
  function mountShareControls(host, passage) {
    const canIncludeText = passage.type !== "bible";
    host.innerHTML = `
    <div class="row" style="margin-top:0.75rem">
      ${canIncludeText ? `<label class="inline"><input type="checkbox" id="include-text" /> Include text in link</label>` : `<span class="empty">Bible shares send reference only (no translation body).</span>`}
      <button class="btn secondary" type="button" id="copy-share">Copy share link</button>
      <button class="btn secondary" type="button" id="native-share">Share\u2026</button>
      <span class="toast" id="share-toast" hidden></span>
    </div>
  `;
    const toast = (msg) => {
      const el = host.querySelector("#share-toast");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
    };
    const makeUrl = () => {
      const includeText = host.querySelector("#include-text")?.checked === true;
      const payload = buildSharePayload(passage, { includeText });
      return shareUrlFromPayload(payload);
    };
    host.querySelector("#copy-share")?.addEventListener("click", async () => {
      await navigator.clipboard.writeText(makeUrl());
      toast("Share link copied.");
    });
    host.querySelector("#native-share")?.addEventListener("click", async () => {
      const url = makeUrl();
      if (navigator.share) {
        await navigator.share({ title: passage.title, url, text: `Practice: ${passage.title}` });
        toast("Share sheet opened.");
      } else {
        await navigator.clipboard.writeText(url);
        toast("Web Share unavailable \u2014 link copied instead.");
      }
    });
  }

  // src/ui/training.ts
  var STAGES2 = [
    { id: "read", label: "Read", ready: true },
    { id: "understand", label: "Understand", ready: true },
    { id: "reduce", label: "Reduce", ready: true },
    { id: "visualize", label: "Visualize", ready: true },
    { id: "reconstruct", label: "Reconstruct", ready: true },
    { id: "recall", label: "Recall", ready: true },
    { id: "master", label: "Master", ready: true }
  ];
  function renderTraining(root, repo2, passageId, callbacks, stage = "read") {
    let passage = repo2.getPassage(passageId);
    if (!passage) {
      callbacks.onBack();
      return;
    }
    passage = syncSegments(repo2, passage);
    root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1 class="brand">Memorize <span>Script</span></h1>
          <p class="tagline">${esc2(passage.title)}${passage.bibleReference ? ` \xB7 ${esc2(passage.bibleReference)}` : ""}</p>
        </div>
        <button class="btn secondary" type="button" id="back-lib">Library</button>
      </header>
      <div id="share-host"></div>
      <nav class="stage-nav panel" aria-label="Training stages">
        ${STAGES2.map(
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
        renderTraining(root, repo2, passageId, callbacks, next);
      });
    });
    const panel = root.querySelector("#stage-panel");
    if (!panel) return;
    if (stage === "read")
      renderRead(panel, repo2, passage, () => {
        history.replaceState(null, "", `#passage/${passageId}/understand`);
        renderTraining(root, repo2, passageId, callbacks, "understand");
      });
    else if (stage === "understand") renderUnderstand(panel, repo2, passage);
    else if (stage === "reduce") renderReduce(panel, repo2, passage);
    else if (stage === "visualize") renderVisualize(panel, repo2, passage);
    else if (stage === "reconstruct") renderReconstruct(panel, repo2, passage);
    else if (stage === "recall") renderRecall(panel, repo2, passage);
    else if (stage === "master") renderMaster(panel, repo2, passage);
    else {
      panel.innerHTML = `<h2>${stage}</h2><p class="empty">Unknown stage.</p>`;
    }
  }
  function syncSegments(repo2, passage) {
    const segments = ensureSegments(passage.text, passage.segments);
    if (segments === passage.segments) return passage;
    const doc = repo2.load();
    const updated = {
      ...passage,
      segments,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
    repo2.save(doc);
    return updated;
  }
  function markStage(repo2, passage, stage) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      ...passage,
      stageProgress: {
        ...passage.stageProgress,
        [stage]: { completed: true, updatedAt: now }
      },
      updatedAt: now
    };
    const doc = repo2.load();
    doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
    repo2.save(doc);
    return updated;
  }
  function renderRead(panel, repo2, passage, onContinue) {
    panel.innerHTML = `
    <h2>Read</h2>
    <p class="empty">Read the full passage with segment markers. Absorb cadence before reducing.</p>
    <ol class="segment-list">
      ${passage.segments.map((s) => `<li><span class="seg-idx">${s.index + 1}</span> ${esc2(s.text)}</li>`).join("")}
    </ol>
    <div class="row">
      <button class="btn" type="button" id="mark-read">Mark Read complete \u2192 Understand</button>
    </div>
  `;
    panel.querySelector("#mark-read")?.addEventListener("click", () => {
      markStage(repo2, passage, "read");
      onContinue();
    });
  }
  function renderUnderstand(panel, repo2, passage) {
    panel.innerHTML = `
    <h2>Understand</h2>
    <p class="empty">Capture meaning per segment. Notes stay on this device.</p>
    <div class="grid" id="notes">
      ${passage.segments.map(
      (s) => `<label>Segment ${s.index + 1}: ${esc2(s.text)}
            <textarea data-note="${s.id}" placeholder="Meaning, emotion, or cue">${esc2(passage.segmentNotes[s.id] ?? "")}</textarea>
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
      const doc = repo2.load();
      doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
      repo2.save(doc);
      const toast = panel.querySelector("#notes-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Notes saved.";
      }
    });
  }
  function savePassage(repo2, passage) {
    const doc = repo2.load();
    doc.passages = doc.passages.map((p) => p.id === passage.id ? passage : p);
    repo2.save(doc);
  }
  function renderReconstruct(panel, repo2, passage) {
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
              <span>${esc2(item.text)}</span>
            </li>`;
      }).join("")}
      </ul>
      <div class="row">
        <button class="btn" type="button" id="check-order">Check order</button>
        <button class="btn secondary" type="button" id="hint-btn">Hint (next phrase)</button>
        <button class="btn secondary" type="button" id="reshuffle">Reshuffle</button>
        <button class="btn secondary" type="button" id="reset-order">Reset attempt</button>
      </div>
      <p class="toast" id="order-toast">${esc2(message)}</p>
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
          savePassage(repo2, updated);
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
  function renderRecall(panel, repo2, passage) {
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
      <pre class="cue-pre">${esc2(cue || "(no hints)")}</pre>
      <label>Your recall
        <textarea id="recall-text" placeholder="Type what you remember\u2026"></textarea>
      </label>
      ${reveal ? `<pre class="cue-pre original">${esc2(passage.text)}</pre>` : ""}
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
        savePassage(repo2, updated);
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
  function renderMaster(panel, repo2, passage) {
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
      savePassage(repo2, updated);
      Object.assign(passage, updated);
      const toast = panel.querySelector("#master-toast");
      if (toast) toast.textContent = "Mastered. Keep drilling to stay sharp.";
    });
  }
  function renderVisualize(panel, repo2, passage) {
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
              <p>${esc2(seg.text)}</p>
              <label>Visual concept
                <input data-concept="${seg.id}" value="${esc2(concept)}" />
              </label>
              <label>Image prompt
                <textarea data-prompt="${seg.id}" readonly>${esc2(prompt)}</textarea>
              </label>
              <label>Your note / image URL (optional)
                <input data-note="${seg.id}" value="${esc2(anchor?.userNote || anchor?.imageUrl || "")}" />
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
          savePassage(repo2, updated);
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
  function renderReduce(panel, repo2, passage) {
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
        <pre class="cue-pre">${esc2(cue || "(no hints \u2014 recall from memory)")}</pre>
        ${reveal ? `<pre class="cue-pre original">${esc2(passage.text)}</pre>` : ""}
      </div>
      <div class="row" style="margin-top:1rem">
        <button class="btn secondary" type="button" id="toggle-reveal">${reveal ? "Hide original" : "Reveal original"}</button>
        <button class="btn" type="button" id="mark-reduce">Mark Reduce practiced</button>
      </div>
      ${meta.needsPaste ? `<div class="grid" style="margin-top:1.25rem">
              <label>ChatGPT prompt
                <textarea id="ai-prompt" readonly>${esc2(buildReductionPrompt(level === "keywords" ? "keywords" : "essential", passage.title, passage.text))}</textarea>
              </label>
              <div class="row">
                <button class="btn secondary" type="button" id="copy-prompt">Copy prompt</button>
              </div>
              <label>Paste ChatGPT reduction
                <textarea id="paste-reduction">${esc2(passage.reductions[level] ?? "")}</textarea>
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
        markStage(repo2, passage, "reduce");
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
        const doc = repo2.load();
        doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
        repo2.save(doc);
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
  function esc2(s) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  // src/main.ts
  var app = document.querySelector("#app");
  if (!app) throw new Error("#app missing");
  var repo = new PassageRepository();
  var STAGES3 = /* @__PURE__ */ new Set([
    "read",
    "understand",
    "reduce",
    "visualize",
    "reconstruct",
    "recall",
    "master"
  ]);
  function showLibrary(prefill) {
    history.replaceState(null, "", "#");
    renderLibrary(app, repo, {
      onOpenPassage: (id) => {
        history.replaceState(null, "", `#passage/${id}/read`);
        mount();
      },
      onScoreboard: () => {
        history.replaceState(null, "", "#scoreboard");
        mount();
      },
      onPsalm91Starter: () => {
        const created = repo.upsertPassage({ ...PSALM_91_STARTER });
        history.replaceState(null, "", `#passage/${created.id}/read`);
        mount();
      },
      onDailyBreadStarter: () => {
        const created = repo.upsertPassage({ ...DAILY_BREAD_PRAYER_STARTER });
        history.replaceState(null, "", `#passage/${created.id}/read`);
        mount();
      }
    });
    wrapShell();
    if (prefill) {
      const form = app.querySelector("#passage-form");
      if (!form) return;
      const set = (name, value) => {
        const el = form.elements.namedItem(name);
        if (el && value != null) el.value = value;
      };
      set("title", prefill.title);
      set("type", prefill.type);
      set("bibleReference", prefill.bibleReference);
      set("versionHint", prefill.versionHint);
      set("text", prefill.text);
    }
  }
  function wrapShell() {
    if (app.querySelector(".app-shell")) return;
    const shell = document.createElement("div");
    shell.className = "app-shell";
    while (app.firstChild) shell.appendChild(app.firstChild);
    app.appendChild(shell);
  }
  function mount() {
    const hash = location.hash.replace(/^#/, "");
    const parts = hash.split("/").filter(Boolean);
    if (parts[0] === "share" && parts[1]) {
      const payload = decodeSharePayload(parts[1]);
      if (payload) {
        showLibrary({
          title: payload.title,
          type: payload.type,
          bibleReference: payload.bibleReference,
          versionHint: payload.versionHint,
          text: payload.text
        });
        return;
      }
    }
    if (parts[0] === "scoreboard") {
      renderScoreboard(app, repo, {
        onBack: () => showLibrary(),
        onOpen: (id) => {
          history.replaceState(null, "", `#passage/${id}/reconstruct`);
          mount();
        }
      });
      return;
    }
    if (parts[0] === "passage" && parts[1] && repo.getPassage(parts[1])) {
      const stage = STAGES3.has(parts[2]) ? parts[2] : "read";
      renderTraining(app, repo, parts[1], { onBack: showLibrary }, stage);
      return;
    }
    showLibrary();
  }
  mount();
  window.addEventListener("hashchange", mount);
})();
