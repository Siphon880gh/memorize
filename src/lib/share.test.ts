import { describe, expect, it } from "vitest";
import {
  buildSharePayload,
  decodeSharePayload,
  encodeSharePayload,
} from "./share";

describe("share", () => {
  it("omits bible body text by default even when includeText requested", () => {
    const payload = buildSharePayload(
      {
        type: "bible",
        title: "Psalm 91",
        bibleReference: "Psalm 91",
        versionHint: "NIV",
        text: "COPYRIGHTED BODY SHOULD NOT APPEAR",
      },
      { includeText: true },
    );
    expect(payload.text).toBeUndefined();
    expect(payload.bibleReference).toBe("Psalm 91");
  });

  it("can embed custom script text when opted in", () => {
    const payload = buildSharePayload(
      { type: "speech", title: "Mine", text: "Hello world" },
      { includeText: true },
    );
    expect(payload.text).toBe("Hello world");
    const round = decodeSharePayload(encodeSharePayload(payload));
    expect(round?.text).toBe("Hello world");
  });
});
