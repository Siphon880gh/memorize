import "./styles.css";
import { PassageRepository } from "./storage/repository";
import { renderLibrary } from "./ui/library";
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

function showLibrary(): void {
  history.replaceState(null, "", "#");
  renderLibrary(app!, repo, {
    onOpenPassage: (id) => {
      history.replaceState(null, "", `#passage/${id}/read`);
      mount();
    },
  });
  wrapShell();
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
  if (parts[0] === "passage" && parts[1] && repo.getPassage(parts[1])) {
    const stage = (STAGES.has(parts[2] as TrainingStage) ? parts[2] : "read") as TrainingStage;
    renderTraining(app!, repo, parts[1], { onBack: showLibrary }, stage);
    return;
  }
  showLibrary();
}

mount();
window.addEventListener("hashchange", mount);
