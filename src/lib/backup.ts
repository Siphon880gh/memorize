import { migrateDocument, type StorageLike } from "../storage/repository";
import type { RootDocument } from "../types";

export function exportDocument(doc: RootDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function importDocument(raw: string): RootDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Import failed: invalid JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Import failed: expected an object");
  }
  const version = (parsed as { schemaVersion?: number }).schemaVersion;
  if (version == null) {
    throw new Error("Import failed: missing schemaVersion");
  }
  return migrateDocument(parsed);
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function replaceStorage(storage: StorageLike, doc: RootDocument, key: string): void {
  storage.setItem(key, JSON.stringify(doc));
}
