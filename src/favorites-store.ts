export type FavoriteType = "server" | "skills";

export type Favorite = {
  id: string;
  slug: string;
  name: string;
  type: FavoriteType;
  href: string;
  description?: string;
  category?: string;
  owner_avatar?: string;
  github_stars?: number;
  savedAt: number;
};

const STORAGE_KEY = "mmb.favorites";

let cache: Favorite[] | null = null;

export function favoriteId(type: FavoriteType, slug: string): string {
  return `${type}:${slug}`;
}

export async function loadFavorites(): Promise<Favorite[]> {
  if (cache) return cache;
  try {
    const raw = await GM.getValue(STORAGE_KEY, "[]");
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    cache = Array.isArray(parsed) ? (parsed as Favorite[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

export async function saveFavorites(list: Favorite[]): Promise<void> {
  cache = list;
  await GM.setValue(STORAGE_KEY, JSON.stringify(list));
}

export async function isFavorite(id: string): Promise<boolean> {
  const list = await loadFavorites();
  return list.some((f) => f.id === id);
}

export async function toggleFavorite(
  item: Omit<Favorite, "id" | "savedAt"> & { id?: string; savedAt?: number },
): Promise<{ list: Favorite[]; added: boolean }> {
  const list = [...(await loadFavorites())];
  const id = item.id || favoriteId(item.type, item.slug);
  const idx = list.findIndex((f) => f.id === id);
  if (idx >= 0) {
    list.splice(idx, 1);
    await saveFavorites(list);
    return { list, added: false };
  }
  const next: Favorite = {
    id,
    slug: item.slug,
    name: item.name,
    type: item.type,
    href: item.href,
    description: item.description,
    category: item.category,
    owner_avatar: item.owner_avatar,
    github_stars: item.github_stars,
    savedAt: Date.now(),
  };
  list.unshift(next);
  await saveFavorites(list);
  return { list, added: true };
}

/** Invalidate in-memory cache (e.g. after external change). */
export function clearFavoritesCache(): void {
  cache = null;
}
