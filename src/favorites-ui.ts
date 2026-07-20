import { createHeartButton, setHeartActive } from "./favorites-heart";
import {
  isFavoritesMode,
  registerFavoritesGridRefresh,
  setFavoritesMode,
} from "./favorites-mode";
import {
  favoriteId,
  loadFavorites,
  toggleFavorite,
  type Favorite,
  type FavoriteType,
  isFavoriteSync,
} from "./favorites-store";
import { readSearchParams } from "./search-params";
import {
  getResultsGrid,
  renderResultCard,
  softSearchOrNavigate,
  syncLoadMoreVisibility,
} from "./soft-search";

const CARD_SEL = 'a[id^="tool-card-"]';
const HEART_SEL = ".mmb-fav-heart";

let listenersBound = false;
let cardObserver: MutationObserver | null = null;

function parseStars(text: string): number | undefined {
  const t = text.trim().toLowerCase();
  if (!t) return undefined;
  if (t.endsWith("k")) {
    const n = parseFloat(t.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1000) : undefined;
  }
  const n = parseInt(t, 10);
  return Number.isFinite(n) ? n : undefined;
}

function favoriteFromCard(card: HTMLAnchorElement): Favorite | null {
  const slug = card.id.replace(/^tool-card-/, "");
  if (!slug) return null;
  const href = card.getAttribute("href") || "";
  const type: FavoriteType =
    href.includes("/skill/") || href.includes("/skills/") ? "skills" : "server";
  const name =
    card.querySelector("h3")?.textContent?.trim() ||
    card.querySelector("h2")?.textContent?.trim() ||
    slug;
  const description = card.querySelector("p")?.textContent?.trim() || undefined;
  const category =
    [...card.querySelectorAll("div")]
      .find((el) => (el.className || "").includes("tracking-wider"))
      ?.textContent?.trim() || undefined;
  const avatar =
    card.querySelector<HTMLImageElement>("img")?.getAttribute("src") ||
    undefined;
  const starsEl = [...card.querySelectorAll("div")].find((el) => {
    const cls = el.className || "";
    return cls.includes("font-geist-mono") && cls.includes("text-xs");
  });
  const starsText = starsEl?.textContent?.replace(/[^\dk.]/gi, "") || "";
  const github_stars = parseStars(starsText);

  return {
    id: favoriteId(type, slug),
    slug,
    name,
    type,
    href,
    description,
    category,
    owner_avatar: avatar,
    github_stars,
    savedAt: Date.now(),
  };
}

function cardShell(card: HTMLAnchorElement): HTMLElement | null {
  return (
    card.querySelector<HTMLElement>(".relative") ||
    card.querySelector<HTMLElement>("div") ||
    card
  );
}

async function enhanceCard(card: HTMLAnchorElement): Promise<void> {
  if (card.querySelector(HEART_SEL)) {
    const existing = card.querySelector<HTMLElement>(HEART_SEL);
    if (!existing) return;
    const id = existing.getAttribute("data-mmb-fav-id");
    if (id) setHeartActive(existing, isFavoriteSync(id));
    return;
  }

  const fav = favoriteFromCard(card);
  if (!fav) return;

  await loadFavorites();
  const shell = cardShell(card);
  if (!shell) return;
  if (getComputedStyle(shell).position === "static") {
    shell.style.position = "relative";
  }
  const btn = createHeartButton(fav.id, isFavoriteSync(fav.id));
  shell.appendChild(btn);
}

export async function enhanceCardHearts(
  root: ParentNode = document,
): Promise<void> {
  await loadFavorites();
  const cards = root.querySelectorAll<HTMLAnchorElement>(CARD_SEL);
  for (const card of cards) {
    await enhanceCard(card);
  }
}

function syncAllHeartButtons(): void {
  document.querySelectorAll<HTMLElement>(HEART_SEL).forEach((btn) => {
    const id = btn.getAttribute("data-mmb-fav-id");
    if (id) setHeartActive(btn, isFavoriteSync(id));
  });
}

