import {
  buildSharePayload,
  shareUrlFromPayload
} from "../lib/share.js";
function mountShareControls(host, passage) {
  const canIncludeText = passage.type !== "bible";
  host.innerHTML = `
    <div class="row" style="margin-top:0.75rem">
      ${canIncludeText ? `<label class="inline"><input type="checkbox" id="include-text" /> Include text in link</label>` : `<span class="empty">Bible shares send reference only (no translation body).</span>`}
      <button class="btn secondary" type="button" id="copy-share">Copy share link</button>
      <button class="btn secondary" type="button" id="native-share">Share\u2026</button>
      <span class="toast" id="share-toast" hidden></span>
    </div>
  `;
  const toast = (msg) => {
    const el = host.querySelector("#share-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
  };
  const makeUrl = () => {
    const includeText = host.querySelector("#include-text")?.checked === true;
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
      toast("Web Share unavailable \u2014 link copied instead.");
    }
  });
}
export {
  mountShareControls
};
