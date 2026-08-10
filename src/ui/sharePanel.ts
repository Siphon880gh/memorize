import {
  buildSharePayload,
  shareUrlFromPayload,
} from "../lib/share";
import type { Passage } from "../types";

export function mountShareControls(host: HTMLElement, passage: Passage): void {
  const canIncludeText = passage.type !== "bible";
  host.innerHTML = `
    <div class="row" style="margin-top:0.75rem">
      ${
        canIncludeText
          ? `<label class="inline"><input type="checkbox" id="include-text" checked /> Include text in link</label>`
          : `<span class="empty">Bible shares send reference only (no translation body). Recipients open a library item they can paste into.</span>`
      }
      <button class="btn secondary" type="button" id="copy-share">Copy share link</button>
      <button class="btn secondary" type="button" id="native-share">Share…</button>
      <span class="toast" id="share-toast" hidden></span>
    </div>
  `;

  const toast = (msg: string) => {
    const el = host.querySelector<HTMLElement>("#share-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
  };

  const makeUrl = () => {
    const includeText = host.querySelector<HTMLInputElement>("#include-text")?.checked === true;
    const payload = buildSharePayload(passage, { includeText });
    return shareUrlFromPayload(payload);
  };

  host.querySelector("#copy-share")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(makeUrl());
    toast("Share link copied.");
  });

  host.querySelector("#native-share")?.addEventListener("click", async () => {
    const url = makeUrl();
    if (navigator.share) {
      await navigator.share({ title: passage.title, url, text: `Practice: ${passage.title}` });
      toast("Share sheet opened.");
    } else {
      await navigator.clipboard.writeText(url);
      toast("Web Share unavailable — link copied instead.");
    }
  });
}
