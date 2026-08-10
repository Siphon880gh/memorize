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
export {
  buildSharePayload,
  decodeSharePayload,
  encodeSharePayload,
  shareUrlFromPayload
};
