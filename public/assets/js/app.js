"use strict";
(() => {
  // src/data/sampleDailyBread.ts
  var DAILY_BREAD_PRAYER_STARTER = {
    type: "bible",
    title: "Daily Bread Prayer",
    bibleReference: "Matthew 6:9-13",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Matthew%206%3A9-13&version=ESV",
    text: [
      "Our Father in heaven, hallowed be your name.",
      "Your kingdom come, your will be done, on earth as it is in heaven.",
      "Give us this day our daily bread,",
      "and forgive us our debts, as we also have forgiven our debtors.",
      "And lead us not into temptation, but deliver us from evil."
    ].join("\n")
  };

  // src/data/samplePsalm91.ts
  var PSALM_91_STARTER = {
    type: "bible",
    title: "My Refuge and My Fortress (Psalm 91)",
    bibleReference: "Psalm 91",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Psalm%2091&version=ESV",
    text: [
      "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty.",
      "I will say to the LORD, “My refuge and my fortress, my God, in whom I trust.”",
      "For he will deliver you from the snare of the fowler and from the deadly pestilence.",
      "He will cover you with his pinions, and under his wings you will find refuge; his faithfulness is a shield and buckler.",
      "You will not fear the terror of the night, nor the arrow that flies by day,",
      "nor the pestilence that stalks in darkness, nor the destruction that wastes at noonday.",
      "A thousand may fall at your side, ten thousand at your right hand, but it will not come near you.",
      "You will only look with your eyes and see the recompense of the wicked.",
      "Because you have made the LORD your dwelling place— the Most High, who is my refuge—",
      "no evil shall be allowed to befall you, no plague come near your tent.",
      "For he will command his angels concerning you to guard you in all your ways.",
      "On their hands they will bear you up, lest you strike your foot against a stone.",
      "You will tread on the lion and the adder; the young lion and the serpent you will trample underfoot.",
      "“Because he holds fast to me in love, I will deliver him; I will protect him, because he knows my name.",
      "When he calls to me, I will answer him; I will be with him in trouble; I will rescue him and honor him.",
      "With long life I will satisfy him and show him my salvation.”"
    ].join("\n")
  };

  // src/data/samplePsalm23.ts
  var PSALM_23_STARTER = {
    type: "bible",
    title: "The Lord is My Shepherd (Psalm 23)",
    bibleReference: "Psalm 23",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Psalm%2023&version=ESV",
    description:
      "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures\u2026Even though I walk through the valley of the shadow of death",
    text: [
      "The LORD is my shepherd; I shall not want.",
      "He makes me lie down in green pastures. He leads me beside still waters.",
      "He restores my soul. He leads me in paths of righteousness for his name’s sake.",
      "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
      "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows.",
      "Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever."
    ].join("\n")
  };

  // src/data/samplePsalm21.ts
  var PSALM_21_STARTER = {
    type: "bible",
    title: "No Devices of Evil Shall Work Against Me (Psalm 21)",
    bibleReference: "Psalm 21",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Psalm%2021&version=ESV",
    description:
      "O LORD, in your strength the king rejoices\u2026Though they plan evil against you, though they devise mischief, they will not succeed.",
    text: [
      "O LORD, in your strength the king rejoices, and in your salvation how greatly he exults!",
      "You have given him his heart’s desire and have not withheld the request of his lips. Selah",
      "For you meet him with rich blessings; you set a crown of fine gold upon his head.",
      "He asked life of you; you gave it to him, length of days forever and ever.",
      "His glory is great through your salvation; splendor and majesty you bestow on him.",
      "For you make him most blessed forever; you make him glad with the joy of your presence.",
      "For the king trusts in the LORD, and through the steadfast love of the Most High he shall not be moved.",
      "Your hand will find out all your enemies; your right hand will find out those who hate you.",
      "You will make them as a blazing oven when you appear. The LORD will swallow them up in his wrath, and fire will consume them.",
      "You will destroy their descendants from the earth, and their offspring from among the children of man.",
      "Though they plan evil against you, though they devise mischief, they will not succeed.",
      "For you will put them to flight; you will aim at their faces with your bows.",
      "Be exalted, O LORD, in your strength! We will sing and praise your power."
    ].join("\n")
  };

  // src/data/sampleArmorOfGod.ts
  var ARMOR_OF_GOD_STARTER = {
    type: "bible",
    title: "Armor of God",
    bibleReference: "Ephesians 6:10-18",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Ephesians%206%3A10-18&version=ESV",
    description:
      "Put on the whole armor of God, that you may be able to stand against the schemes of the devil.",
    text: [
      "Finally, be strong in the Lord and in the strength of his might.",
      "Put on the whole armor of God, that you may be able to stand against the schemes of the devil.",
      "For we do not wrestle against flesh and blood, but against the rulers, against the authorities, against the cosmic powers over this present darkness, against the spiritual forces of evil in the heavenly places.",
      "Therefore take up the whole armor of God, that you may be able to withstand in the evil day, and having done all, to stand firm.",
      "Stand therefore, having fastened on the belt of truth, and having put on the breastplate of righteousness,",
      "and, as shoes for your feet, having put on the readiness given by the gospel of peace.",
      "In all circumstances take up the shield of faith, with which you can extinguish all the flaming darts of the evil one;",
      "and take the helmet of salvation, and the sword of the Spirit, which is the word of God,",
      "praying at all times in the Spirit, with all prayer and supplication. To that end, keep alert with all perseverance, making supplication for all the saints,"
    ].join("\n")
  };

  // src/data/sampleComingToChrist.ts
  var COMING_TO_CHRIST_STARTER = {
    type: "bible",
    title: "Coming to Christ",
    bibleReference: "Romans 3:23; 6:23; 5:8; 10:9-13; 1 John 1:9; Acts 2:38; John 14:15-17; 16:7-8; Galatians 2:20",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Romans%203%3A23%3BRomans%206%3A23%3BRomans%205%3A8%3BRomans%2010%3A9-13%3B1%20John%201%3A9%3BActs%202%3A38%3BJohn%2014%3A15-17%3BJohn%2016%3A7-8%3BGalatians%202%3A20&version=ESV",
    text: [
      "for all have sinned and fall short of the glory of God,",
      "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.",
      "but God shows his love for us in that while we were still sinners, Christ died for us.",
      "because, if you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved.",
      "For with the heart one believes and is justified, and with the mouth one confesses and is saved.",
      "For the Scripture says, “Everyone who believes in him will not be put to shame.”",
      "For there is no distinction between Jew and Greek; for the same Lord is Lord of all, bestowing his riches on all who call on him.",
      "For “everyone who calls on the name of the Lord will be saved.”",
      "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
      "And Peter said to them, “Repent and be baptized every one of you in the name of Jesus Christ for the forgiveness of your sins, and you will receive the gift of the Holy Spirit.",
      "“If you love me, you will keep my commandments.",
      "And I will ask the Father, and he will give you another Helper, to be with you forever,",
      "even the Spirit of truth, whom the world cannot receive, because it neither sees him nor knows him. You know him, for he dwells with you and will be in you.",
      "Nevertheless, I tell you the truth: it is to your advantage that I go away, for if I do not go away, the Helper will not come to you. But if I go, I will send him to you.",
      "And when he comes, he will convict the world concerning sin and righteousness and judgment:",
      "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me."
    ].join("\n")
  };

  // src/data/sampleResistTheDevil.ts
  var RESIST_THE_DEVIL_STARTER = {
    type: "bible",
    title: "Resist the Devil",
    bibleReference: "James 4:7-8",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=James%204%3A7-8&version=ESV",
    description:
      "Submit yourselves therefore to God. Resist the devil, and he will flee from you.",
    text: [
      "Submit yourselves therefore to God. Resist the devil, and he will flee from you.",
      "Draw near to God, and he will draw near to you. Cleanse your hands, you sinners, and purify your hearts, you double-minded."
    ].join("\n")
  };

  // src/data/sampleGetBehindMeSatan.ts
  var GET_BEHIND_ME_SATAN_STARTER = {
    type: "bible",
    title: "Get Behind Me, Satan",
    bibleReference: "Matthew 4:10; Matthew 16:23",
    versionHint: "ESV",
    bibleGatewayUrl: "https://www.biblegateway.com/passage/?search=Matthew%204%3A10%3BMatthew%2016%3A23&version=ESV",
    description:
      "Get behind me, Satan! You are a hindrance to me. For you are not setting your mind on the things of God, but on the things of man.",
    text: [
      "Then Jesus said to him, “Be gone, Satan! For it is written, “‘You shall worship the Lord your God and him only shall you serve.’”",
      "But he turned and said to Peter, “Get behind me, Satan! You are a hindrance to me. For you are not setting your mind on the things of God, but on the things of man.”"
    ].join("\n")
  };
  var OUR_LIBRARY = [
    { key: "psalm91", starter: PSALM_91_STARTER },
    { key: "psalm23", starter: PSALM_23_STARTER },
    { key: "psalm21", starter: PSALM_21_STARTER },
    { key: "armor-of-god", starter: ARMOR_OF_GOD_STARTER },
    { key: "resist-the-devil", starter: RESIST_THE_DEVIL_STARTER },
    { key: "get-behind-me-satan", starter: GET_BEHIND_ME_SATAN_STARTER },
    { key: "daily-bread", starter: DAILY_BREAD_PRAYER_STARTER },
    { key: "coming-to-christ", starter: COMING_TO_CHRIST_STARTER }
  ];
  function starterByKey(key) {
    return OUR_LIBRARY.find((item) => item.key === key)?.starter;
  }

  // src/lib/share.ts
  function buildSharePayload(passage, opts = {}) {
    const payload = {
      v: 1,
      type: passage.type,
      title: passage.title
    };
    if (passage.bibleReference) payload.bibleReference = passage.bibleReference;
    if (passage.versionHint) payload.versionHint = passage.versionHint;
    const includeText = opts.includeText === true && passage.type !== "bible" && Boolean(passage.text?.trim());
    if (passage.type === "bible") {
      return payload;
    }
    if (includeText) payload.text = passage.text;
    return payload;
  }
  function encodeSharePayload(payload) {
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  function decodeSharePayload(encoded) {
    try {
      const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - padded.length % 4);
      const json = decodeURIComponent(escape(atob(padded + pad)));
      const data = JSON.parse(json);
      if (data?.v !== 1 || !data.title || !data.type) return null;
      return data;
    } catch {
      return null;
    }
  }
  function shareUrlFromPayload(payload, origin = location.origin, path = location.pathname) {
    const clean = path.replace(/\/index\.php$/i, "/");
    return `${origin}${clean}#share/${encodeSharePayload(payload)}`;
  }
  function encodedShareFromHash(hash) {
    const raw = hash.replace(/^#/, "");
    if (!raw.startsWith("share/")) return null;
    const encoded = raw.slice("share/".length);
    return encoded || null;
  }
  function passageInputFromShare(payload) {
    return {
      type: payload.type,
      title: payload.title,
      text: payload.text?.trim() ?? "",
      bibleReference: payload.bibleReference,
      versionHint: payload.versionHint
    };
  }

  // src/types.ts
  var STORAGE_KEY = "memorize-script.v1";
  var SCHEMA_VERSION = 1;
  var PASSAGE_TYPES = [
    "bible",
    "speech",
    "acting_script",
    "monologue",
    "presentation",
    "poem",
    "song_spoken",
    "custom"
  ];
  function emptyStats() {
    return {
      bestHintCount: null,
      latestHintCount: null,
      attemptCount: 0,
      zeroHintCompletions: 0,
      bestTimeMs: null,
      lastPracticedAt: null,
      memorizationPercent: 0
    };
  }
  function newId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  // src/storage/repository.ts
  function defaultSettings() {
    return { aiMode: "copy_paste", theme: "system" };
  }
  function emptyDocument() {
    return {
      schemaVersion: SCHEMA_VERSION,
      settings: defaultSettings(),
      passages: []
    };
  }
  function migrateDocument(raw) {
    if (!raw || typeof raw !== "object") return emptyDocument();
    const doc = raw;
    const version = doc.schemaVersion ?? 0;
    if (version > SCHEMA_VERSION) {
      throw new Error(`Unsupported schemaVersion ${version}`);
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      settings: {
        ...defaultSettings(),
        ...doc.settings ?? {},
        aiMode: "copy_paste"
      },
      passages: Array.isArray(doc.passages) ? doc.passages.map(normalizePassage) : []
    };
  }
  function normalizePassage(p) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: p.id || newId(),
      type: p.type || "custom",
      title: p.title || "Untitled",
      bibleReference: p.bibleReference,
      versionHint: p.versionHint,
      bibleGatewayUrl: p.bibleGatewayUrl,
      description: p.description?.trim() || void 0,
      text: p.text || "",
      createdAt: p.createdAt || now,
      updatedAt: p.updatedAt || now,
      segments: Array.isArray(p.segments) ? p.segments : [],
      segmentNotes: p.segmentNotes && typeof p.segmentNotes === "object" ? p.segmentNotes : {},
      reductions: p.reductions && typeof p.reductions === "object" ? p.reductions : {},
      reductionMeta: p.reductionMeta,
      reduceProficiency: typeof p.reduceProficiency === "string" ? p.reduceProficiency : void 0,
      visualAnchors: Array.isArray(p.visualAnchors) ? p.visualAnchors : [],
      stageProgress: p.stageProgress && typeof p.stageProgress === "object" ? p.stageProgress : {},
      attempts: Array.isArray(p.attempts) ? p.attempts : [],
      stats: { ...emptyStats(), ...p.stats ?? {} },
      masteredAt: p.masteredAt ?? null
    };
  }
  var PassageRepository = class {
    storage;
    constructor(storage = localStorage) {
      this.storage = storage;
    }
    load() {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return emptyDocument();
      try {
        return migrateDocument(JSON.parse(raw));
      } catch {
        return emptyDocument();
      }
    }
    save(doc) {
      const payload = {
        ...doc,
        schemaVersion: SCHEMA_VERSION
      };
      this.storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    listPassages() {
      return this.load().passages.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    getPassage(id) {
      return this.load().passages.find((p) => p.id === id);
    }
    upsertPassage(input) {
      const doc = this.load();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const existing = input.id ? doc.passages.find((p) => p.id === input.id) : void 0;
      const passage = normalizePassage({
        ...existing ?? {},
        id: existing?.id ?? newId(),
        type: input.type,
        title: input.title.trim() || "Untitled",
        text: input.text,
        bibleReference: input.bibleReference?.trim() || void 0,
        versionHint: input.versionHint?.trim() || void 0,
        bibleGatewayUrl: input.bibleGatewayUrl?.trim() || void 0,
        description: input.description?.trim() || void 0,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now
      });
      if (existing) {
        doc.passages = doc.passages.map((p) => p.id === passage.id ? passage : p);
      } else {
        doc.passages.push(passage);
      }
      this.save(doc);
      return passage;
    }
    deletePassage(id) {
      const doc = this.load();
      const before = doc.passages.length;
      doc.passages = doc.passages.filter((p) => p.id !== id);
      if (doc.passages.length === before) return false;
      this.save(doc);
      return true;
    }
    replaceDocument(doc) {
      this.save(migrateDocument(doc));
    }
  };

  // src/lib/backup.ts
  function exportDocument(doc) {
    return JSON.stringify(doc, null, 2);
  }
  function importDocument(raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Import failed: invalid JSON");
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Import failed: expected an object");
    }
    const version = parsed.schemaVersion;
    if (version == null) {
      throw new Error("Import failed: missing schemaVersion");
    }
    return migrateDocument(parsed);
  }
  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // src/ui/library.ts
  function typeLabel(t) {
    return t.replaceAll("_", " ");
  }
  var libraryTab = "our";
  var libraryToast = "";
  function renderLibrary(root, repo2, callbacks, editing) {
    const passages = repo2.listPassages();
    const count = passages.length;
    const ourList = `<ul class="passage-list">${OUR_LIBRARY.map((item) => renderItem(item.starter, { catalogKey: item.key })).join("")}</ul>`;
    const myList = count === 0 ? `<p class="empty">No passages yet. Add one above, or copy one from Our Library.</p>` : `<ul class="passage-list">${passages.map((p) => renderItem(p)).join("")}</ul>`;
    root.innerHTML = `
    <div class="app-shell">
    <header class="topbar">
      <div>
        <button class="brand" type="button" id="brand-home" title="Back to library">Memorize <span>Script</span></button>
        <p class="tagline">Train long spoken material until hints drop to zero.</p>
      </div>
      <nav class="row top-nav" aria-label="Primary">
        <button class="btn secondary nav-current" type="button" id="goto-library" aria-current="page">Library (${count})</button>
        <button class="btn secondary" type="button" id="goto-scoreboard">Scoreboard</button>
        <button class="btn secondary" type="button" id="export-data">Export</button>
        <label class="btn secondary" style="cursor:pointer">Import<input id="import-data" type="file" accept="application/json,.json" hidden /></label>
      </nav>
    </header>
    <section class="panel">
      <h2>${editing ? "Edit passage" : "Add passage"}</h2>
      <form id="passage-form" class="grid">
        <label>Title
          <input name="title" required value="${escapeAttr(editing?.title ?? "")}" />
        </label>
        <label>Type
          <select name="type">
            ${PASSAGE_TYPES.map(
      (t) => `<option value="${t}" ${editing?.type === t ? "selected" : t === "custom" && !editing ? "selected" : ""}>${typeLabel(t)}</option>`
    ).join("")}
          </select>
        </label>
        <label>Bible reference (optional)
          <input name="bibleReference" placeholder="Psalm 91" value="${escapeAttr(editing?.bibleReference ?? "")}" />
        </label>
        <label>Version hint (optional)
          <input name="versionHint" placeholder="ESV" value="${escapeAttr(editing?.versionHint ?? "")}" />
        </label>
        <label>Passage text
          <textarea name="text" required placeholder="Paste the wording you want to memorize">${escapeHtml(editing?.text ?? "")}</textarea>
        </label>
        <div class="row">
          <button class="btn" type="submit">${editing ? "Save changes" : "Save passage"}</button>
          ${editing ? `<button class="btn secondary" type="button" id="cancel-edit">Cancel</button>` : ""}
        </div>
        <p class="toast" id="form-toast" hidden></p>
      </form>
    </section>
    <section class="panel" id="library-panel">
      <div class="library-head">
        <div class="library-tabs" role="tablist" aria-label="Library">
          <button class="btn secondary${libraryTab === "our" ? " nav-current" : ""}" type="button" id="tab-our" role="tab" aria-selected="${libraryTab === "our"}" aria-controls="library-tab-panel">Our Library</button>
          <button class="btn secondary${libraryTab === "mine" ? " nav-current" : ""}" type="button" id="tab-mine" role="tab" aria-selected="${libraryTab === "mine"}" aria-controls="library-tab-panel">My Library (${count})</button>
        </div>
      </div>
      <div id="library-tab-panel" role="tabpanel">
        ${libraryTab === "our" ? ourList : myList}
      </div>
      <p class="toast" id="library-toast" hidden></p>
    </section>
    </div>
  `;
    const form = root.querySelector("#passage-form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const saved = repo2.upsertPassage({
        id: editing?.id,
        title: String(data.get("title") ?? ""),
        type: String(data.get("type") ?? "custom"),
        bibleReference: String(data.get("bibleReference") ?? "") || void 0,
        versionHint: String(data.get("versionHint") ?? "") || void 0,
        text: String(data.get("text") ?? "")
      });
      const toast = root.querySelector("#form-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = `Saved \u201C${saved.title}\u201D.`;
      }
      libraryTab = "mine";
      renderLibrary(root, repo2, callbacks, null);
    });
    root.querySelector("#cancel-edit")?.addEventListener("click", () => {
      renderLibrary(root, repo2, callbacks, null);
    });
    root.querySelector("#brand-home")?.addEventListener("click", () => {
      history.replaceState(null, "", "#");
      renderLibrary(root, repo2, callbacks, null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    root.querySelector("#goto-library")?.addEventListener("click", () => {
      root.querySelector("#library-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    root.querySelector("#goto-scoreboard")?.addEventListener("click", () => {
      callbacks.onScoreboard?.();
    });
    root.querySelector("#tab-our")?.addEventListener("click", () => {
      libraryTab = "our";
      renderLibrary(root, repo2, callbacks, editing);
    });
    root.querySelector("#tab-mine")?.addEventListener("click", () => {
      libraryTab = "mine";
      renderLibrary(root, repo2, callbacks, editing);
    });
    root.querySelector("#export-data")?.addEventListener("click", () => {
      downloadText("memorize-script-backup.json", exportDocument(repo2.load()));
    });
    root.querySelector("#import-data")?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const doc = importDocument(text);
        if (!confirm("Replace all local passages with this backup?")) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
        renderLibrary(root, repo2, callbacks, null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Import failed");
      }
    });
    function showLibraryToast(message) {
      const toast = root.querySelector("#library-toast");
      if (!toast) return;
      toast.hidden = false;
      toast.textContent = message;
    }
    if (libraryToast) {
      showLibraryToast(libraryToast);
      libraryToast = "";
    }
    root.querySelectorAll("[data-copy-starter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const starter = starterByKey(btn.dataset.copyStarter);
        if (!starter) return;
        const existed = Boolean(callbacks.onFindStarter?.(starter));
        const saved = callbacks.onApplyStarter?.(starter);
        if (!saved) return;
        libraryToast = existed ? `\u201C${starter.title}\u201D is already in My Library.` : `Copied \u201C${starter.title}\u201D to My Library.`;
        renderLibrary(root, repo2, callbacks, editing);
      });
    });
    root.querySelectorAll("[data-open-starter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const starter = starterByKey(btn.dataset.openStarter);
        if (!starter) return;
        const saved = callbacks.onApplyStarter?.(starter);
        if (saved) callbacks.onOpenPassage(saved.id);
      });
    });
    root.querySelectorAll("[data-edit-starter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const starter = starterByKey(btn.dataset.editStarter);
        if (!starter) return;
        const saved = callbacks.onApplyStarter?.(starter);
        if (saved) {
          libraryTab = "mine";
          renderLibrary(root, repo2, callbacks, saved);
        }
      });
    });
    root.querySelectorAll("[data-delete-starter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const starter = starterByKey(btn.dataset.deleteStarter);
        if (!starter) return;
        const match = callbacks.onFindStarter?.(starter);
        if (!match) {
          alert(`\u201C${starter.title}\u201D is not in My Library yet.`);
          return;
        }
        if (!confirm(`Delete \u201C${match.title}\u201D from My Library?`)) return;
        repo2.deletePassage(match.id);
        renderLibrary(root, repo2, callbacks, null);
      });
    });
    root.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => callbacks.onOpenPassage(btn.dataset.open));
    });
    root.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = repo2.getPassage(btn.dataset.edit);
        if (p) renderLibrary(root, repo2, callbacks, p);
      });
    });
    root.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.delete;
        const p = repo2.getPassage(id);
        if (!p) return;
        if (!confirm(`Delete \u201C${p.title}\u201D?`)) return;
        repo2.deletePassage(id);
        renderLibrary(root, repo2, callbacks, null);
      });
    });
  }
  function passagePreview(p) {
    const custom = p.description?.trim();
    if (custom) return { text: custom, ellipsis: "" };
    const body = p.text.trim();
    if (!body) return { text: "(no text yet)", ellipsis: "" };
    return { text: body.slice(0, 80), ellipsis: body.length > 80 ? "\u2026" : "" };
  }
  function renderItem(p, opts = {}) {
    const { text: preview, ellipsis } = passagePreview(p);
    const meta = [typeLabel(p.type), p.bibleReference].filter(Boolean).join(" \xB7 ");
    const key = opts.catalogKey;
    const openAttr = key ? `data-open-starter="${key}"` : `data-open="${p.id}"`;
    const editAttr = key ? `data-edit-starter="${key}"` : `data-edit="${p.id}"`;
    const deleteAttr = key ? `data-delete-starter="${key}"` : `data-delete="${p.id}"`;
    const copyBtn = key ? `<button class="copy-to-library" type="button" data-copy-starter="${key}">Copy to my library</button>` : "";
    return `<li class="passage-item">
    <div>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(meta)}</p>
      <p>${escapeHtml(preview)}${ellipsis}</p>
    </div>
    <div class="passage-actions">
      <div class="passage-actions-row">
        <button class="btn" type="button" ${openAttr}>Open</button>
        <button class="btn secondary" type="button" ${editAttr}>Edit</button>
        <button class="btn danger" type="button" ${deleteAttr}>Delete</button>
      </div>
      ${copyBtn}
    </div>
  </li>`;
  }
  function escapeHtml(s) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("`", "&#96;");
  }

  // src/lib/scoreboard.ts
  function toScoreboardRows(passages) {
    return passages.map((p) => ({
      id: p.id,
      title: p.title,
      bestHintCount: p.stats.bestHintCount,
      latestHintCount: p.stats.latestHintCount,
      attemptCount: p.stats.attemptCount,
      zeroHintCompletions: p.stats.zeroHintCompletions,
      memorizationPercent: p.stats.memorizationPercent,
      bestTimeMs: p.stats.bestTimeMs,
      lastPracticedAt: p.stats.lastPracticedAt
    }));
  }
  function sortScoreboard(rows, by = "lastPracticed") {
    const copy = rows.slice();
    if (by === "mastery") {
      return copy.sort((a, b) => b.memorizationPercent - a.memorizationPercent);
    }
    return copy.sort((a, b) => {
      const at = a.lastPracticedAt ?? "";
      const bt = b.lastPracticedAt ?? "";
      return bt.localeCompare(at);
    });
  }

  // src/ui/scoreboard.ts
  function renderScoreboard(root, repo2, opts) {
    let sortBy = "lastPracticed";
    const paint = () => {
      const rows = sortScoreboard(toScoreboardRows(repo2.listPassages()), sortBy);
      const count = rows.length;
      root.innerHTML = `
      <div class="app-shell">
        <header class="topbar">
          <div>
            <button class="brand" type="button" id="brand-home" title="Back to library">Memorize <span>Script</span></button>
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
      root.querySelector("#brand-home")?.addEventListener("click", opts.onBack);
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

  // src/lib/ordering.ts
  var KEYWORD_STOP = /* @__PURE__ */ new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "of",
    "to",
    "in",
    "on",
    "for",
    "is",
    "are",
    "be",
    "as",
    "it",
    "at",
    "by",
    "from",
    "with",
    "our",
    "us",
    "we",
    "thy",
    "thou",
    "thee",
    "ye",
    "that",
    "this",
    "his",
    "her",
    "their",
    "my",
    "me",
    "i",
    "you",
    "your",
    "not",
    "but",
    "so",
    "if",
    "into",
    "unto"
  ]);
  function toOrderItems(segments) {
    return segments.slice().sort((a, b) => a.index - b.index).map((s) => ({ id: s.id, text: s.text }));
  }
  function segmentFirstWord(text) {
    const word = text.trim().split(/\s+/).find(Boolean) ?? "";
    return word.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "") || word || "\u2026";
  }
  function segmentKeywords(text) {
    const words = text.trim().split(/\s+/).map((w) => w.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "")).filter(Boolean);
    const keys = words.filter((w) => {
      const lower = w.toLowerCase();
      return lower.length > 2 && !KEYWORD_STOP.has(lower);
    });
    if (keys.length === 0) return segmentFirstWord(text);
    return keys.join(" \xB7 ");
  }
  function reconstructCardLabel(fullText, mode, inCorrectPlace) {
    if (inCorrectPlace) {
      return { text: fullText, revealed: true };
    }
    if (mode === "full") {
      return { text: fullText, revealed: false };
    }
    if (mode === "first_word") {
      return { text: segmentFirstWord(fullText), revealed: false };
    }
    return { text: segmentKeywords(fullText), revealed: false };
  }
  function shuffleItems(items, rng = Math.random) {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.length > 1 && arr.every((v, i) => v === items[i])) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    return arr;
  }
  function gradeOrder(currentIds, correctIds) {
    const correctPositions = currentIds.map((id, i) => id === correctIds[i]);
    const allCorrect = correctPositions.every(Boolean) && currentIds.length === correctIds.length;
    const nextHintIndex = correctPositions.findIndex((ok) => !ok);
    return {
      correctPositions,
      allCorrect,
      nextHintIndex: nextHintIndex === -1 ? correctIds.length : nextHintIndex
    };
  }
  function moveItem(items, from, to) {
    if (from < 0 || from >= items.length || to < 0 || to >= items.length) return items.slice();
    const next = items.slice();
    const [picked] = next.splice(from, 1);
    next.splice(to, 0, picked);
    return next;
  }
  function applyHint(currentIds, correctIds) {
    const { nextHintIndex } = gradeOrder(currentIds, correctIds);
    if (nextHintIndex >= correctIds.length) {
      return { ids: currentIds.slice(), hintedIndex: -1 };
    }
    const needId = correctIds[nextHintIndex];
    const from = currentIds.indexOf(needId);
    if (from === -1) return { ids: currentIds.slice(), hintedIndex: -1 };
    return { ids: moveItem(currentIds, from, nextHintIndex), hintedIndex: nextHintIndex };
  }

  // src/lib/recallGrade.ts
  function normalizeRecall(text) {
    return text.toLowerCase().replace(/[\u2018\u2019\u201A\u2032]/g, "'").replace(/[^\p{L}\p{N}\s']/gu, " ").replace(/\s+/g, " ").trim();
  }
  function gradeRecall(original, attempt) {
    const expected = normalizeRecall(original);
    const got = normalizeRecall(attempt);
    if (!got) return { ok: false, similarity: 0, empty: true };
    if (!expected) return { ok: false, similarity: 0, empty: false };
    if (expected === got) return { ok: true, similarity: 1, empty: false };
    const ta = expected.split(" ").filter(Boolean);
    const tb = got.split(" ").filter(Boolean);
    const setA = new Set(ta);
    const setB = new Set(tb);
    let inter = 0;
    for (const t of setB) if (setA.has(t)) inter += 1;
    const union = (/* @__PURE__ */ new Set([...setA, ...setB])).size || 1;
    const jaccard = inter / union;
    const coverage = setA.size ? inter / setA.size : 0;
    const lenRatio = Math.min(expected.length, got.length) / Math.max(expected.length, got.length);
    const similarity = jaccard * 0.55 + coverage * 0.35 + lenRatio * 0.1;
    const ok = coverage >= 0.8 && jaccard >= 0.72 && similarity >= 0.78;
    return { ok, similarity, empty: false };
  }

  // src/lib/reduction.ts
  function firstWords(text) {
    return text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean).map((sentence) => {
      const word = sentence.split(/\s+/)[0] ?? "";
      return word;
    }).join(" \xB7 ");
  }
  function firstLetters(text) {
    return text.split(/\s+/).filter(Boolean).map((w) => {
      const ch = [...w].find((c) => /\p{L}/u.test(c));
      return ch ? ch.toUpperCase() : "";
    }).filter(Boolean).join(" ");
  }
  function localReduction(level, original, stored) {
    switch (level) {
      case "full":
        return original;
      case "none":
        return "";
      case "first_words":
        return firstWords(original);
      case "first_letters":
        return firstLetters(original);
      case "essential":
      case "keywords":
        return stored?.trim() || "";
      default:
        return original;
    }
  }
  function buildReductionPrompt(purpose, passageTitle, passageText) {
    const goal = purpose === "essential" ? "Essentials \u2014 condensed: tight essential anchors only (fewest words that still preserve sequence and meaning)" : "Essentials \u2014 expanded: a reduced cue that keeps short essential phrases (not the full original wording)";
    return [
      "You are helping me memorize a spoken passage.",
      `Passage title: ${passageTitle}`,
      "",
      "Reduce the passage into " + goal + ".",
      "Rules:",
      "- Preserve the original sequence and meaning.",
      "- Do not reorder ideas.",
      "- Do not add commentary before or after the reduced text.",
      "- Return plain text only.",
      "",
      "Passage:",
      passageText
    ].join("\n");
  }
  /** Harder cues score higher when declared as Reduce proficiency. First letters = top. */
  var REDUCE_PROFICIENCY = [
    { id: "keywords", label: "Essentials \u2014 expanded", score: 0.35 },
    { id: "essential", label: "Essentials \u2014 condensed", score: 0.5 },
    { id: "first_words", label: "First words", score: 0.75 },
    { id: "first_letters", label: "First letters", score: 1 },
    { id: "none", label: "No hints", score: 0.9 }
  ];
  var REDUCTION_LEVELS = [
    { id: "full", label: "Full text", needsPaste: false },
    { id: "keywords", label: "Essentials \u2014 expanded", needsPaste: true },
    { id: "essential", label: "Essentials \u2014 condensed", needsPaste: true },
    { id: "first_words", label: "First words", needsPaste: false },
    { id: "first_letters", label: "First letters", needsPaste: false },
    { id: "none", label: "No hints", needsPaste: false }
  ];
  function reduceProficiencyScore(level) {
    return REDUCE_PROFICIENCY.find((p) => p.id === level)?.score ?? 0;
  }
  function reduceProficiencyLabel(level) {
    return REDUCE_PROFICIENCY.find((p) => p.id === level)?.label ?? REDUCTION_LEVELS.find((l) => l.id === level)?.label ?? level ?? "\u2014";
  }

  // src/lib/segment.ts
  function segmentText(text) {
    const normalized = text.replace(/\r\n/g, "\n").trim();
    if (!normalized) return [];
    const rough = normalized.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    const pieces = [];
    for (const chunk of rough) {
      if (chunk.length > 80 && /[;:—]/.test(chunk)) {
        const parts = chunk.split(/\s*[;:—]\s*/).map((s) => s.trim()).filter(Boolean);
        pieces.push(...parts);
      } else {
        pieces.push(chunk);
      }
    }
    return pieces.map((t, index) => ({
      id: newId(),
      index,
      text: t
    }));
  }
  function ensureSegments(text, existing) {
    const next = segmentText(text);
    if (existing.length === next.length && existing.every((s, i) => s.text === next[i]?.text)) {
      return existing;
    }
    return next.map((seg, i) => {
      const prev = existing[i];
      if (prev && prev.text === seg.text) return { ...prev, index: i };
      return seg;
    });
  }

  // src/lib/stats.ts
  var STAGES = [
    "read",
    "understand",
    "reduce",
    "visualize",
    "reconstruct",
    "recall",
    "master"
  ];
  function computeMemorizationPercent(passage) {
    const segmentCount = Math.max(passage.segments.length, 1);
    const zeroHintBonus = passage.stats.zeroHintCompletions > 0 || passage.attempts.some((a) => a.zeroHint) ? 1 : 0;
    const best = passage.stats.bestHintCount;
    const hintFactor = best === null ? 0 : 1 - Math.min(best, segmentCount) / segmentCount;
    const completedStages = STAGES.filter((s) => passage.stageProgress[s]?.completed).length;
    const stageFactor = completedStages / 7;
    const reduceFactor = reduceProficiencyScore(passage.reduceProficiency);
    return Math.round(
      Math.max(
        0,
        Math.min(100, zeroHintBonus * 30 + hintFactor * 30 + stageFactor * 20 + reduceFactor * 20)
      )
    );
  }
  function recordAttempt(passage, input) {
    const completedAt = (/* @__PURE__ */ new Date()).toISOString();
    const events = input.hintEvents ?? [];
    const hintsUsed = Math.max(input.hintsUsed, events.length);
    const zeroHint = input.success && hintsUsed === 0;
    const attempt = {
      id: newId(),
      stage: input.stage,
      hintsUsed,
      hintEvents: events,
      durationMs: input.durationMs,
      zeroHint,
      completedAt,
      success: input.success
    };
    const stats = { ...passage.stats ?? emptyStats() };
    stats.attemptCount += 1;
    stats.latestHintCount = hintsUsed;
    stats.lastPracticedAt = completedAt;
    if (input.success) {
      if (stats.bestHintCount === null || hintsUsed < stats.bestHintCount) {
        stats.bestHintCount = hintsUsed;
      }
      if (stats.bestTimeMs === null || input.durationMs < stats.bestTimeMs) {
        stats.bestTimeMs = input.durationMs;
      }
      if (zeroHint) stats.zeroHintCompletions += 1;
    }
    const updated = {
      ...passage,
      attempts: [...passage.attempts, attempt],
      stats,
      updatedAt: completedAt
    };
    updated.stats.memorizationPercent = computeMemorizationPercent(updated);
    return updated;
  }
  function resetMastery(passage, mode) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const base = {
      ...passage,
      masteredAt: null,
      stageProgress: {},
      attempts: [],
      stats: emptyStats(),
      reduceProficiency: void 0,
      updatedAt: now
    };
    if (mode === "clear_content") {
      return {
        ...base,
        segmentNotes: {},
        reductions: {},
        reductionMeta: void 0,
        visualAnchors: []
      };
    }
    return base;
  }
  function hintKindLabel(kind) {
    switch (kind) {
      case "place_hint":
        return "Hint button";
      case "reveal_original":
        return "Reveal full text";
      case "full_cue":
        return "Full-segment cue";
      default:
        return kind;
    }
  }

  // src/lib/visualPrompt.ts
  function inferConcept(segmentText2) {
    const cleaned = segmentText2.replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    return words.slice(0, 6).join(" ") || "memorable scene";
  }
  function buildImagePrompt(segment, concept) {
    const idea = (concept ?? inferConcept(segment.text)).trim();
    return [
      "Create a vivid, memorable illustration for memorizing a spoken passage.",
      `Visual concept: ${idea}`,
      `Passage segment: "${segment.text}"`,
      "Style: clear symbolic scene, strong focal subject, no text overlay, suitable as a mental memory palace image."
    ].join("\n");
  }

  // src/ui/sharePanel.ts
  function mountShareControls(host, passage) {
    const canIncludeText = passage.type !== "bible";
    host.innerHTML = `
    <div style="margin-top:0.75rem; margin-bottom:0.75rem">
      ${canIncludeText ? `<label class="inline"><input type="checkbox" id="include-text" checked /> Include text in link</label>` : `<span class="empty">Bible shares send reference only (no translation body). Recipients open a library item they can paste into.</span>`}
      <br/><button class="btn secondary" type="button" id="copy-share">Copy share link</button>
      <button class="btn secondary" style="margin-top:0.5rem;" type="button" id="native-share">Share\u2026</button>
      <span class="toast" style="margin-top:0.5rem;" id="share-toast" hidden></span>
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

  // src/ui/training.ts
  var STAGE_ORDER = [
    "read",
    "understand",
    "reduce",
    "visualize",
    "reconstruct",
    "recall",
    "master"
  ];
  function isComplete(passage, stage) {
    return Boolean(passage.stageProgress[stage]?.completed);
  }
  function isUnlocked(passage, stage) {
    if (stage === "read") return true;
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx <= 0) return true;
    return isComplete(passage, STAGE_ORDER[idx - 1]);
  }
  function nextStage(stage) {
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
    return STAGE_ORDER[idx + 1];
  }
  function stageLabel(stage) {
    return `${stage[0].toUpperCase()}${stage.slice(1)}`;
  }
  /** Next stage still needed for mastery credit (ordered path). */
  function masteryNext(passage) {
    for (const s of STAGE_ORDER) {
      if (!isComplete(passage, s)) return s;
    }
    return null;
  }
  /** Which training track is active / which accordion is open (session UI state). */
  var trainingUi = {
    activeTrack: "mastery",
    openTrack: null,
    passageId: null
  };
  function setTrainingTrack(track, opts = {}) {
    if (opts.toggle) {
      trainingUi.openTrack = trainingUi.openTrack === track ? null : track;
      if (trainingUi.openTrack === track) trainingUi.activeTrack = track;
      return;
    }
    if (opts.open === true) {
      trainingUi.openTrack = track;
      trainingUi.activeTrack = track;
      return;
    }
    if (opts.open === false) {
      trainingUi.openTrack = null;
      return;
    }
    trainingUi.activeTrack = track;
  }
  function renderTraining(root, repo2, passageId, callbacks, stage = "read") {
    let passage = repo2.getPassage(passageId);
    if (!passage) {
      callbacks.onBack();
      return;
    }
    if (trainingUi.passageId !== passageId) {
      trainingUi.passageId = passageId;
      trainingUi.activeTrack = "mastery";
      trainingUi.openTrack = null;
    }
    passage = syncSegments(repo2, passage);
    const libraryCount = repo2.listPassages().length;
    const masteryFocus = masteryNext(passage);
    let activeStage = STAGE_ORDER.includes(stage) ? stage : "read";
    if (trainingUi.activeTrack === "mastery" && !isUnlocked(passage, activeStage)) {
      activeStage = masteryFocus ?? "read";
      history.replaceState(null, "", `#passage/${passageId}/${activeStage}`);
    }
    const masteryResumeLabel = masteryFocus == null ? "Open Master checklist" : masteryFocus === activeStage ? `Stay on ${stageLabel(masteryFocus)} \u2014 finish this for mastery` : `Continue mastery \u2192 ${stageLabel(masteryFocus)}`;
    const masteryOpen = trainingUi.openTrack === "mastery";
    const practiceOpen = trainingUi.openTrack === "practice";
    const masteryActive = trainingUi.activeTrack === "mastery";
    const practiceActive = trainingUi.activeTrack === "practice";
    root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <button class="brand" type="button" id="brand-home" title="Back to library">Memorize <span>Script</span></button>
          <p class="tagline">${esc2(passage.title)}${passage.bibleReference ? ` \xB7 ${esc2(passage.bibleReference)}` : ""}</p>
        </div>
        <nav class="row top-nav" aria-label="Primary">
          <button class="btn secondary" type="button" id="back-lib">Library (${libraryCount})</button>
        </nav>
      </header>
      <div id="share-host"></div>
      <section class="tracks-panel" aria-label="Training tracks">
        <div class="track track-mastery ${masteryActive ? "is-active" : ""} ${masteryOpen ? "is-open" : ""}">
          <button type="button" class="track-toggle" id="toggle-mastery" aria-expanded="${masteryOpen ? "true" : "false"}" aria-controls="mastery-body">
            <span class="track-toggle-main">
              <strong class="track-title">Mastery path</strong>
              ${masteryActive ? `<span class="track-badge">Active</span>` : ""}
              <span class="track-desc">Jump back to finished stages, or continue to the next one. Locked stages stay ahead until you reach them.</span>
            </span>
            <span class="track-chevron" aria-hidden="true"></span>
          </button>
          <div class="track-body" id="mastery-body" ${masteryOpen ? "" : "hidden"}>
            <ol class="mastery-steps" aria-label="Mastery order">
              ${STAGE_ORDER.map((s, i) => {
      const done = isComplete(passage, s);
      const reachable = isUnlocked(passage, s);
      const isFocus = s === masteryFocus;
      const isHere = s === activeStage && masteryActive;
      const cls = [
        "mastery-step",
        done ? "step-done" : isFocus ? "step-next" : "step-todo",
        isHere ? "step-here" : "",
        reachable ? "is-reachable" : "is-locked"
      ].filter(Boolean).join(" ");
      const mark = done ? "\u2713 " : isFocus ? "\u2192 " : "";
      const title = reachable ? stageLabel(s) : "Finish earlier stages first";
      return `${i ? `<li class="step-sep" aria-hidden="true">\u2192</li>` : ""}<li class="${cls}"><button type="button" class="mastery-step-btn" data-mastery-stage="${s}" ${reachable ? "" : "disabled"} title="${title}">${mark}${stageLabel(s)}</button></li>`;
    }).join("")}
            </ol>
            <div class="row">
              <button class="btn" type="button" id="resume-mastery">${esc2(masteryResumeLabel)}</button>
              <button class="btn secondary" type="button" id="reset-mastery-path">Reset</button>
            </div>
          </div>
        </div>
        <div class="track track-free ${practiceActive ? "is-active" : ""} ${practiceOpen ? "is-open" : ""}">
          <button type="button" class="track-toggle" id="toggle-practice" aria-expanded="${practiceOpen ? "true" : "false"}" aria-controls="practice-body">
            <span class="track-toggle-main">
              <strong class="track-title">Practice any mode</strong>
              ${practiceActive ? `<span class="track-badge">Active</span>` : ""}
              <span class="track-desc">Jump around and try techniques anytime.</span>
            </span>
            <span class="track-chevron" aria-hidden="true"></span>
          </button>
          <div class="track-body" id="practice-body" ${practiceOpen ? "" : "hidden"}>
            <nav class="stage-nav" aria-label="Practice modes">
              ${STAGE_ORDER.filter((s) => s !== "master").map((s) => {
      const done = isComplete(passage, s);
      const onPath = isUnlocked(passage, s);
      const classes = [
        "stage-pill",
        s === activeStage ? "active" : "",
        done ? "done" : "",
        !onPath && !done ? "practice-only" : ""
      ].filter(Boolean).join(" ");
      const label = `${done ? "\u2713 " : ""}${stageLabel(s)}`;
      const title = !onPath && !done ? "Practice freely \u2014 complete earlier stages for mastery credit" : stageLabel(s);
      return `<button type="button" class="${classes}" data-stage="${s}" title="${title}">${label}</button>`;
    }).join("")}
            </nav>
          </div>
        </div>
      </section>
      <p class="toast" id="stage-toast" hidden></p>
      <section class="panel" id="stage-panel"></section>
    </div>
  `;
    const go = (next, track) => {
      if (track) setTrainingTrack(track, { open: true });
      history.replaceState(null, "", `#passage/${passageId}/${next}`);
      renderTraining(root, repo2, passageId, callbacks, next);
    };
    const toast = (msg) => {
      const el = root.querySelector("#stage-toast");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
    };
    root.querySelector("#back-lib")?.addEventListener("click", callbacks.onBack);
    root.querySelector("#brand-home")?.addEventListener("click", callbacks.onBack);
    root.querySelector("#toggle-mastery")?.addEventListener("click", () => {
      setTrainingTrack("mastery", { toggle: true });
      renderTraining(root, repo2, passageId, callbacks, activeStage);
    });
    root.querySelector("#toggle-practice")?.addEventListener("click", () => {
      setTrainingTrack("practice", { toggle: true });
      renderTraining(root, repo2, passageId, callbacks, activeStage);
    });
    root.querySelector("#resume-mastery")?.addEventListener("click", () => {
      go(masteryFocus ?? "master", "mastery");
    });
    root.querySelector("#reset-mastery-path")?.addEventListener("click", () => {
      openHelpModal(
        "Reset mastery?",
        `<p>This clears mastery, sets hints/wins back to <strong>0</strong>, unlocks stages from the start, and returns you to <strong>Read</strong>.</p>
       <p>Choose whether to keep study content you filled in (notes, ChatGPT reductions, visual anchors / image URLs).</p>
       <div class="row modal-actions">
         <button type="button" class="btn" id="reset-keep">Keep filled info</button>
         <button type="button" class="btn danger" id="reset-clear">Reset filled info too</button>
         <button type="button" class="btn secondary" id="reset-cancel">Cancel</button>
       </div>`
      );
      const modal = document.getElementById("app-help-modal");
      const finish = (mode) => {
        const updated = resetMastery(passage, mode);
        savePassage(repo2, updated);
        Object.assign(passage, updated);
        modal?.remove();
        go("read", "mastery");
      };
      modal?.querySelector("#reset-keep")?.addEventListener("click", () => finish("keep_content"));
      modal?.querySelector("#reset-clear")?.addEventListener("click", () => finish("clear_content"));
      modal?.querySelector("#reset-cancel")?.addEventListener("click", () => modal.remove());
    });
    root.querySelectorAll("[data-mastery-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.masteryStage;
        if (!next) return;
        if (!isUnlocked(passage, next)) {
          toast("Finish earlier stages first to move forward on the mastery path.");
          return;
        }
        go(next, "mastery");
      });
    });
    const shareHost = root.querySelector("#share-host");
    if (shareHost) mountShareControls(shareHost, passage);
    root.querySelectorAll("[data-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.stage;
        if (!next) return;
        if (!isUnlocked(passage, next) && !isComplete(passage, next)) {
          toast("Practicing off the mastery path \u2014 finish earlier stages later for mastery credit.");
        }
        go(next, "practice");
      });
    });
    const panel = root.querySelector("#stage-panel");
    if (!panel) return;
    const continueRow = (from, label) => {
      const n = nextStage(from);
      if (!n) return "";
      return `<div class="row stage-next-row">
      <button class="btn stage-next" type="button" id="continue-next">${esc2(label)}</button>
    </div>`;
    };
    const bindContinue = (from) => {
      panel.querySelector("#continue-next")?.addEventListener("click", () => {
        const n = nextStage(from);
        if (n) go(n, "mastery");
      });
    };
    if (activeStage === "read") {
      renderRead(panel, repo2, passage, () => {
        const updated = markStage(repo2, passage, "read");
        Object.assign(passage, updated);
        go("understand", "mastery");
      });
    } else if (activeStage === "understand") {
      renderUnderstand(panel, repo2, passage, (updated) => {
        Object.assign(passage, updated);
        renderTraining(root, repo2, passageId, callbacks, "understand");
      });
      if (isComplete(passage, "understand")) {
        panel.insertAdjacentHTML(
          "beforeend",
          continueRow("understand", "Continue mastery \u2192 Reduce")
        );
        bindContinue("understand");
      }
    } else if (activeStage === "reduce") {
      renderReduce(panel, repo2, passage, (updated) => {
        Object.assign(passage, updated);
        renderTraining(root, repo2, passageId, callbacks, "reduce");
      });
      if (isComplete(passage, "reduce")) {
        panel.insertAdjacentHTML(
          "beforeend",
          continueRow("reduce", "Continue mastery \u2192 Visualize")
        );
        bindContinue("reduce");
      }
    } else if (activeStage === "visualize") {
      renderVisualize(panel, repo2, passage, (updated) => {
        Object.assign(passage, updated);
        renderTraining(root, repo2, passageId, callbacks, "visualize");
      });
      if (isComplete(passage, "visualize")) {
        panel.insertAdjacentHTML(
          "beforeend",
          continueRow("visualize", "Continue mastery \u2192 Reconstruct")
        );
        bindContinue("visualize");
      }
    } else if (activeStage === "reconstruct") {
      renderReconstruct(panel, repo2, passage, (updated) => {
        Object.assign(passage, updated);
        renderTraining(root, repo2, passageId, callbacks, "reconstruct");
      });
    } else if (activeStage === "recall") {
      renderRecall(panel, repo2, passage, (updated) => {
        Object.assign(passage, updated);
        if (trainingUi.activeTrack === "practice") return;
        renderTraining(root, repo2, passageId, callbacks, "recall");
      });
    } else if (activeStage === "master") {
      renderMaster(panel, repo2, passage, (updated) => {
        Object.assign(passage, updated);
        go("read", "mastery");
      });
    }
  }
  function syncSegments(repo2, passage) {
    const segments = ensureSegments(passage.text, passage.segments);
    if (segments === passage.segments) return passage;
    const doc = repo2.load();
    const updated = {
      ...passage,
      segments,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    doc.passages = doc.passages.map((p) => p.id === updated.id ? updated : p);
    repo2.save(doc);
    return updated;
  }
  function markStage(repo2, passage, stage) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      ...passage,
      stageProgress: {
        ...passage.stageProgress,
        [stage]: { completed: true, updatedAt: now }
      },
      updatedAt: now
    };
    updated.stats = {
      ...updated.stats,
      memorizationPercent: computeMemorizationPercent(updated)
    };
    savePassage(repo2, updated);
    return updated;
  }
  function savePassage(repo2, passage) {
    const doc = repo2.load();
    doc.passages = doc.passages.map((p) => p.id === passage.id ? passage : p);
    repo2.save(doc);
  }
  function renderRead(panel, _repo, passage, onContinue) {
    const empty = passage.segments.length === 0 || !passage.text.trim();
    panel.innerHTML = `
    <h2>Read</h2>
    ${empty ? `<p class="empty">This passage has no text yet. Go to <strong>Library</strong>, edit it, and paste the wording you want to memorize.</p>
           <div class="row stage-next-row"><button class="btn stage-next" type="button" id="mark-read" disabled>Mark Read complete \u2192 Understand</button></div>` : `<p class="empty">Read the full passage with segment markers. Absorb cadence before reducing.</p>
           <ol class="segment-list">
             ${passage.segments.map((s) => `<li><span class="seg-idx">${s.index + 1}</span> ${esc2(s.text)}</li>`).join("")}
           </ol>
           <div class="row stage-next-row">
             <button class="btn stage-next" type="button" id="mark-read">Mark Read complete \u2192 Continue mastery</button>
           </div>`}
  `;
    panel.querySelector("#mark-read")?.addEventListener("click", () => {
      if (empty) return;
      onContinue();
    });
  }
  function renderUnderstand(panel, repo2, passage, onSaved) {
    if (passage.segments.length === 0) {
      panel.innerHTML = `<h2>Understand</h2><p class="empty">Add passage text first (Library \u2192 Edit), then return here.</p>`;
      return;
    }
    panel.innerHTML = `
    <h2>Understand</h2>
    <p class="empty">Optional: jot a meaning, emotion, or cue for any segment that helps you. Leave the rest blank if you like.</p>
    <div class="grid" id="notes">
      ${passage.segments.map(
      (s) => `<label>Segment ${s.index + 1}: ${esc2(s.text)}
            <textarea data-note="${s.id}" placeholder="Meaning, emotion, or cue (optional)">${esc2(passage.segmentNotes[s.id] ?? "")}</textarea>
          </label>`
    ).join("")}
    </div>
    <div class="row stage-next-row">
      <button class="btn ${isComplete(passage, "understand") ? "secondary" : "stage-next"}" type="button" id="save-notes">${isComplete(passage, "understand") ? "Save notes" : "Save &amp; complete Understand"}</button>
      <span class="toast" id="notes-toast" hidden></span>
    </div>
  `;
    panel.querySelector("#save-notes")?.addEventListener("click", () => {
      const notes = { ...passage.segmentNotes };
      panel.querySelectorAll("[data-note]").forEach((el) => {
        notes[el.dataset.note] = el.value;
      });
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const updated = {
        ...passage,
        segmentNotes: notes,
        stageProgress: {
          ...passage.stageProgress,
          understand: { completed: true, updatedAt: now }
        },
        updatedAt: now
      };
      savePassage(repo2, updated);
      const toast = panel.querySelector("#notes-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Understand complete.";
      }
      onSaved(updated);
    });
  }
  function renderReconstruct(panel, repo2, passage, onDone) {
    if (passage.segments.length < 2) {
      panel.innerHTML = `<h2>Reconstruct</h2><p class="empty">Need at least two segments to practice ordering. Add more text in Library \u2192 Edit.</p>`;
      return;
    }
    const correct = toOrderItems(passage.segments);
    const correctIds = correct.map((c) => c.id);
    let order = shuffleItems(correct);
    let selected = 0;
    let hintsUsed = 0;
    const hintEvents = [];
    let checked = null;
    let cueMode = "first_word";
    let message = "Drag the cards into the correct order, then check.";
    const startedAt = Date.now();
    const paint = () => {
      panel.innerHTML = `
      <h2>Reconstruct</h2>
      <p class="empty"><strong>Put the passage back in order.</strong> The cards are shuffled \u2014 drag them (or use \u2191/\u2193) until the sequence matches the original. A card shows a cue until it sits in the right slot; then it expands to the full segment. Hint clicks and choosing <strong>Full segment</strong> each count as hints.</p>
      <label>Card cue while out of place
        <select id="reconstruct-cue">
          <option value="first_word" ${cueMode === "first_word" ? "selected" : ""}>First word</option>
          <option value="keywords" ${cueMode === "keywords" ? "selected" : ""}>Keywords</option>
          <option value="full" ${cueMode === "full" ? "selected" : ""}>Full segment (counts as hint)</option>
        </select>
      </label>
      <p class="stats-line">Hints this attempt: <strong id="hint-count">${hintsUsed}</strong> \xB7 Best: <strong>${passage.stats.bestHintCount ?? "\u2014"}</strong> \xB7 Zero-hint wins: <strong>${passage.stats.zeroHintCompletions}</strong></p>
      <p class="order-legend"><span class="order-legend-cue">Cue</span> = still rearranging \xB7 <span class="order-legend-full">Full line</span> = correct place</p>
      <ul class="order-list" id="order-list" aria-label="Shuffled segments \u2014 rearrange into the correct order">
        ${order.map((item, i) => {
        const inPlace = item.id === correctIds[i];
        const label = reconstructCardLabel(item.text, cueMode, inPlace);
        const cls = [
          selected === i ? "selected" : "",
          inPlace ? "in-place" : "out-of-place",
          label.revealed ? "revealed" : "cue-only",
          checked ? checked[i] ? "correct" : "wrong" : ""
        ].filter(Boolean).join(" ");
        return `<li class="order-item ${cls}" draggable="true" tabindex="0" data-index="${i}" data-id="${item.id}">
              <span class="seg-idx" title="Current slot ${i + 1}">${i + 1}</span>
              <span class="order-card-body">
                <span class="order-card-meta">${label.revealed ? "Full segment \xB7 slot correct" : "Cue \xB7 rearrange"}</span>
                <span class="order-card-text">${esc2(label.text)}</span>
              </span>
            </li>`;
      }).join("")}
      </ul>
      <div class="row">
        <button class="btn ${isComplete(passage, "reconstruct") ? "secondary" : ""}" type="button" id="check-order">Check order</button>
        <button class="btn secondary" type="button" id="hint-btn">Hint (place next segment)</button>
        <button class="btn secondary" type="button" id="reshuffle">Reshuffle</button>
        <button class="btn secondary" type="button" id="reset-order">Reset attempt</button>
      </div>
      <p class="toast" id="order-toast">${esc2(message)}</p>
      ${isComplete(passage, "reconstruct") ? trainingUi.activeTrack === "practice" ? `<p class="empty stage-practice-status">Try another technique/phase</p>` : `<div class="row stage-next-row"><button class="btn stage-next" type="button" id="continue-recall">Continue \u2192 Recall</button></div>` : ""}
    `;
      panel.querySelector("#reconstruct-cue")?.addEventListener("change", (e) => {
        const next = e.target.value;
        if (next === "full" && cueMode !== "full" && !hintEvents.some((h) => h.kind === "full_cue")) {
          hintsUsed += 1;
          hintEvents.push({
            kind: "full_cue",
            at: (/* @__PURE__ */ new Date()).toISOString(),
            detail: "Switched card cue to Full segment"
          });
        }
        cueMode = next;
        paint();
      });
      let dragFrom = null;
      panel.querySelectorAll(".order-item").forEach((el) => {
        el.addEventListener("dragstart", () => {
          dragFrom = Number(el.dataset.index);
        });
        el.addEventListener("dragover", (e) => e.preventDefault());
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          const to = Number(el.dataset.index);
          if (dragFrom === null || Number.isNaN(to)) return;
          order = moveItem(order, dragFrom, to);
          checked = null;
          selected = to;
          paint();
        });
        el.addEventListener("click", () => {
          selected = Number(el.dataset.index);
          paint();
        });
        el.addEventListener("keydown", (e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            order = moveItem(order, selected, Math.max(0, selected - 1));
            selected = Math.max(0, selected - 1);
            checked = null;
            paint();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            order = moveItem(order, selected, Math.min(order.length - 1, selected + 1));
            selected = Math.min(order.length - 1, selected + 1);
            checked = null;
            paint();
          }
        });
      });
      panel.querySelector("#check-order")?.addEventListener("click", () => {
        const grade = gradeOrder(
          order.map((o) => o.id),
          correctIds
        );
        checked = grade.correctPositions;
        if (grade.allCorrect) {
          let updated = recordAttempt(passage, {
            stage: "reconstruct",
            hintsUsed,
            hintEvents: hintEvents.slice(),
            durationMs: Date.now() - startedAt,
            success: true
          });
          updated = {
            ...updated,
            stageProgress: {
              ...updated.stageProgress,
              reconstruct: { completed: true, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
            }
          };
          savePassage(repo2, updated);
          Object.assign(passage, updated);
          message = hintsUsed === 0 ? "Perfect order \u2014 zero hints!" : `Correct order with ${hintsUsed} hint(s). Aim for 0 next time.`;
          onDone(updated);
          return;
        }
        message = "Not in order yet \u2014 green slots are right; keep rearranging the rest.";
        paint();
      });
      panel.querySelector("#hint-btn")?.addEventListener("click", () => {
        const result = applyHint(
          order.map((o) => o.id),
          correctIds
        );
        if (result.hintedIndex === -1) {
          message = "Everything is already in order.";
          paint();
          return;
        }
        hintsUsed += 1;
        hintEvents.push({
          kind: "place_hint",
          at: (/* @__PURE__ */ new Date()).toISOString(),
          detail: `Hint button placed the correct segment in slot ${result.hintedIndex + 1}`
        });
        order = result.ids.map((id) => correct.find((c) => c.id === id));
        checked = null;
        selected = result.hintedIndex;
        message = `Hint: placed the correct segment in slot ${result.hintedIndex + 1}. Keep rearranging.`;
        paint();
      });
      panel.querySelector("#reshuffle")?.addEventListener("click", () => {
        order = shuffleItems(correct);
        checked = null;
        message = "Reshuffled \u2014 rearrange the cards into the correct order.";
        paint();
      });
      panel.querySelector("#reset-order")?.addEventListener("click", () => {
        order = shuffleItems(correct);
        hintsUsed = 0;
        hintEvents.length = 0;
        checked = null;
        cueMode = "first_word";
        message = "Attempt reset \u2014 rearrange from scratch.";
        paint();
      });
      panel.querySelector("#continue-recall")?.addEventListener("click", () => {
        history.replaceState(null, "", `#passage/${passage.id}/recall`);
        window.dispatchEvent(new Event("hashchange"));
      });
    };
    paint();
  }
  function renderRecall(panel, repo2, passage, onDone) {
    let level = "none";
    let reveal = false;
    let draftText = "";
    let lastCheck = null;
    const startedAt = Date.now();
    let hintsUsed = 0;
    const hintEvents = [];
    const paint = () => {
      const cue = localReduction(level, passage.text, passage.reductions[level]);
      const practiceTrack = trainingUi.activeTrack === "practice";
      const practiceDone = practiceTrack && (lastCheck?.ok || isComplete(passage, "recall"));
      const toastText = lastCheck ? lastCheck.ok ? `${lastCheck.pct}% \u2014 you're done${lastCheck.hintsUsed ? ` (${lastCheck.hintsUsed} hint(s))` : ""}.` : `Not yet (${lastCheck.pct}% match). Keep the wording closer to the original.` : "";
      panel.innerHTML = `
      <h2>Recall</h2>
      <p class="empty">Type the passage from memory. Checking is <strong>case-insensitive</strong> and <strong>lax about punctuation</strong> \u2014 but key words still need to be there. Revealing the original counts as a hint; changing the cue dropdown does not.</p>
      <label>Cue level (does not count as a hint)
        <select id="recall-level">
          ${REDUCTION_LEVELS.map((l) => `<option value="${l.id}" ${l.id === level ? "selected" : ""}>${l.label}</option>`).join("")}
        </select>
      </label>
      <pre class="cue-pre">${esc2(cue || "(no hints)")}</pre>
      <label>Your recall
        <textarea id="recall-text" placeholder="Type what you remember\u2026">${esc2(draftText)}</textarea>
      </label>
      ${reveal ? `<pre class="cue-pre original">${esc2(passage.text)}</pre>` : ""}
      <div class="row">
        <button class="btn secondary" type="button" id="recall-reveal">${reveal ? "Hide original" : "Reveal original (counts as hint)"}</button>
        <button class="btn ${isComplete(passage, "recall") || lastCheck?.ok ? "secondary" : ""}" type="button" id="recall-done">Check recall</button>
      </div>
      <p class="stats-line">Hints this attempt: <strong>${hintsUsed}</strong></p>
      <p class="toast" id="recall-toast" ${toastText ? "" : "hidden"}>${esc2(toastText)}</p>
      ${practiceDone ? `<p class="empty stage-practice-status">Try another technique/phase</p>` : isComplete(passage, "recall") ? `<div class="row stage-next-row"><button class="btn stage-next" type="button" id="continue-master">Continue \u2192 Master</button></div>` : ""}
    `;
      panel.querySelector("#recall-level")?.addEventListener("change", (e) => {
        level = e.target.value;
        paint();
      });
      panel.querySelector("#recall-reveal")?.addEventListener("click", () => {
        if (!reveal) {
          hintsUsed += 1;
          hintEvents.push({
            kind: "reveal_original",
            at: (/* @__PURE__ */ new Date()).toISOString(),
            detail: "Revealed the full original passage"
          });
        }
        reveal = !reveal;
        paint();
      });
      panel.querySelector("#recall-done")?.addEventListener("click", () => {
        const text = panel.querySelector("#recall-text")?.value ?? "";
        draftText = text;
        const grade = gradeRecall(passage.text, text);
        if (grade.empty) {
          lastCheck = null;
          const toast = panel.querySelector("#recall-toast");
          if (toast) {
            toast.hidden = false;
            toast.textContent = "Type your recall before checking.";
          }
          return;
        }
        lastCheck = {
          ok: grade.ok,
          pct: Math.round(grade.similarity * 100),
          hintsUsed
        };
        let updated = recordAttempt(passage, {
          stage: "recall",
          hintsUsed,
          hintEvents: hintEvents.slice(),
          durationMs: Date.now() - startedAt,
          success: grade.ok
        });
        if (grade.ok) {
          updated = {
            ...updated,
            stageProgress: {
              ...updated.stageProgress,
              recall: { completed: true, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
            }
          };
        }
        savePassage(repo2, updated);
        Object.assign(passage, updated);
        if (grade.ok && practiceTrack) {
          paint();
          onDone(updated);
          return;
        }
        if (grade.ok) {
          onDone(updated);
          return;
        }
        paint();
      });
      panel.querySelector("#continue-master")?.addEventListener("click", () => {
        history.replaceState(null, "", `#passage/${passage.id}/master`);
        location.hash = `#passage/${passage.id}/master`;
        window.dispatchEvent(new Event("hashchange"));
      });
    };
    paint();
  }
  function renderMaster(panel, repo2, passage, onResetToRead) {
    const checklist = STAGE_ORDER.map((s) => ({
      id: s,
      done: isComplete(passage, s) || s === "master" && Boolean(passage.masteredAt)
    }));
    const zeroHint = passage.stats.zeroHintCompletions > 0;
    const ready = checklist.filter((c) => c.id !== "master").every((c) => c.done) && zeroHint;
    const scoredAttempts = passage.attempts.filter((a) => a.stage === "reconstruct" || a.stage === "recall");
    panel.innerHTML = `
    <h2>Master</h2>
    <p class="empty">Mastery means every stage is truly completed and you have a <strong>correct zero-hint</strong> Reconstruct or Recall win. Hints include <strong>hint buttons you click</strong> and <strong>revealing the full segment/original</strong> (including Full-segment cue on Reconstruct). Changing cue format dropdowns on Reduce/Recall does not count as a hint.</p>
    <p class="stats-line">
      Zero-hint wins: <strong>${passage.stats.zeroHintCompletions}</strong>
      \xB7 Best hints on a win: <strong>${passage.stats.bestHintCount ?? "\u2014"}</strong>
      \xB7 Mem %: <strong>${passage.stats.memorizationPercent}</strong>
      \xB7 Reduce proficiency: <strong>${esc2(reduceProficiencyLabel(passage.reduceProficiency))}</strong>
      \xB7 <button type="button" class="linkish" id="hint-details">Details</button>
    </p>
    <ul class="segment-list">
      ${checklist.map(
      (c) => `<li><span class="seg-idx">${c.done ? "\u2713" : "\xB7"}</span> ${c.id}${c.id === "master" ? " (this gate)" : ""}</li>`
    ).join("")}
      <li><span class="seg-idx">${zeroHint ? "\u2713" : "\xB7"}</span> At least one correct zero-hint completion</li>
    </ul>
    <div class="row stage-next-row">
      <button class="btn stage-next" type="button" id="mark-master" ${ready ? "" : "disabled"}>Mark mastered</button>
      <button class="btn danger" type="button" id="reset-mastery">Reset mastery</button>
    </div>
    <p class="toast" id="master-toast">${passage.masteredAt ? "Mastered. Reset anytime to train again from Read." : ready ? "Ready to mark mastery." : "Finish the mastery path stages in order and earn a correct zero-hint win first. You can still practice any mode while you work toward that."}</p>
  `;
    panel.querySelector("#hint-details")?.addEventListener("click", () => {
      const body = scoredAttempts.length === 0 ? `<p>No Reconstruct or Recall attempts recorded yet.</p>
           <p>Hints count when you click a hint button, reveal the original text, or use the Full-segment cue while rearranging.</p>` : `<p>Each attempt below lists what counted toward its hint total.</p>
           <ul class="hint-attempt-list">
             ${scoredAttempts.slice().reverse().map((a) => {
        const when = new Date(a.completedAt).toLocaleString();
        const events = a.hintEvents?.length ? `<ul>${a.hintEvents.map(
          (h) => `<li><strong>${esc2(hintKindLabel(h.kind))}</strong> \u2014 ${esc2(h.detail)} <span class="empty">(${esc2(new Date(h.at).toLocaleString())})</span></li>`
        ).join("")}</ul>` : a.hintsUsed === 0 ? `<p class="empty">No hints on this attempt.</p>` : `<p class="empty">${a.hintsUsed} hint(s) (details unavailable for this older attempt).</p>`;
        return `<li class="hint-attempt">
                   <strong>${esc2(a.stage)}</strong>
                   \xB7 ${a.success ? "success" : "miss"}
                   \xB7 ${a.hintsUsed} hint(s)${a.zeroHint ? " \xB7 zero-hint win" : ""}
                   \xB7 <span class="empty">${esc2(when)}</span>
                   ${events}
                 </li>`;
      }).join("")}
           </ul>`;
      openHelpModal("Hint details", body);
    });
    panel.querySelector("#mark-master")?.addEventListener("click", () => {
      if (!ready) return;
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const updated = {
        ...passage,
        masteredAt: now,
        stageProgress: {
          ...passage.stageProgress,
          master: { completed: true, updatedAt: now }
        },
        updatedAt: now
      };
      updated.stats = {
        ...updated.stats,
        memorizationPercent: Math.max(updated.stats.memorizationPercent, 100)
      };
      savePassage(repo2, updated);
      Object.assign(passage, updated);
      const toast = panel.querySelector("#master-toast");
      if (toast) toast.textContent = "Mastered. Keep drilling to stay sharp.";
      panel.querySelector("#mark-master").disabled = true;
    });
    panel.querySelector("#reset-mastery")?.addEventListener("click", () => {
      openHelpModal(
        "Reset mastery?",
        `<p>This clears mastery, sets hints/wins back to <strong>0</strong>, unlocks stages from the start, and returns you to <strong>Read</strong>.</p>
       <p>Choose whether to keep study content you filled in (notes, ChatGPT reductions, visual anchors / image URLs).</p>
       <div class="row modal-actions">
         <button type="button" class="btn" id="reset-keep">Keep filled info</button>
         <button type="button" class="btn danger" id="reset-clear">Reset filled info too</button>
         <button type="button" class="btn secondary" id="reset-cancel">Cancel</button>
       </div>`
      );
      const modal = document.getElementById("app-help-modal");
      const finish = (mode) => {
        const updated = resetMastery(passage, mode);
        savePassage(repo2, updated);
        modal?.remove();
        onResetToRead(updated);
      };
      modal?.querySelector("#reset-keep")?.addEventListener("click", () => finish("keep_content"));
      modal?.querySelector("#reset-clear")?.addEventListener("click", () => finish("clear_content"));
      modal?.querySelector("#reset-cancel")?.addEventListener("click", () => modal.remove());
    });
  }
  function openHelpModal(title, bodyHtml, opts = {}) {
    document.getElementById("app-help-modal")?.remove();
    const backdrop = document.createElement("div");
    backdrop.id = "app-help-modal";
    backdrop.className = "modal-backdrop";
    const modalClass = opts.media ? "modal modal-media" : "modal";
    backdrop.innerHTML = `
    <div class="${modalClass}" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
      <div class="modal-head">
        <h3 id="help-modal-title">${esc2(title)}</h3>
        <button type="button" class="btn secondary modal-close" aria-label="Close">Close</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
    </div>
  `;
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });
    backdrop.querySelector(".modal-close")?.addEventListener("click", close);
    document.addEventListener(
      "keydown",
      function onKey(ev) {
        if (ev.key === "Escape") {
          close();
          document.removeEventListener("keydown", onKey);
        }
      }
    );
    document.body.appendChild(backdrop);
    backdrop.querySelector(".modal-close")?.focus();
  }
  function isHostLockedImageUrl(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      const path = u.pathname.toLowerCase();
      const chatgptHost =
        host === "chatgpt.com" ||
        host.endsWith(".chatgpt.com") ||
        host === "openai.com" ||
        host.endsWith(".openai.com");
      // Private ChatGPT file links need login; shared-thread image URLs can work.
      return chatgptHost && (path.includes("/backend-api/") || path.includes("/estuary/"));
    } catch {
      return false;
    }
  }
  function chatgptImageUrlHelpHtml() {
    return `<p>ChatGPT private image links (for example <code>chatgpt.com/backend-api/\u2026</code>) need a login, so they will not preview here.</p>
      <p>To get a URL that works:</p>
      <ol>
        <li>In ChatGPT, <strong>Share</strong> the thread</li>
        <li>Open the <strong>shared</strong> thread link</li>
        <li>Open the image in a <strong>new tab</strong></li>
        <li>Copy that tab\u2019s URL and paste it here</li>
      </ol>`;
  }
  function openImageModal(title, imageUrl) {
    if (isHostLockedImageUrl(imageUrl)) {
      openHelpModal(
        title,
        `${chatgptImageUrlHelpHtml()}
         <p><a class="btn" href="${esc2(imageUrl)}" target="_blank" rel="noopener noreferrer">Open saved link</a></p>`
      );
      return;
    }
    openHelpModal(
      title,
      `<figure class="visual-modal-figure">
        <img src="${esc2(imageUrl)}" alt="${esc2(title)}" referrerpolicy="no-referrer" />
        <figcaption><a href="${esc2(imageUrl)}" target="_blank" rel="noopener noreferrer">Open in new tab</a></figcaption>
      </figure>`,
      { media: true }
    );
  }
  function renderVisualize(panel, repo2, passage, onChanged) {
    if (passage.segments.length === 0) {
      panel.innerHTML = `<h2>Visualize</h2><p class="empty">Add passage text first, then build visual anchors.</p>`;
      return;
    }
    const noteFilled = (a) => Boolean(a?.userNote?.trim() || a?.imageUrl?.trim());
    const paint = () => {
      const saved = passage.segments.filter(
        (s) => noteFilled(passage.visualAnchors.find((a) => a.segmentId === s.id))
      ).length;
      panel.innerHTML = `
      <h2>Visualize</h2>
      <p class="empty">Optional: build a mental picture for any segment that helps. Copy a prompt into ChatGPT, generate an image if you want, then <strong>Share the thread</strong>, open the shared thread, open the image in a new tab, and paste that URL here (private ChatGPT file links need login and will not preview). Saved anchors collapse \u2014 expand to update or reset (${saved} saved).</p>
      <div class="grid">
        ${passage.segments.map((seg) => {
        const anchor = passage.visualAnchors.find((a) => a.segmentId === seg.id);
        const concept = anchor?.concept || inferConcept(seg.text);
        const prompt = anchor?.imagePrompt || buildImagePrompt(seg, concept);
        const noteOrUrl = anchor?.userNote || anchor?.imageUrl || "";
        const imageUrl = anchor?.imageUrl?.trim() || (/^https?:\/\//i.test(noteOrUrl.trim()) ? noteOrUrl.trim() : "");
        const hostLocked = Boolean(imageUrl && isHostLockedImageUrl(imageUrl));
        const canEmbed = Boolean(imageUrl && !hostLocked);
        const filled = noteFilled(anchor);
        const notePreview = !imageUrl && noteOrUrl.trim() ? noteOrUrl.trim() : "";
        const savedAt = filled ? anchor?.updatedAt : void 0;
        const mediaClass = canEmbed ? "has-thumb" : hostLocked ? "has-link" : "";
        return `<article class="visual-card">
              <h3 class="visual-card-label">Segment ${seg.index + 1} ${filled ? "\u2713" : ""}</h3>
              <p class="visual-segment-text">${esc2(seg.text)}</p>
              <details class="visual-help ${filled ? "is-ready" : "is-missing"}" ${filled ? "" : "open"}>
                <summary class="visual-help-head ${mediaClass}">
                  ${canEmbed ? `<button type="button" class="visual-thumb-btn" data-open-image="${seg.id}" aria-label="Open image preview">
                    <img class="visual-thumb" src="${esc2(imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-thumb-img="${seg.id}" />
                  </button>` : hostLocked ? `<button type="button" class="visual-link-chip" data-open-image="${seg.id}">Why no preview?</button>` : ""}
                  <span class="visual-help-title">
                    <span class="visual-help-status">${filled ? "Visual anchor saved locally" : "Visual anchor (optional)"}</span>
                    <span class="visual-help-hint">${filled ? hostLocked ? "Private ChatGPT link \u2014 Share the thread, open the shared image URL instead" : "Collapsed \u2014 expand to update or reset" : "Expand to add a note or image URL"}</span>
                    ${notePreview ? `<span class="visual-note-snip">${esc2(notePreview.length > 72 ? `${notePreview.slice(0, 72)}\u2026` : notePreview)}</span>` : ""}
                  </span>
                  <span class="req-badge ${filled ? "ok" : "missing"}">${filled ? "Saved" : "Optional"}</span>
                </summary>
                <div class="visual-help-body">
                  ${filled ? `<p class="empty visual-help-alt">This note/image stays with the passage until you reset it.${savedAt ? ` Last saved ${esc2(new Date(savedAt).toLocaleString())}.` : ""}</p>` : ""}
                  <label>Visual concept
                    <input data-concept="${seg.id}" value="${esc2(concept)}" />
                  </label>
                  <label>Image prompt
                    <textarea data-prompt="${seg.id}" readonly>${esc2(prompt)}</textarea>
                  </label>
                  <div class="row prompt-actions">
                    <button class="btn secondary" type="button" data-copy="${seg.id}">1. Copy image prompt</button>
                    <a class="btn secondary" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">2. Open ChatGPT</a>
                  </div>
                  <label>
                    <span class="label-row">
                      <span class="label-text">Your note / image URL <span class="optional-tag">(optional)</span></span>
                      <button type="button" class="help-icon" data-help-note="${seg.id}" aria-label="What goes in note or image URL?">?</button>
                    </span>
                    <input data-note="${seg.id}" placeholder="Short note or https://\u2026 image URL" value="${esc2(noteOrUrl)}" />
                  </label>
                  ${canEmbed ? `<button type="button" class="visual-preview-btn" data-open-image="${seg.id}" aria-label="Open larger image preview">
                    <img class="visual-preview-sm" src="${esc2(imageUrl)}" alt="Saved image for segment ${seg.index + 1}" loading="lazy" referrerpolicy="no-referrer" data-preview-img="${seg.id}" />
                    <span>Click to enlarge</span>
                  </button>` : hostLocked ? `<div class="visual-help-alt">${chatgptImageUrlHelpHtml()}
                    <p><button type="button" class="linkish" data-open-image="${seg.id}">Open saved link</button></p>
                  </div>` : ""}
                  <div class="row">
                    <button class="btn" type="button" data-save="${seg.id}">${filled ? "Update saved anchor" : "Save anchor"}</button>
                    ${filled ? `<button class="btn danger" type="button" data-reset-anchor="${seg.id}">Reset saved note/image</button>` : ""}
                  </div>
                </div>
              </details>
            </article>`;
      }).join("")}
      </div>
      <div class="row stage-next-row">
        <button class="btn ${isComplete(passage, "visualize") ? "secondary" : "stage-next"}" type="button" id="mark-visualize">${isComplete(passage, "visualize") ? "Visualize completed" : "Mark Visualize complete"}</button>
        <span class="toast" id="viz-toast" hidden></span>
      </div>
    `;
      const toast = (msg) => {
        const el = panel.querySelector("#viz-toast");
        if (!el) return;
        el.hidden = false;
        el.textContent = msg;
      };
      const imageUrlFor = (id) => {
        const anchor = passage.visualAnchors.find((a) => a.segmentId === id);
        const noteOrUrl = anchor?.userNote || anchor?.imageUrl || "";
        return anchor?.imageUrl?.trim() || (/^https?:\/\//i.test(noteOrUrl.trim()) ? noteOrUrl.trim() : "");
      };
      panel.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.copy;
          const text = panel.querySelector(`[data-prompt="${id}"]`)?.value ?? "";
          await navigator.clipboard.writeText(text);
          toast("Image prompt copied \u2014 open ChatGPT and paste it.");
        });
      });
      panel.querySelectorAll("[data-help-note]").forEach((btn) => {
        btn.addEventListener("click", () => {
          openHelpModal(
            "Your note / image URL",
            `<p>This field is optional. Use it in either of these ways:</p>
           <ul>
             <li><strong>Note</strong> \u2014 a short reminder of the picture in your mind (for example, \u201Cfather on a high throne\u201D).</li>
             <li><strong>Image URL</strong> \u2014 a link to the picture (for an in-app thumbnail).</li>
           </ul>
           <p>After ChatGPT generates an image:</p>
           <ol>
             <li><strong>Share</strong> the thread</li>
             <li>Open the <strong>shared</strong> thread</li>
             <li>Open the image in a <strong>new tab</strong></li>
             <li>Copy that URL and paste it here, then Save anchor</li>
           </ol>
           <p>If you paste a private ChatGPT file link instead (<code>backend-api</code> / estuary), it will not preview here because that URL requires authentication.</p>`
          );
        });
      });
      panel.querySelectorAll("[data-open-image]").forEach((btn) => {
        const open = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.dataset.openImage;
          const url = imageUrlFor(id);
          if (!url) return;
          const seg = passage.segments.find((s) => s.id === id);
          openImageModal(seg ? `Segment ${seg.index + 1} image` : "Image preview", url);
        };
        btn.addEventListener("mousedown", (e) => e.stopPropagation());
        btn.addEventListener("click", open);
      });
      panel.querySelectorAll("[data-save]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.save;
          const seg = passage.segments.find((s) => s.id === id);
          if (!seg) return;
          const concept = panel.querySelector(`[data-concept="${id}"]`)?.value || inferConcept(seg.text);
          const prompt = panel.querySelector(`[data-prompt="${id}"]`)?.value || buildImagePrompt(seg, concept);
          const note = panel.querySelector(`[data-note="${id}"]`)?.value?.trim() || void 0;
          if (!note) {
            toast("Add a note or image URL before saving, or leave this segment blank.");
            return;
          }
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const imageUrl = /^https?:\/\//i.test(note) ? note : void 0;
          const anchor = {
            segmentId: id,
            concept,
            imagePrompt: prompt,
            userNote: note,
            imageUrl,
            updatedAt: now
          };
          const others = passage.visualAnchors.filter((a) => a.segmentId !== id);
          const updated = {
            ...passage,
            visualAnchors: [...others, anchor],
            updatedAt: now
          };
          savePassage(repo2, updated);
          Object.assign(passage, updated);
          toast(
            imageUrl && isHostLockedImageUrl(imageUrl)
              ? "Saved, but that ChatGPT file link needs login \u2014 Share the thread and paste the shared image URL for a preview."
              : "Visual anchor saved."
          );
          onChanged(updated);
        });
      });
      panel.querySelectorAll("[data-reset-anchor]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.resetAnchor;
          const existing = passage.visualAnchors.find((a) => a.segmentId === id);
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const others = passage.visualAnchors.filter((a) => a.segmentId !== id);
          const nextAnchors = existing ? [
            ...others,
            {
              ...existing,
              userNote: void 0,
              imageUrl: void 0,
              updatedAt: now
            }
          ] : others;
          const updated = {
            ...passage,
            visualAnchors: nextAnchors,
            updatedAt: now
          };
          savePassage(repo2, updated);
          Object.assign(passage, updated);
          toast("Saved note/image reset.");
          onChanged(updated);
        });
      });
      panel.querySelectorAll("[data-thumb-img]").forEach((img) => {
        img.addEventListener("error", () => {
          const wrap = img.closest(".visual-thumb-btn");
          const head = img.closest(".visual-help-head");
          const id = wrap?.dataset.openImage || img.dataset.thumbImg;
          const url = imageUrlFor(id);
          if (!wrap || !head || !url) return;
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "visual-link-chip";
          chip.dataset.openImage = id;
          chip.textContent = "Open image link";
          chip.addEventListener("mousedown", (e) => e.stopPropagation());
          chip.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const seg = passage.segments.find((s) => s.id === id);
            openImageModal(seg ? `Segment ${seg.index + 1} image` : "Image preview", url);
          });
          wrap.replaceWith(chip);
          head.classList.remove("has-thumb");
          head.classList.add("has-link");
          const hint = head.querySelector(".visual-help-hint");
          if (hint) hint.textContent = "Preview blocked \u2014 Share the ChatGPT thread, then paste the shared image URL";
        });
      });
      panel.querySelectorAll("[data-preview-img]").forEach((img) => {
        img.addEventListener("error", () => {
          const wrap = img.closest(".visual-preview-btn");
          if (!wrap) return;
          const id = wrap.dataset.openImage;
          const url = imageUrlFor(id);
          wrap.replaceWith(
            Object.assign(document.createElement("p"), {
              className: "empty visual-help-alt",
              innerHTML: url ? `Preview could not load. <button type="button" class="linkish" data-open-image="${esc2(id)}">Open image link</button>` : "Preview could not load."
            })
          );
          panel.querySelectorAll(`[data-open-image="${id}"]`).forEach((btn) => {
            if (btn.dataset.boundOpen) return;
            btn.dataset.boundOpen = "1";
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!url) return;
              const seg = passage.segments.find((s) => s.id === id);
              openImageModal(seg ? `Segment ${seg.index + 1} image` : "Image preview", url);
            });
          });
        });
      });
      panel.querySelectorAll("[data-concept]").forEach((input) => {
        input.addEventListener("change", () => {
          const id = input.dataset.concept;
          const seg = passage.segments.find((s) => s.id === id);
          if (!seg) return;
          const area = panel.querySelector(`[data-prompt="${id}"]`);
          if (area) area.value = buildImagePrompt(seg, input.value);
        });
      });
      panel.querySelector("#mark-visualize")?.addEventListener("click", () => {
        const updated = markStage(repo2, passage, "visualize");
        Object.assign(passage, updated);
        toast("Visualize complete.");
        onChanged(updated);
      });
    };
    paint();
  }
  function initialReduceLevel(passage) {
    if (passage.reductions.keywords?.trim()) return "keywords";
    if (passage.reductions.essential?.trim()) return "essential";
    const last = passage.reductionMeta?.lastLevel;
    if (last && REDUCTION_LEVELS.some((l) => l.id === last)) return last;
    return "first_words";
  }
  function renderReduce(panel, repo2, passage, onChanged) {
    let level = initialReduceLevel(passage);
    let proficiency = passage.reduceProficiency && REDUCE_PROFICIENCY.some((p) => p.id === passage.reduceProficiency) ? passage.reduceProficiency : level === "full" ? "first_words" : level;
    let reveal = false;
    const canComplete = (prof) => {
      if (!prof || !REDUCE_PROFICIENCY.some((p) => p.id === prof)) {
        return { ok: false, reason: "Choose the cue format you are proficient with (not Full text)." };
      }
      const meta = REDUCTION_LEVELS.find((l) => l.id === prof);
      if (meta?.needsPaste && !passage.reductions[prof]?.trim()) {
        return {
          ok: false,
          reason: "Save a ChatGPT reduction for that proficiency level first (or pick First words / First letters / No hints)."
        };
      }
      return { ok: true, reason: "" };
    };
    const paint = (notice) => {
      const cue = localReduction(level, passage.text, passage.reductions[level]);
      const meta = REDUCTION_LEVELS.find((l) => l.id === level);
      const pastedSaved = Boolean(passage.reductions[level]?.trim());
      const needsPaste = meta.needsPaste;
      const pasteMissing = needsPaste && !pastedSaved;
      const pasteMode = level === "keywords" ? "keywords" : "essential";
      const savedAt = pastedSaved ? passage.reductionMeta?.updatedAt : void 0;
      const profMeta = REDUCTION_LEVELS.find((l) => l.id === proficiency);
      const profPasteMissing = Boolean(profMeta?.needsPaste && !passage.reductions[proficiency]?.trim());
      panel.innerHTML = `
      <h2>Reduce</h2>
      <p class="empty">Practice recalling from different cue formats \u2014 from Essentials (expanded) down to Essentials (condensed), first letters, or no hints. Speak or recite from the cue, then reveal the original to check yourself. <strong>Changing this dropdown does not count as a hint.</strong> When you mark practiced, declare the hardest format you can reliably use \u2014 that choice feeds mastery points (First letters scores highest).</p>
      <br/>
      <label>Cue format to practice from (not a hint):
        <select id="level">
          ${REDUCTION_LEVELS.map((l) => {
        const hasSaved = l.needsPaste && Boolean(passage.reductions[l.id]?.trim());
        return `<option value="${l.id}" ${l.id === level ? "selected" : ""}>${l.label}${hasSaved ? " \xB7 saved" : ""}</option>`;
      }).join("")}
        </select>
      </label>
      ${needsPaste ? `<details class="reduce-help ${pasteMissing ? "is-missing" : "is-ready"}" id="chatgpt-help" ${pasteMissing ? "open" : ""}>
              <summary class="reduce-help-head">
                <span class="reduce-help-title">
                  <strong>${pasteMissing ? "ChatGPT reduction required" : "ChatGPT reduction saved locally"}</strong>
                  <span class="reduce-help-hint">${pasteMissing ? "Expand to paste from ChatGPT" : "Collapsed \u2014 expand to update or reset"}</span>
                </span>
                <span class="req-badge ${pasteMissing ? "missing" : "ok"}">${pasteMissing ? "Missing" : "Saved"}</span>
              </summary>
              <div class="reduce-help-body" aria-live="polite">
              ${pastedSaved ? `<p class="empty reduce-help-alt">This reduction stays with the passage until you reset it.${savedAt ? ` Last saved ${esc2(new Date(savedAt).toLocaleString())}.` : ""}</p>` : `<ol class="reduce-steps">
              <li>Copy the prompt below</li>
              <li>Open <a class="chatgpt-link" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT</a>, paste it, and generate</li>
              <li>Copy ChatGPT\u2019s answer into the required field, then save</li>
            </ol>
            <p class="empty reduce-help-alt">Or switch cue level to <strong>First words</strong>, <strong>First letters</strong>, or <strong>No hints</strong> (no ChatGPT needed).</p>`}
              <label>1. ChatGPT prompt
                <textarea id="ai-prompt" readonly>${esc2(buildReductionPrompt(pasteMode, passage.title, passage.text))}</textarea>
              </label>
              <div class="row">
                <button class="btn secondary" type="button" id="copy-prompt">Copy prompt</button>
                <a class="btn secondary" id="open-chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Open ChatGPT</a>
              </div>
              <label class="${pasteMissing ? "field-missing" : "field-ready"}">
                <span class="label-row">2. Paste ChatGPT reduction <span class="req-badge ${pasteMissing ? "missing" : "ok"}">${pasteMissing ? "Required \u2014 missing" : "Saved"}</span></span>
                <textarea id="paste-reduction" ${pasteMissing ? 'aria-invalid="true" aria-required="true"' : ""} placeholder="Paste ChatGPT\u2019s reduced text here\u2026">${esc2(passage.reductions[level] ?? "")}</textarea>
              </label>
              <div class="row">
                <button class="btn" type="button" id="save-reduction">${pastedSaved ? "Update saved reduction" : "Save pasted reduction"}</button>
                ${pastedSaved ? `<button class="btn danger" type="button" id="reset-reduction">Reset saved reduction</button>` : ""}
              </div>
              </div>
            </details>` : ""}
      <div class="cue-box panel" style="margin-top:1rem;box-shadow:none">
        <p><strong>Practice cue</strong> \u2014 try to recall the full passage from this alone</p>
        <pre class="cue-pre">${esc2(cue || "(no hints \u2014 recall from memory)")}</pre>
        ${reveal ? `<pre class="cue-pre original">${esc2(passage.text)}</pre>` : ""}
      </div>
      <label class="reduce-proficiency">Cue format I am proficient with <span class="empty">(affects mastery points)</span>
        <select id="reduce-proficiency">
          ${REDUCE_PROFICIENCY.map((p) => {
        const hasSaved = REDUCTION_LEVELS.find((l) => l.id === p.id)?.needsPaste && Boolean(passage.reductions[p.id]?.trim());
        return `<option value="${p.id}" ${p.id === proficiency ? "selected" : ""}>${p.label}${hasSaved ? " \xB7 saved" : ""}</option>`;
      }).join("")}
        </select>
      </label>
      <div class="row stage-next-row">
        <button class="btn secondary" type="button" id="toggle-reveal">${reveal ? "Hide original" : "Reveal original to check"}</button>
        <button class="btn ${isComplete(passage, "reduce") ? "secondary" : "stage-next"}" type="button" id="mark-reduce" title="${profPasteMissing ? "Save a ChatGPT reduction for your proficiency level first" : "Mark Reduce practiced"}">${isComplete(passage, "reduce") ? "Update Reduce proficiency" : "Mark Reduce practiced"}</button>
        <span class="toast" id="reduce-toast" hidden></span>
      </div>
    `;
      const toast = (msg, kind = "ok") => {
        const el = panel.querySelector("#reduce-toast");
        if (!el) return;
        el.hidden = false;
        el.classList.toggle("warn", kind === "warn");
        el.textContent = msg;
      };
      if (notice) toast(notice.msg, notice.kind ?? "ok");
      panel.querySelector("#level")?.addEventListener("change", (e) => {
        level = e.target.value;
        reveal = false;
        paint();
      });
      panel.querySelector("#reduce-proficiency")?.addEventListener("change", (e) => {
        proficiency = e.target.value;
        paint();
      });
      panel.querySelector("#toggle-reveal")?.addEventListener("click", () => {
        reveal = !reveal;
        paint();
      });
      panel.querySelector("#mark-reduce")?.addEventListener("click", () => {
        proficiency = panel.querySelector("#reduce-proficiency")?.value ?? proficiency;
        const gate = canComplete(proficiency);
        if (!gate.ok) {
          toast(gate.reason, "warn");
          const needsChat = REDUCTION_LEVELS.find((l) => l.id === proficiency)?.needsPaste;
          if (needsChat) {
            level = proficiency;
            paint({ msg: gate.reason, kind: "warn" });
            const help = panel.querySelector("#chatgpt-help");
            if (help) {
              help.open = true;
              help.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            panel.querySelector("#paste-reduction")?.classList.add("flash-missing");
          }
          return;
        }
        const withProf = { ...passage, reduceProficiency: proficiency };
        const updated = markStage(repo2, withProf, "reduce");
        Object.assign(passage, updated);
        toast(`Reduce complete \u2014 proficiency: ${reduceProficiencyLabel(proficiency)}.`);
        onChanged(updated);
      });
      panel.querySelector("#copy-prompt")?.addEventListener("click", async () => {
        const text = panel.querySelector("#ai-prompt")?.value ?? "";
        await navigator.clipboard.writeText(text);
        toast("Prompt copied \u2014 open ChatGPT and paste it.");
      });
      panel.querySelector("#save-reduction")?.addEventListener("click", () => {
        const pasted = panel.querySelector("#paste-reduction")?.value ?? "";
        if (!pasted.trim()) {
          toast("Paste ChatGPT\u2019s reduced text into the required field.", "warn");
          panel.querySelector("#paste-reduction")?.focus();
          return;
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const prompt = buildReductionPrompt(pasteMode, passage.title, passage.text);
        const updated = {
          ...passage,
          reductions: { ...passage.reductions, [level]: pasted },
          reductionMeta: { promptUsed: prompt, updatedAt: now, lastLevel: level },
          updatedAt: now
        };
        savePassage(repo2, updated);
        Object.assign(passage, updated);
        onChanged(updated);
      });
      panel.querySelector("#reset-reduction")?.addEventListener("click", () => {
        const reductions = { ...passage.reductions };
        delete reductions[level];
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const updated = {
          ...passage,
          reductions,
          reductionMeta: {
            ...passage.reductionMeta,
            updatedAt: now,
            lastLevel: level
          },
          updatedAt: now
        };
        savePassage(repo2, updated);
        Object.assign(passage, updated);
        onChanged(updated);
      });
    };
    paint();
  }
  function esc2(s) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  // src/main.ts
  var app = document.querySelector("#app");
  if (!app) throw new Error("#app missing");
  var repo = new PassageRepository();
  var STAGES2 = /* @__PURE__ */ new Set([
    "read",
    "understand",
    "reduce",
    "visualize",
    "reconstruct",
    "recall",
    "master"
  ]);
  var STARTERS = OUR_LIBRARY.map((item) => item.starter);
  function findStarterMatch(starter) {
    return repo.listPassages().find((p) => {
      if (starter.bibleReference && p.bibleReference === starter.bibleReference) return true;
      return p.title === starter.title;
    });
  }
  /** Fill empty matching passages from known starters (fixes pre-text localStorage copies). */
  function healEmptyStarters() {
    for (const starter of STARTERS) {
      if (!starter.text?.trim()) continue;
      const match = findStarterMatch(starter);
      if (match && !match.text.trim()) {
        repo.upsertPassage({ ...starter, id: match.id });
      }
    }
  }
  /** Reuse an existing match (fill if empty) instead of always creating a duplicate. */
  function applyStarter(starter) {
    const match = findStarterMatch(starter);
    if (match) {
      if (!match.text.trim() && starter.text?.trim()) {
        return repo.upsertPassage({ ...starter, id: match.id });
      }
      return match;
    }
    return repo.upsertPassage({ ...starter });
  }
  function showLibrary(prefill) {
    history.replaceState(null, "", "#");
    healEmptyStarters();
    renderLibrary(app, repo, {
      onOpenPassage: (id) => {
        history.replaceState(null, "", `#passage/${id}/read`);
        mount();
      },
      onScoreboard: () => {
        history.replaceState(null, "", "#scoreboard");
        mount();
      },
      onApplyStarter: (starter) => applyStarter(starter),
      onFindStarter: (starter) => findStarterMatch(starter)
    });
    wrapShell();
    if (prefill) {
      const form = app.querySelector("#passage-form");
      if (!form) return;
      const set = (name, value) => {
        const el = form.elements.namedItem(name);
        if (el && value != null) el.value = value;
      };
      set("title", prefill.title);
      set("type", prefill.type);
      set("bibleReference", prefill.bibleReference);
      set("versionHint", prefill.versionHint);
      set("text", prefill.text);
    }
  }
  function wrapShell() {
    if (app.querySelector(".app-shell")) return;
    const shell = document.createElement("div");
    shell.className = "app-shell";
    while (app.firstChild) shell.appendChild(app.firstChild);
    app.appendChild(shell);
  }
  function findExistingFromShare(payload) {
    const text = payload.text;
    const ref = payload.bibleReference ?? "";
    return repo.listPassages().find(
      (p) => p.type === payload.type && p.title === payload.title && (p.bibleReference ?? "") === ref && (p.text ?? "") === text
    );
  }
  function mount() {
    healEmptyStarters();
    const hash = location.hash.replace(/^#/, "");
    const parts = hash.split("/").filter(Boolean);
    const shareEncoded = encodedShareFromHash(location.hash);
    if (shareEncoded) {
      const payload = decodeSharePayload(shareEncoded);
      if (payload) {
        const input = passageInputFromShare(payload);
        const existing = findExistingFromShare(input);
        const passage = existing ?? repo.upsertPassage(input);
        history.replaceState(null, "", `#passage/${passage.id}/read`);
        renderTraining(app, repo, passage.id, { onBack: showLibrary }, "read");
        return;
      }
      history.replaceState(null, "", "#");
    }
    if (parts[0] === "scoreboard") {
      renderScoreboard(app, repo, {
        onBack: () => showLibrary(),
        onOpen: (id) => {
          history.replaceState(null, "", `#passage/${id}/reconstruct`);
          mount();
        }
      });
      return;
    }
    if (parts[0] === "passage" && parts[1] && repo.getPassage(parts[1])) {
      const stage = STAGES2.has(parts[2]) ? parts[2] : "read";
      renderTraining(app, repo, parts[1], { onBack: showLibrary }, stage);
      return;
    }
    showLibrary();
  }
  mount();
  window.addEventListener("hashchange", mount);
})();
