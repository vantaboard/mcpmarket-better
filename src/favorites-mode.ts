let favoritesMode = false;
let refreshFavoritesGrid: (() => void) | null = null;
let favoritesScrollY = 0;

export function isFavoritesMode(): boolean {
  return favoritesMode;
}

export function setFavoritesMode(on: boolean): void {
  favoritesMode = on;
  document.documentElement.classList.toggle("mmb-fav-mode", on);
}

export function getFavoritesScrollY(): number {
  return favoritesScrollY;
}

export function setFavoritesScrollY(y: number): void {
  favoritesScrollY = y;
}

/** Clear when the favorites filter (q/type/category) changes. */
export function resetFavoritesScrollY(): void {
  favoritesScrollY = 0;
}

export function registerFavoritesGridRefresh(fn: (() => void) | null): void {
  refreshFavoritesGrid = fn;
}

/** Re-render favorites grid when mode is on (e.g. after soft URL/q updates). */
export function refreshFavoritesIfActive(): void {
  if (favoritesMode) refreshFavoritesGrid?.();
}
