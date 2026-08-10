import "./styles.css";
import { PSALM_91_STARTER } from "./data/samplePsalm91";
import { decodeSharePayload } from "./lib/share";
import { PassageRepository } from "./storage/repository";
import { renderLibrary } from "./ui/library";
import { renderScoreboard } from "./ui/scoreboard";
import { renderTraining } from "./ui/training";
import type { TrainingStage } from "./types";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

const repo = new PassageRepository();

const STAGES = new Set<TrainingStage>([
  "read",
  "understand",
  "reduce",
  "visualize",
  "reconstruct",
  "recall",
  "master",
]);

function showLibrary(prefill?: {
  title?: string;
  type?: string;
  bibleReference?: string;
  versionHint?: string;
  text?: string;
}): void {
  history.replaceState(null, "", "#");
  renderLibrary(app!, repo, {
    onOpenPassage: (id) => {
      history.replaceState(null, "", `#passage/${id}/read`);
      mount();
    },
    onScoreboard: () => {
      history.replaceState(null, "", "#scoreboard");
      mount();
    },
    onPsalm91Starter: () => {
      const created = repo.upsertPassage({ ...PSALM_91_STARTER });
      history.replaceState(null, "", `#passage/${created.id}/read`);
      mount();
    },
  });
  wrapShell();
  if (prefill) {
    const form = app!.querySelector<HTMLFormElement>("#passage-form");
    if (!form) return;
    const set = (name: string, value?: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el && value != null) el.value = value;
    };
    set("title", prefill.title);
    set("type", prefill.type);
    set("bibleReference", prefill.bibleReference);
    set("versionHint", prefill.versionHint);
    set("text", prefill.text);
  }
}

function wrapShell(): void {
  if (app!.querySelector(".app-shell")) return;
  const shell = document.createElement("div");
  shell.className = "app-shell";
  while (app!.firstChild) shell.appendChild(app!.firstChild);
  app!.appendChild(shell);
}

function mount(): void {
  const hash = location.hash.replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);

  if (parts[0] === "share" && parts[1]) {
    const payload = decodeSharePayload(parts[1]);
    if (payload) {
      showLibrary({
        title: payload.title,
        type: payload.type,
        bibleReference: payload.bibleReference,
        versionHint: payload.versionHint,
        text: payload.text,
      });
      return;
    }
  }

  if (parts[0] === "scoreboard") {
    renderScoreboard(app!, repo, {
      onBack: () => showLibrary(),
      onOpen: (id) => {
        history.replaceState(null, "", `#passage/${id}/reconstruct`);
        mount();
      },
    });
    return;
  }

  if (parts[0] === "passage" && parts[1] && repo.getPassage(parts[1])) {
    const stage = (STAGES.has(parts[2] as TrainingStage) ? parts[2] : "read") as TrainingStage;
    renderTraining(app!, repo, parts[1], { onBack: showLibrary }, stage);
    return;
  }

  showLibrary();
}

mount();
window.addEventListener("hashchange", mount);
