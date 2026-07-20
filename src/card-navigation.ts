const CARD_SEL = 'a[id^="tool-card-"]';
const HEART_SEL = ".mmb-fav-heart";

let listenersBound = false;

function isSearchPage(): boolean {
  return location.pathname.includes("/search");
}

function openInBackground(url: string): void {
  const absolute = new URL(url, location.href).href;
  try {
    // Tampermonkey / Violentmonkey: open without focusing this tab away.
    GM.openInTab(absolute, {
      active: false,
      insert: true,
      setParent: true,
    });
  } catch (e) {
    console.error("[mcpmarket-better] openInTab failed", e);
    // Last resort — may steal focus depending on browser settings.
    window.open(absolute, "_blank", "noopener,noreferrer");
  }
}

function onCardClick(e: MouseEvent): void {
  if (!isSearchPage()) return;
  if (e.defaultPrevented) return;
  if (e.button !== 0) return;
  // Modifier clicks: keep native new-tab behavior.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const target = e.target as Element | null;
  if (!target?.closest) return;
  if (target.closest(HEART_SEL)) return;

  const card = target.closest(CARD_SEL) as HTMLAnchorElement | null;
  if (!card?.href) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  openInBackground(card.href);
}

export function startCardNavigation(): void {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener("click", onCardClick, true);
}
