import type { Passage, PassageType } from "../types";

export type SharePayload = {
  v: 1;
  type: PassageType;
  title: string;
  bibleReference?: string;
  versionHint?: string;
  text?: string;
};

export function buildSharePayload(
  passage: Pick<Passage, "type" | "title" | "bibleReference" | "versionHint" | "text">,
  opts: { includeText?: boolean } = {},
): SharePayload {
  const payload: SharePayload = {
    v: 1,
    type: passage.type,
    title: passage.title,
  };
  if (passage.bibleReference) payload.bibleReference = passage.bibleReference;
  if (passage.versionHint) payload.versionHint = passage.versionHint;

  const includeText =
    opts.includeText === true &&
    passage.type !== "bible" &&
    Boolean(passage.text?.trim());

  // Bible / reference shares omit body by default (and even if includeText requested for bible).
  if (passage.type === "bible") {
    return payload;
  }
  if (includeText) payload.text = passage.text;
  return payload;
}

export function encodeSharePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeSharePayload(encoded: string): SharePayload | null {
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const json = decodeURIComponent(escape(atob(padded + pad)));
    const data = JSON.parse(json) as SharePayload;
    if (data?.v !== 1 || !data.title || !data.type) return null;
    return data;
  } catch {
    return null;
  }
}

export function shareUrlFromPayload(payload: SharePayload, origin = location.origin, path = location.pathname): string {
  return `${origin}${path}#share/${encodeSharePayload(payload)}`;
}
