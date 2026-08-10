import type { Segment } from "../types";

export function inferConcept(segmentText: string): string {
  const cleaned = segmentText.replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 6).join(" ") || "memorable scene";
}

export function buildImagePrompt(segment: Segment, concept?: string): string {
  const idea = (concept ?? inferConcept(segment.text)).trim();
  return [
    "Create a vivid, memorable illustration for memorizing a spoken passage.",
    `Visual concept: ${idea}`,
    `Passage segment: "${segment.text}"`,
    "Style: clear symbolic scene, strong focal subject, no text overlay, suitable as a mental memory palace image.",
  ].join("\n");
}
