import { renderHeartButton } from "./favorites-heart";
import { isFavoritesMode, refreshFavoritesIfActive } from "./favorites-mode";
import { favoriteId, isFavoriteSync } from "./favorites-store";
import {
  navigateSearch,
  readSearchParams,
  replaceSearchUrl,
  type SearchParams,
  type SearchParamUpdates,
} from "./search-params";

const PAGE_LIMIT = 21;
const GRID_SEL =
  'div.grid.gap-6[data-mmb-results], div.grid.gap-6:has(a[id^="tool-card-"])';

type ListItem = {
  name: string;
  slug: string;
  description: string;
  github_stars?: number | null;
  owner_name?: string | null;
  owner_avatar?: string | null;
  categories?: { name: string }[] | null;
  category_name?: string | null;
  type?: string | null;
};

type SoftState = {
  page: number;
  hasMore: boolean;
  params: SearchParams;
  requestId: number;
};

let softState: SoftState | null = null;
let cachedGrid: HTMLElement | null = null;
let abortController: AbortController | null = null;
let requestSeq = 0;
let loadMoreBound = false;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatStars(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const rounded = Math.round(k * 10) / 10;
    return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded}k`;
  }
  return String(n);
}

function avatarSrc(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("avatars.githubusercontent.com") && !url.includes("s=")) {
    return url.includes("?") ? `${url}&s=40` : `${url}?s=40`;
  }
  return url;
}

function itemHref(item: ListItem, isSkills: boolean): string {
  if (isSkills || item.type === "skills" || item.type === "skill") {
    return `/skill/${item.slug}`;
  }
  return `/server/${item.slug}`;
}

function categoryLabel(item: ListItem): string {
  return item.categories?.[0]?.name || item.category_name || "";
}

export function renderResultCard(item: ListItem, isSkills: boolean): string {
  const href = itemHref(item, isSkills);
  const name = escapeHtml(item.name || "");
  const desc = escapeHtml(item.description || "");
  const owner = escapeHtml(item.owner_name || "");
  const avatar = escapeHtml(avatarSrc(item.owner_avatar));
  const cat = escapeHtml(categoryLabel(item));
  const stars = item.github_stars ?? 0;
  const type =
    isSkills || item.type === "skills" || item.type === "skill"
      ? "skills"
      : "server";
  const favId = favoriteId(type, item.slug);
  const heart = renderHeartButton(favId, isFavoriteSync(favId));

  const avatarHtml = avatar
    ? `<img alt="${owner}" loading="lazy" width="20" height="20" decoding="async" class="shrink-0 rounded-full object-cover opacity-50 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0" src="${avatar}" style="color: transparent;">`
    : `<span class="shrink-0 h-5 w-5 rounded-full bg-muted"></span>`;

  const starsHtml =
    stars > 0
      ? `<div class="flex items-center font-geist-mono text-xs text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-3 w-3 fill-muted-foreground/30 text-muted-foreground"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>${escapeHtml(formatStars(stars))}</div>`
      : "";

  const catHtml = cat
    ? `<div class="inline-flex items-center border transition-colors rounded-lg border-border px-1.5 py-0 font-geist-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">${cat}</div>`
    : "";

  return `<a id="tool-card-${escapeHtml(item.slug)}" class="group block h-full" href="${escapeHtml(href)}" data-mmb-soft="1"><div class="group relative h-full rounded-lg border border-border bg-card transition-colors duration-200 hover:border-foreground/20 hover:bg-accent/50">${heart}<div class="flex h-full flex-col p-5"><div class="mb-3 flex items-center justify-between gap-2"><div class="flex items-center gap-2.5">${avatarHtml}<h3 class="line-clamp-1 font-geist-mono text-base font-semibold text-foreground transition-colors group-hover:text-foreground/80">${name}</h3></div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground/60"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></div><p class="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">${desc}</p><div class="mt-auto flex items-center justify-between"><div class="flex items-center gap-2">${catHtml}</div>${starsHtml}</div></div></div></a>`;
}

