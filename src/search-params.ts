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

function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string | null | undefined,
): void {
  if (value === undefined) return;
  if (value === null || value === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}

/** Build `/search?...` from current URL params with optional updates. */
export function buildSearchUrl(updates: SearchParamUpdates = {}): string {
  const params = new URLSearchParams(location.search);

  setOrDelete(params, "q", updates.q);
  setOrDelete(params, "category_slug", updates.category_slug);
  setOrDelete(params, "type", updates.type);

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
