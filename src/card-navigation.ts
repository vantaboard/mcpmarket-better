const CARD_SEL = 'a[id^="tool-card-"]';
const HEART_SEL = ".mmb-fav-heart";

let listenersBound = false;

function isSearchPage(): boolean {
  return location.pathname.includes("/search");
}

function openInBackground(url: string): void {
  const absolute = new URL(url, location.href).href;
  try {
    // Second arg true = open in background (keep focus on search).
    // Tampermonkey also accepts { active: false }; boolean form is portable.
    const open = GM.openInTab as (
      u: string,
      opts?:
        boolean | { active?: boolean; insert?: boolean; setParent?: boolean },
    ) => void;
    open(absolute, { active: false, insert: true, setParent: true });
  } catch (e) {
    console.error("[mcpmarket-better] openInTab failed", e);
    try {
      GM.openInTab(absolute, true);
    } catch (e2) {
      console.error("[mcpmarket-better] openInTab fallback failed", e2);
    }
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