function renderCard(item: ListItem, isSkills: boolean): string {
  return renderResultCard(item, isSkills);
}

function renderEmptyState(q: string | null): string {
  const query = q ? ` for “${escapeHtml(q)}”` : "";
  return `<div class="mmb-empty-results" data-mmb-empty="1" style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center;">
    <p class="font-geist-mono text-base font-semibold text-foreground" style="margin: 0 0 0.5rem;">No search results${query}</p>
    <p class="text-sm text-muted-foreground" style="margin: 0;">Try a different query or clear the category filter.</p>
  </div>`;
}

function findResultsGrid(): HTMLElement | null {
  if (cachedGrid?.isConnected) return cachedGrid;

  const found = document.querySelector<HTMLElement>(GRID_SEL);
  if (found) {
    found.setAttribute("data-mmb-results", "1");
    cachedGrid = found;
    return found;
  }

  // Fallback: common host results grid class without requiring cards.
  const fallback = document.querySelector<HTMLElement>(
    "div.grid.gap-6.sm\\:grid-cols-1, div.grid.gap-6.md\\:grid-cols-2",
  );
  if (fallback) {
    fallback.setAttribute("data-mmb-results", "1");
    cachedGrid = fallback;
    return fallback;
  }

  cachedGrid = null;
  return null;
}

export function getResultsGrid(): HTMLElement | null {
  return findResultsGrid();
}

function findLoadMoreButton(): HTMLButtonElement | null {
  const buttons = document.querySelectorAll<HTMLButtonElement>("button");
  for (const btn of buttons) {
    if (/load more/i.test(btn.textContent || "")) return btn;
  }
  return null;
}

function buildListUrl(params: SearchParams, page: number): string {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(PAGE_LIMIT));
  if (params.type === "skills") {
    qs.set("type", "skills");
  } else {
    qs.set("type", "server");
  }
  if (params.q) qs.set("q", params.q);
  if (params.category_slug) qs.set("category_slug", params.category_slug);
  return `/api/list?${qs.toString()}`;
}

class SoftSearchHalt extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SoftSearchHalt";
  }
}

async function fetchList(
  params: SearchParams,
  page: number,
  signal: AbortSignal,
): Promise<{ items: ListItem[]; hasMore: boolean; isSkills: boolean }> {
  const isSkills = params.type === "skills";
  // Manual redirects so a 301/302 does not get followed into a loop.
  const res = await fetch(buildListUrl(params, page), {
    signal,
    redirect: "manual",
  });

  if (
    res.type === "opaqueredirect" ||
    (res.status >= 300 && res.status < 400)
  ) {
    throw new SoftSearchHalt(`redirect ${res.status || "opaque"}`);
  }
  if (!res.ok) {
    throw new SoftSearchHalt(`list ${res.status}`);
  }

  const data = await res.json();
  const items: ListItem[] = isSkills ? data.skills || [] : data.tools || [];
  const hasMore = !!data.pagination?.hasMore;
  return { items, hasMore, isSkills };
}

function ensureLoadMoreHandler(): void {
  if (loadMoreBound) return;
  loadMoreBound = true;
  document.addEventListener(
    "click",
    (e) => {
      if (isFavoritesMode()) return;
      if (!softState?.hasMore) return;
      const target = e.target as Element | null;
      const btn = target?.closest?.("button");
      if (!btn || !/load more/i.test(btn.textContent || "")) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      void loadMoreSoft();
    },
    true,
  );
}

function syncLoadMoreButton(hasMore: boolean): void {
  const btn = findLoadMoreButton();
  if (!btn) return;
  const show = hasMore && !isFavoritesMode();
  btn.hidden = !show;
  btn.style.display = show ? "" : "none";
  if (show) {
    btn.disabled = false;
  }
}

export function syncLoadMoreVisibility(hasMore: boolean): void {
  syncLoadMoreButton(hasMore);
}

