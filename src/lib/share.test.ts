import { describe, expect, it } from "vitest";
import {
  buildSharePayload,
  decodeSharePayload,
  encodeSharePayload,
  encodedShareFromHash,
  passageInputFromShare,
  shareUrlFromPayload,
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

  it("reads share payload from hash and builds openable passage input", () => {
    const payload = buildSharePayload(
      { type: "speech", title: "Mine", text: "Hello world" },
      { includeText: true },
    );
    const encoded = encodeSharePayload(payload);
    expect(encodedShareFromHash(`#share/${encoded}`)).toBe(encoded);
    expect(encodedShareFromHash("#scoreboard")).toBeNull();
    expect(passageInputFromShare(payload)).toEqual({
      type: "speech",
      title: "Mine",
      text: "Hello world",
      bibleReference: undefined,
      versionHint: undefined,
    });
    expect(
      shareUrlFromPayload(payload, "http://localhost:8888", "/weng/app/sp/memorize/public/index.php"),
    ).toBe(`http://localhost:8888/weng/app/sp/memorize/public/#share/${encoded}`);
  });
});
