import { describe, expect, it } from "vitest";
import { gradeRecall, normalizeRecall } from "./recallGrade";

describe("gradeRecall", () => {
  const sample =
    "Our Father which art in heaven, Hallowed be thy name. Thy kingdom come.";

  it("normalizes case and punctuation", () => {
    expect(normalizeRecall("Hello, World!")).toBe("hello world");
  });

  it("accepts close matches", () => {
    const g = gradeRecall(sample, sample.toUpperCase());
    expect(g.ok).toBe(true);
  });

  it("rejects empty and garbage", () => {
    expect(gradeRecall(sample, "").empty).toBe(true);
    expect(gradeRecall(sample, "").ok).toBe(false);
    expect(gradeRecall(sample, "asdf totally wrong").ok).toBe(false);
  });

  it("rejects partial one-word answers", () => {
    expect(gradeRecall(sample, "Father").ok).toBe(false);
  });
});
