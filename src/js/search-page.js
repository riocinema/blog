// src/js/search-page.js

function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(q) {
  const n = norm(q);
  if (!n) return [];
  return n.split(" ").filter(Boolean);
}

function formatDateShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // UK style with 2-digit year
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(d);
}

// Weighted relevance scoring.
// Title + tags matter most, but body is included.
function scorePost(post, terms) {
  const title = norm(post.title);
  const tags = norm((post.tags || []).join(" "));
  const excerpt = norm(post.excerpt);
  const body = norm(post.body);

  let score = 0;

  for (const t of terms) {
    // title
    if (title.includes(t)) score += 12;
    // tags
    if (tags.includes(t)) score += 10;
    // excerpt
    if (excerpt.includes(t)) score += 6;
    // body
    if (body.includes(t)) score += 3;

    // small bonus for exact word boundary matches
    const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(post.title || "")) score += 4;
    if ((post.tags || []).some((x) => re.test(String(x)))) score += 3;
  }

  return score;
}

function buildHomeStyleItem(post) {
  // Match your homepage “last word sticks with date” behaviour.
  const title = (post.title || "").trim();
  const words = title.split(/\s+/).filter(Boolean);
  const last = words.pop() || "";
  const prefix = words.join(" ");

  const date = formatDateShort(post.date);

  const a = document.createElement("a");
  a.href = post.url || "#";
  a.className = "post-item";
  a.dataset.image = post.featuredImage || "";

  const div = document.createElement("div");
  div.className = "post-title";

  // prefix + nowrap(last + date)
  div.append(document.createTextNode(prefix ? prefix + " " : ""));

  const nowrap = document.createElement("span");
  nowrap.className = "nowrap";

  const lastSpan = document.createElement("span");
  lastSpan.className = "title-lastword";
  lastSpan.textContent = last;

  const dateSpan = document.createElement("span");
  dateSpan.className = "post-date";
  dateSpan.textContent = date ? date : "";

  nowrap.appendChild(lastSpan);
  if (date) nowrap.appendChild(dateSpan);

  div.appendChild(nowrap);
  a.appendChild(div);

  return a;
}

async function init() {
  const input = document.getElementById("searchInput");
  const resultsEl = document.getElementById("searchResults");
  const metaEl = document.getElementById("searchMeta");

  if (!input || !resultsEl) return;

  let index = null;

  async function loadIndex() {
    if (index) return index;
    const res = await fetch("/search.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load search index");
    index = await res.json();
    return index;
  }

  function renderResults(items, q) {
    resultsEl.innerHTML = "";

    if (!q) {
      metaEl.textContent = "";
      return;
    }

    if (!items.length) {
      metaEl.textContent = "No results.";
      return;
    }

    metaEl.textContent = `${items.length} result${items.length === 1 ? "" : "s"}.`;

    for (const p of items) {
      resultsEl.appendChild(buildHomeStyleItem(p));
    }

    // Re-bind hover preview behavior if your existing script relies on events
    // on .post-item elements. If your current hover preview script uses
    // event delegation (recommended), you won't need anything here.
  }

  function applySearch(q, posts) {
    const terms = tokenize(q);
    if (!terms.length) return [];

    const scored = posts
      .map((p) => ({ p, s: scorePost(p, terms) }))
      .filter((x) => x.s > 0);

    // Sort by relevance first, then newest
    scored.sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s;
      const da = a.p.date ? new Date(a.p.date).getTime() : 0;
      const db = b.p.date ? new Date(b.p.date).getTime() : 0;
      return db - da;
    });

    return scored.map((x) => x.p);
  }

  async function onInput() {
    const q = input.value || "";
    const idx = await loadIndex();
    const posts = idx.posts || [];
    const results = applySearch(q, posts);
    renderResults(results, q);
  }

  input.addEventListener("input", () => {
    // Small debounce feel without complexity
    window.clearTimeout(input._t);
    input._t = window.setTimeout(onInput, 60);
  });

  // Focus for desktop “type immediately” feel
  input.focus();

  // If someone navigates to /search/?q=...
  const params = new URLSearchParams(window.location.search);
  const q0 = params.get("q");
  if (q0) {
    input.value = q0;
    await onInput();
  }
}

document.addEventListener("DOMContentLoaded", init);
