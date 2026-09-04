function inferConcept(segmentText) {
  const cleaned = segmentText.replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
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
function visualAnchorImageUrl(anchor) {
  const fromImage = (anchor?.imageUrl || "").trim();
  if (fromImage) return fromImage;
  const noteOrUrl = (anchor?.userNote || "").trim();
  return /^https?:\/\//i.test(noteOrUrl) ? noteOrUrl : "";
}
function photographicMemoryItems(passage) {
  return (passage.segments || []).slice().sort((a, b) => a.index - b.index).map((seg) => ({
    id: seg.id,
    segmentIndex: seg.index,
    text: seg.text,
    url: visualAnchorImageUrl((passage.visualAnchors || []).find((a) => a.segmentId === seg.id))
  }));
}
export {
  buildImagePrompt,
  inferConcept,
  photographicMemoryItems,
  visualAnchorImageUrl
};
