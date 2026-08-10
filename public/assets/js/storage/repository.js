import {
  SCHEMA_VERSION,
  STORAGE_KEY,
  emptyStats,
  newId
} from "../types.js";
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
    reduceProficiency: typeof p.reduceProficiency === "string" ? p.reduceProficiency : undefined,
    visualAnchors: Array.isArray(p.visualAnchors) ? p.visualAnchors : [],
    stageProgress: p.stageProgress && typeof p.stageProgress === "object" ? p.stageProgress : {},
    attempts: Array.isArray(p.attempts) ? p.attempts : [],
    stats: { ...emptyStats(), ...p.stats ?? {} },
    masteredAt: p.masteredAt ?? null
  };
}
class PassageRepository {
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
}
function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => map.has(k) ? map.get(k) : null,
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    }
  };
}
export {
  PassageRepository,
  emptyDocument,
  memoryStorage,
  migrateDocument
};