function showEmpty(grid: HTMLElement, q: string | null): void {
  grid.innerHTML = renderEmptyState(q);
  syncLoadMoreButton(false);
  if (softState) softState.hasMore = false;
}

async function loadMoreSoft(): Promise<void> {
  if (isFavoritesMode()) return;
  if (!softState?.hasMore) return;
  const grid = findResultsGrid();
  if (!grid) return;

  const nextPage = softState.page + 1;
  const myId = ++requestSeq;
  softState.requestId = myId;

  abortController?.abort();
  abortController = new AbortController();

  try {
    const { items, hasMore, isSkills } = await fetchList(
      softState.params,
      nextPage,
      abortController.signal,
    );
    if (myId !== requestSeq || !softState) return;

    if (items.length === 0) {
      softState.hasMore = false;
      syncLoadMoreButton(false);
      return;
    }

    const html = items.map((item) => renderCard(item, isSkills)).join("");
    grid.insertAdjacentHTML("beforeend", html);
    softState.page = nextPage;
    softState.hasMore = hasMore;
    syncLoadMoreButton(hasMore);
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return;
    if (e instanceof SoftSearchHalt) {
      softState.hasMore = false;
      syncLoadMoreButton(false);
      return;
    }
    console.error("[mcpmarket-better] soft load more failed", e);
  }
}

function mergeParams(updates: SearchParamUpdates): SearchParams {
  const current = readSearchParams();
  return {
    q: updates.q !== undefined ? updates.q : current.q,
    category_slug:
      updates.category_slug !== undefined
        ? updates.category_slug
        : current.category_slug,
    type: updates.type !== undefined ? updates.type : current.type,
  };
}

/**
 * Update results in-place and sync the URL via replaceState — no full
 * navigation, so the sticky search chrome does not remount/skeleton.
 * Returns false only when there is no results container to update.
 * Redirects / empty / errors show an empty state and still return true
 * so callers must not fall back to hard navigation (host 301 loops).
 */
export async function softSearch(
  updates: SearchParamUpdates,
): Promise<boolean> {
  const grid = findResultsGrid();
  if (!grid) return false;

  // Favorites mode: keep URL in sync and refresh the saved grid — no API.
  if (isFavoritesMode()) {
    replaceSearchUrl(updates);
    refreshFavoritesIfActive();
    syncLoadMoreButton(false);
    return true;
  }

  const params = mergeParams(updates);
  replaceSearchUrl(updates);

  ensureLoadMoreHandler();

  const myId = ++requestSeq;
  abortController?.abort();
  abortController = new AbortController();

  softState = {
    page: 1,
    hasMore: false,
    params,
    requestId: myId,
  };

  try {
    const { items, hasMore, isSkills } = await fetchList(
      params,
      1,
      abortController.signal,
    );
    if (myId !== requestSeq) return true;
    // Favorites mode may have been entered while the request was in flight.
    if (isFavoritesMode()) {
      refreshFavoritesIfActive();
      syncLoadMoreButton(false);
      return true;
    }

    if (items.length === 0) {
      showEmpty(grid, params.q);
      return true;
    }

    grid.innerHTML = items.map((item) => renderCard(item, isSkills)).join("");
    softState.hasMore = hasMore;
    softState.page = 1;
    syncLoadMoreButton(hasMore);
    return true;
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return true;
    if (isFavoritesMode()) {
      refreshFavoritesIfActive();
      syncLoadMoreButton(false);
      return true;
    }
    if (e instanceof SoftSearchHalt) {
      if (myId === requestSeq) showEmpty(grid, params.q);
      return true;
    }
    console.error("[mcpmarket-better] soft search failed", e);
    if (myId === requestSeq) showEmpty(grid, params.q);
    return true;
  }
}

/**
 * Prefer soft in-place update. Hard-navigate only when there is no results
 * grid (browse landing). Soft path already handles empty/redirect safely.
 */
export function softSearchOrNavigate(updates: SearchParamUpdates): void {
  void softSearch(updates).then((ok) => {
    if (!ok) navigateSearch(updates);
  });
}