function syncFavModeButton(): void {
  const btn = document.querySelector<HTMLElement>(".mmb-fav-mode-btn");
  if (!btn) return;
  const on = isFavoritesMode();
  btn.classList.toggle("mmb-fav-mode-btn--active", on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
}

function renderFavoritesEmpty(): string {
  return `<div class="mmb-empty-results" data-mmb-empty="1" style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center;">
    <p class="font-geist-mono text-base font-semibold text-foreground" style="margin: 0 0 0.5rem;">No favorites yet</p>
    <p class="text-sm text-muted-foreground" style="margin: 0;">Tap the heart on any result card to save it here.</p>
  </div>`;
}

function filterFavorites(list: Favorite[]): Favorite[] {
  const params = readSearchParams();
  const type: FavoriteType = params.type === "skills" ? "skills" : "server";
  let items = list.filter((f) => f.type === type);
  const q = params.q?.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.description || "").toLowerCase().includes(q),
    );
  }
  return items;
}

function favoriteToCardHtml(fav: Favorite): string {
  const isSkills = fav.type === "skills";
  return renderResultCard(
    {
      name: fav.name,
      slug: fav.slug,
      description: fav.description || "",
      github_stars: fav.github_stars ?? null,
      owner_avatar: fav.owner_avatar ?? null,
      category_name: fav.category ?? null,
      type: fav.type,
    },
    isSkills,
  );
}

export async function renderFavoritesGrid(): Promise<void> {
  if (!isFavoritesMode()) return;
  const grid = getResultsGrid();
  if (!grid) return;

  const list = await loadFavorites();
  const items = filterFavorites(list);
  if (items.length === 0) {
    grid.innerHTML = renderFavoritesEmpty();
  } else {
    grid.innerHTML = items.map(favoriteToCardHtml).join("");
  }
  syncLoadMoreVisibility(false);
  await enhanceCardHearts(grid);
}

async function enterFavoritesMode(): Promise<void> {
  setFavoritesMode(true);
  syncFavModeButton();
  await renderFavoritesGrid();
}

async function exitFavoritesMode(): Promise<void> {
  setFavoritesMode(false);
  syncFavModeButton();
  softSearchOrNavigate({});
}

async function toggleFavoritesMode(): Promise<void> {
  if (isFavoritesMode()) {
    await exitFavoritesMode();
  } else {
    await enterFavoritesMode();
  }
}

export function ensureFavoritesModeButton(row: HTMLElement): void {
  if (row.querySelector(".mmb-fav-mode-btn")) {
    syncFavModeButton();
    return;
  }

  const filter = row.querySelector(".mmb-filter");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mmb-fav-mode-btn";
  btn.setAttribute("title", "Favorites");
  btn.setAttribute("aria-label", "Favorites");
  btn.setAttribute("aria-pressed", "false");
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleFavoritesMode();
  });

  if (filter) {
    filter.before(btn);
  } else {
    row.appendChild(btn);
  }
  syncFavModeButton();
}

async function onHeartClick(btn: HTMLElement): Promise<void> {
  const card = btn.closest<HTMLAnchorElement>(CARD_SEL);
  if (!card) return;
  const fav = favoriteFromCard(card);
  if (!fav) return;

  const { added } = await toggleFavorite(fav);
  setHeartActive(btn, added);
  syncAllHeartButtons();

  if (isFavoritesMode()) {
    await renderFavoritesGrid();
  }
}

function bindDocumentListeners(): void {
  if (listenersBound) return;
  listenersBound = true;

  const stop = (e: Event) => {
    const target = e.target as Element | null;
    if (!target?.closest?.(HEART_SEL)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  document.addEventListener("mousedown", stop, true);
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      const btn = target?.closest?.(HEART_SEL) as HTMLElement | null;
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      void onHeartClick(btn);
    },
    true,
  );
}

function observeCards(): void {
  if (cardObserver) return;
  cardObserver = new MutationObserver((mutations) => {
    let needsEnhance = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.(CARD_SEL) || node.querySelector?.(CARD_SEL)) {
          needsEnhance = true;
          break;
        }
      }
      if (needsEnhance) break;
    }
    if (needsEnhance) void enhanceCardHearts();
  });
  cardObserver.observe(document.body, { childList: true, subtree: true });
}

export function startFavorites(): void {
  registerFavoritesGridRefresh(() => {
    void renderFavoritesGrid();
  });
  bindDocumentListeners();
  observeCards();
  void loadFavorites().then(() => {
    void enhanceCardHearts();
  });
  window.setTimeout((): void => {
    void enhanceCardHearts();
  }, 250);
  window.setTimeout((): void => {
    void enhanceCardHearts();
  }, 1000);
}
