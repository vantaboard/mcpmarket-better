export type SearchParams = {
  q: string | null;
  category_slug: string | null;
  type: string | null;
};

export type SearchParamUpdates = Partial<{
  q: string | null;
  category_slug: string | null;
  type: string | null;
}>;

export function readSearchParams(): SearchParams {
  const params = new URLSearchParams(location.search);
  return {
    q: params.get("q"),
    category_slug: params.get("category_slug"),
    type: params.get("type"),
  };
}

/**
 * Build `/search?...` from current URL params with optional updates.
 * Param order is normalized — the host 301-loops some orderings
 * (e.g. q before category_slug) while accepting category_slug → q → type.
 */
export function buildSearchUrl(updates: SearchParamUpdates = {}): string {
  const current = readSearchParams();
  const next: SearchParams = {
    q: updates.q !== undefined ? updates.q : current.q,
    category_slug:
      updates.category_slug !== undefined
        ? updates.category_slug
        : current.category_slug,
    type: updates.type !== undefined ? updates.type : current.type,
  };

  const params = new URLSearchParams();
  // Stable order avoids host redirect loops on combined filters.
  if (next.category_slug) params.set("category_slug", next.category_slug);
  if (next.q) params.set("q", next.q);
  if (next.type) params.set("type", next.type);

  const qs = params.toString();
  return "/search" + (qs ? `?${qs}` : "") + location.hash;
}

/** Navigate to the merged search URL; no-op if unchanged. */
export function navigateSearch(updates: SearchParamUpdates = {}): void {
  const next = buildSearchUrl(updates);
  const current = location.pathname + location.search + location.hash;
  if (next === current) return;
  location.assign(next);
}

/** Update the address bar without a page navigation (no skeleton flash). */
export function replaceSearchUrl(updates: SearchParamUpdates = {}): void {
  const next = buildSearchUrl(updates);
  const current = location.pathname + location.search + location.hash;
  if (next === current) return;
  history.replaceState(history.state, "", next);
}
