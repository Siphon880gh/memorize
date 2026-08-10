import { sortScoreboard, toScoreboardRows } from "../lib/scoreboard.js";
import { PassageRepository } from "../storage/repository.js";
function renderScoreboard(root, repo, opts) {
  let sortBy = "lastPracticed";
  const paint = () => {
    const rows = sortScoreboard(toScoreboardRows(repo.listPassages()), sortBy);
    const count = rows.length;
    root.innerHTML = `
      <div class="app-shell">
        <header class="topbar">
          <div>
            <h1 class="brand">Memorize <span>Script</span></h1>
            <p class="tagline">Personal scoreboard \u2014 chase zero hints.</p>
          </div>
          <nav class="row top-nav" aria-label="Primary">
            <button class="btn secondary" type="button" id="back-lib">Library (${count})</button>
            <button class="btn secondary nav-current" type="button" aria-current="page">Scoreboard</button>
          </nav>
        </header>
        <section class="panel">
          <div class="row" style="justify-content:space-between;margin-bottom:1rem">
            <h2 style="margin:0">Scoreboard</h2>
            <label>Sort
              <select id="sort-by">
                <option value="lastPracticed" ${sortBy === "lastPracticed" ? "selected" : ""}>Last practiced</option>
                <option value="mastery" ${sortBy === "mastery" ? "selected" : ""}>Mastery %</option>
              </select>
            </label>
          </div>
          ${rows.length === 0 ? `<p class="empty">Practice a passage to populate your personal bests.</p>` : `<div class="table-wrap"><table class="score-table">
                  <thead><tr>
                    <th>Passage</th><th>Best hints</th><th>Latest</th><th>Attempts</th>
                    <th>Zero-hint</th><th>Mem %</th><th>Best time</th><th>Last practiced</th><th></th>
                  </tr></thead>
                  <tbody>
                    ${rows.map(
      (r) => `<tr>
                          <td>${esc(r.title)}</td>
                          <td>${r.bestHintCount ?? "\u2014"}</td>
                          <td>${r.latestHintCount ?? "\u2014"}</td>
                          <td>${r.attemptCount}</td>
                          <td>${r.zeroHintCompletions}</td>
                          <td>${r.memorizationPercent}%</td>
                          <td>${r.bestTimeMs == null ? "\u2014" : `${(r.bestTimeMs / 1e3).toFixed(1)}s`}</td>
                          <td>${r.lastPracticedAt ? esc(r.lastPracticedAt.slice(0, 10)) : "\u2014"}</td>
                          <td><button class="btn secondary" type="button" data-open="${r.id}">Open</button></td>
                        </tr>`
    ).join("")}
                  </tbody>
                </table></div>`}
        </section>
      </div>
    `;
    root.querySelector("#back-lib")?.addEventListener("click", opts.onBack);
    root.querySelector("#sort-by")?.addEventListener("change", (e) => {
      sortBy = e.target.value;
      paint();
    });
    root.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => opts.onOpen(btn.dataset.open));
    });
  };
  paint();
}
function esc(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
export {
  renderScoreboard
};
