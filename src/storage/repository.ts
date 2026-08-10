import {
  SCHEMA_VERSION,
  STORAGE_KEY,
  emptyStats,
  newId,
  type Passage,
  type PassageType,
  type RootDocument,
  type Settings,
} from "../types";

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function defaultSettings(): Settings {
  return { aiMode: "copy_paste", theme: "system" };
}

export function emptyDocument(): RootDocument {
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: defaultSettings(),
    passages: [],
  };
}

export function migrateDocument(raw: unknown): RootDocument {
  if (!raw || typeof raw !== "object") return emptyDocument();
  const doc = raw as Partial<RootDocument>;
  const version = doc.schemaVersion ?? 0;
  if (version > SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion ${version}`);
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: {
      ...defaultSettings(),
      ...(doc.settings ?? {}),
      aiMode: "copy_paste",
    },
    passages: Array.isArray(doc.passages)
      ? doc.passages.map(normalizePassage)
      : [],
  };
}

function normalizePassage(p: Partial<Passage>): Passage {
  const now = new Date().toISOString();
  return {
    id: p.id || newId(),
    type: (p.type as PassageType) || "custom",
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
    stageProgress:
      p.stageProgress && typeof p.stageProgress === "object" ? p.stageProgress : {},
    attempts: Array.isArray(p.attempts) ? p.attempts : [],
    stats: { ...emptyStats(), ...(p.stats ?? {}) },
    masteredAt: p.masteredAt ?? null,
  };
}

export class PassageRepository {
  private storage: StorageLike;

  constructor(storage: StorageLike = localStorage) {
    this.storage = storage;
  }

  load(): RootDocument {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) return emptyDocument();
    try {
      return migrateDocument(JSON.parse(raw));
    } catch {
      return emptyDocument();
    }
  }

  save(doc: RootDocument): void {
    const payload: RootDocument = {
      ...doc,
      schemaVersion: SCHEMA_VERSION,
    };
    this.storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  listPassages(): Passage[] {
    return this.load().passages.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getPassage(id: string): Passage | undefined {
    return this.load().passages.find((p) => p.id === id);
  }

  upsertPassage(input: {
    id?: string;
    type: PassageType;
    title: string;
    text: string;
    bibleReference?: string;
    versionHint?: string;
    bibleGatewayUrl?: string;
  }): Passage {
    const doc = this.load();
    const now = new Date().toISOString();
    const existing = input.id ? doc.passages.find((p) => p.id === input.id) : undefined;
    const passage: Passage = normalizePassage({
      ...(existing ?? {}),
      id: existing?.id ?? newId(),
      type: input.type,
      title: input.title.trim() || "Untitled",
      text: input.text,
      bibleReference: input.bibleReference?.trim() || undefined,
      versionHint: input.versionHint?.trim() || undefined,
      bibleGatewayUrl: input.bibleGatewayUrl?.trim() || undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    if (existing) {
      doc.passages = doc.passages.map((p) => (p.id === passage.id ? passage : p));
    } else {
      doc.passages.push(passage);
    }
    this.save(doc);
    return passage;
  }

  deletePassage(id: string): boolean {
    const doc = this.load();
    const before = doc.passages.length;
    doc.passages = doc.passages.filter((p) => p.id !== id);
    if (doc.passages.length === before) return false;
    this.save(doc);
    return true;
  }

  replaceDocument(doc: RootDocument): void {
    this.save(migrateDocument(doc));
  }
}

export function memoryStorage(seed: Record<string, string> = {}): StorageLike {
  const map = new Map<string, string>(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}
