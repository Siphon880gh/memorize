(() => {
  "use strict";

  const LS_WALKTHROUGH = "memorize-script.walkthroughDone.v1";
  const TOTAL = 7;
  let step = 0;
  let root = null;
  let repositionTimer = null;

  const STEPS = [
    {
      selector: "#passage-form",
      text: "Add a passage you want to memorize — speeches, scriptures, or custom text. Everything stays in this browser.",
      prepare: goLibrary,
    },
    {
      selector: "#library-panel, #tab-our",
      text: "Our Library has ready-to-copy passages. My Library holds the ones you add or copy.",
      prepare: goLibrary,
    },
    {
      selector: "[data-open], [data-open-starter], .passage-list",
      text: "Open a passage to train, or copy one from Our Library into My Library.",
      prepare: goLibrary,
    },
    {
      selector: ".stage-nav",
      text: "Train step by step: Read → Understand → Reduce → Visualize → Reconstruct → Recall → Master.",
      prepare: ensureTraining,
    },
    {
      selector: '[data-stage="reduce"], .stage-nav',
      text: "Reduce builds memory cues. Copy the ChatGPT prompt, paste the result back — no API key in the app.",
      prepare: goStage("reduce"),
    },
    {
      selector: '[data-stage="reconstruct"], #hint-btn, .order-list',
      text: "Reconstruct shuffles phrases. Use hints if needed — the goal is to bring the hint count down to 0.",
      prepare: goStage("reconstruct"),
    },
    {
      selector: "#goto-scoreboard, #export-data",
      text: "Scoreboard tracks personal bests. Export backs up your local progress. Tap Tour anytime to replay this guide.",
      prepare: goLibrary,
    },
  ];

  function walkthroughDone() {
    try {
      return localStorage.getItem(LS_WALKTHROUGH) === "1";
    } catch (e) {
      return true;
    }
  }

  function markDone() {
    try {
      localStorage.setItem(LS_WALKTHROUGH, "1");
    } catch (e) {
      /* ignore */
    }
  }

  function goLibrary() {
    if ((location.hash || "") !== "" && location.hash !== "#") {
      history.replaceState(null, "", "#");
      window.dispatchEvent(new Event("hashchange"));
    }
  }

  function fireHash() {
    window.dispatchEvent(new Event("hashchange"));
  }

  function ensureTraining() {
    const already = location.hash.match(/^#passage\/([^/]+)/);
    if (already) return;

    goLibrary();
    let openBtn = document.querySelector("[data-open], [data-open-starter]");
    if (!openBtn) {
      const starter = document.querySelector("[data-copy-starter], #tab-our");
      if (starter) {
        starter.click();
        return;
      }
    }
    openBtn = document.querySelector("[data-open], [data-open-starter]");
    if (openBtn) openBtn.click();
  }

  function goStage(stage) {
    return function () {
      ensureTraining();
      const m = location.hash.match(/^#passage\/([^/]+)/);
      if (m && m[1]) {
        history.replaceState(null, "", `#passage/${m[1]}/${stage}`);
        fireHash();
        return;
      }
      const pill = document.querySelector(`[data-stage="${stage}"]`);
      if (pill && !pill.disabled) pill.click();
    };
  }

  function ensureEl() {
    if (root) return root;
    root = document.createElement("div");
    root.id = "walkthrough";
    root.className = "walkthrough hidden";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-live", "polite");
    root.hidden = true;
    root.innerHTML =
      '<div class="walkthrough-card">' +
      '<div class="walkthrough-step" id="walkthrough-step"></div>' +
      '<p class="walkthrough-text" id="walkthrough-text"></p>' +
      '<div class="walkthrough-actions">' +
      '<button type="button" class="walkthrough-skip" id="walkthrough-skip">Skip</button>' +
      '<button type="button" class="walkthrough-next" id="walkthrough-next">Next</button>' +
      "</div></div>" +
      '<div class="walkthrough-arrow" aria-hidden="true"></div>';
    document.body.appendChild(root);
    root.querySelector("#walkthrough-skip").addEventListener("click", finish);
    root.querySelector("#walkthrough-next").addEventListener("click", advance);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return root;
  }

  function onReposition() {
    if (!step || !root || root.classList.contains("hidden")) return;
    clearTimeout(repositionTimer);
    repositionTimer = setTimeout(() => {
      position(document.querySelector(".walkthrough-target"));
    }, 40);
  }

  function clearTarget() {
    document.querySelectorAll(".walkthrough-target").forEach((el) => {
      el.classList.remove("walkthrough-target");
    });
  }

  function hide() {
    if (!root) return;
    root.classList.add("hidden");
    root.hidden = true;
    clearTarget();
  }

  function finish() {
    step = 0;
    hide();
    markDone();
  }

  function findTarget(selector) {
    const parts = selector.split(",").map((s) => s.trim());
    for (const part of parts) {
      const el = document.querySelector(part);
      if (el) return el;
    }
    return null;
  }

  function waitFor(findFn, done, triesMax) {
    let tries = 0;
    const max = triesMax || 50;
    const wait = setInterval(() => {
      tries += 1;
      const el = findFn();
      if (el || tries > max) {
        clearInterval(wait);
        done(el);
      }
    }, 100);
  }

  function scrollToTarget(target) {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const tipH = root ? root.offsetHeight || 140 : 140;
    const gap = 40;
    const desiredTop = 24;
    const blockH = rect.height + gap + tipH;
    let absTop;
    if (blockH + 16 < window.innerHeight) {
      absTop = window.pageYOffset + rect.top - desiredTop;
    } else {
      absTop = window.pageYOffset + rect.top - (window.innerHeight - rect.height) / 2;
    }
    if (absTop < 0) absTop = 0;
    window.scrollTo({ top: absTop, behavior: "smooth" });
  }

  function position(target) {
    if (!root || !target) return;
    const tip = root;
    const arrow = root.querySelector(".walkthrough-arrow");
    tip.style.left = "0px";
    tip.style.top = "0px";
    tip.classList.remove("walkthrough-below", "walkthrough-above");

    const rect = target.getBoundingClientRect();
    const tipW = tip.offsetWidth || 280;
    const tipH = tip.offsetHeight || 120;
    const gap = 40;
    const pad = 12;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    let placeBelow = spaceBelow >= tipH || spaceBelow >= spaceAbove;

    let top = placeBelow ? rect.bottom + gap : rect.top - tipH - gap;
    let left = rect.left + rect.width / 2 - tipW / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - tipW - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - tipH - pad));

    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tip.classList.toggle("walkthrough-below", placeBelow);
    tip.classList.toggle("walkthrough-above", !placeBelow);

    if (arrow) {
      let arrowLeft = rect.left + rect.width / 2 - left;
      arrowLeft = Math.max(18, Math.min(arrowLeft, tipW - 18));
      arrow.style.left = arrowLeft + "px";
    }
  }

  function showStep(n) {
    const def = STEPS[n - 1];
    if (!def) {
      finish();
      return;
    }
    ensureEl();
    if (typeof def.prepare === "function") def.prepare();

    waitFor(
      () => findTarget(def.selector),
      (target) => {
        if (!target) {
          if (n < TOTAL) {
            showStep(n + 1);
          } else {
            finish();
          }
          return;
        }
        step = n;
        clearTarget();
        target.classList.add("walkthrough-target");
        root.querySelector("#walkthrough-step").textContent = "Step " + n + " of " + TOTAL;
        root.querySelector("#walkthrough-text").textContent = def.text;
        const nextBtn = root.querySelector("#walkthrough-next");
        if (def.hideNext) {
          nextBtn.classList.add("hidden");
          nextBtn.hidden = true;
        } else {
          nextBtn.classList.remove("hidden");
          nextBtn.hidden = false;
          nextBtn.textContent = n >= TOTAL ? "Done" : "Next";
        }
        root.classList.remove("hidden");
        root.hidden = false;
        scrollToTarget(target);
        position(target);
        requestAnimationFrame(() => position(target));
        setTimeout(() => position(target), 320);
        setTimeout(() => position(target), 560);
      },
    );
  }

  function advance() {
    if (step < 1) return;
    if (step >= TOTAL) {
      finish();
      return;
    }
    hide();
    showStep(step + 1);
  }

  function start() {
    ensureEl();
    goLibrary();
    setTimeout(() => showStep(1), 120);
  }

  function bindCredits() {
    const btn = document.getElementById("credits-toggle");
    const panel = document.getElementById("credits-panel");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      if (open) panel.setAttribute("hidden", "");
      else panel.removeAttribute("hidden");
    });
  }

  function boot() {
    bindCredits();
    const tourBtn = document.getElementById("tour-btn");
    if (tourBtn) {
      tourBtn.addEventListener("click", (e) => {
        e.preventDefault();
        step = 0;
        hide();
        start();
      });
    }
    // First visit: auto-start once the library paints
    if (!walkthroughDone()) {
      waitFor(
        () => document.querySelector("#passage-form"),
        (el) => {
          if (el) start();
        },
        80,
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
