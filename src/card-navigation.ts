const CARD_SEL = 'a[id^="tool-card-"]';
const HEART_SEL = ".mmb-fav-heart";

let listenersBound = false;

function isSearchPage(): boolean {
  return location.pathname.includes("/search");
}

type OpenInTabFn = (
  url: string,
  opts?: boolean | { active?: boolean; insert?: boolean; setParent?: boolean },
) => unknown;

function getOpenInTab(): OpenInTabFn | null {
  const gm = typeof GM !== "undefined" ? GM : null;
  if (gm && typeof gm.openInTab === "function") {
    return gm.openInTab.bind(gm) as OpenInTabFn;
  }
  // Legacy grant name some managers expose.
  const legacy = (globalThis as { GM_openInTab?: OpenInTabFn }).GM_openInTab;
  return typeof legacy === "function" ? legacy : null;
}

/** Open URL in a new tab without focusing away from search when possible. */
function openInBackground(url: string): boolean {
  const absolute = new URL(url, location.href).href;
  const openInTab = getOpenInTab();

  if (openInTab) {
    try {
      openInTab(absolute, { active: false, insert: true, setParent: true });
      return true;
    } catch {
      try {
        // Boolean form: true = background (Greasemonkey / TM loadInBackground).
        openInTab(absolute, true);
        return true;
      } catch (e) {
        console.error("[mcpmarket-better] openInTab failed", e);
      }
    }
  } else {
    console.warn(
      "[mcpmarket-better] GM.openInTab unavailable — reinstall the userscript to pick up @grant GM.openInTab",
    );
  }

  // Fallback: still open a tab (may steal focus) so left-click is never a no-op.
  try {
    const a = document.createElement("a");
    a.href = absolute;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch (e) {
    console.error("[mcpmarket-better] fallback open failed", e);
    return false;
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

  if (!openInBackground(card.href)) {
    // Absolute last resort — same-tab navigation.
    location.assign(card.href);
  }
}

export function startCardNavigation(): void {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener("click", onCardClick, true);
}
