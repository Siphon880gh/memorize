import { migrateDocument } from "../storage/repository.js";
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
function replaceStorage(storage, doc, key) {
  storage.setItem(key, JSON.stringify(doc));
}
export {
  downloadText,
  exportDocument,
  importDocument,
  replaceStorage
};
