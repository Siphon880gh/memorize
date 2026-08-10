import "./styles.css";
import { PassageRepository } from "./storage/repository";
import { renderLibrary } from "./ui/library";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

const repo = new PassageRepository();

function showLibrary(): void {
  renderLibrary(app!, repo, {
    onOpenPassage: (id) => {
      // Training stages arrive in later milestones; keep a durable open target.
      history.replaceState(null, "", `#passage/${id}`);
      const p = repo.getPassage(id);
      app!.innerHTML = `
        <div class="app-shell">
          <header class="topbar">
            <div>
              <h1 class="brand">Memorize <span>Script</span></h1>
              <p class="tagline">${p ? escape(p.title) : "Passage"}</p>
            </div>
            <button class="btn secondary" type="button" id="back-lib">Back to library</button>
          </header>
          <section class="panel">
            <h2>Training stages</h2>
            <p class="empty">Read → Understand → Reduce → Visualize → Reconstruct → Recall → Master will unlock as milestones land. Your passage is saved locally.</p>
            <pre style="white-space:pre-wrap;color:var(--muted)">${p ? escape(p.text) : ""}</pre>
          </section>
        </div>
      `;
      app!.querySelector("#back-lib")?.addEventListener("click", () => {
        history.replaceState(null, "", "#");
        mount();
      });
    },
  });
  if (!app!.querySelector(".app-shell")) {
    const shell = document.createElement("div");
    shell.className = "app-shell";
    while (app!.firstChild) shell.appendChild(app!.firstChild);
    app!.appendChild(shell);
  }
}

function mount(): void {
  const hash = location.hash;
  const m = /^#passage\/(.+)$/.exec(hash);
  if (m?.[1] && repo.getPassage(m[1])) {
    showLibrary();
    app!.querySelector<HTMLButtonElement>(`[data-open="${m[1]}"]`)?.click();
    return;
  }
  showLibrary();
}

function escape(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

mount();
window.addEventListener("hashchange", mount);
