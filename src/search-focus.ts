const FOCUS_KEY = "mmb.focusSearch";

/** Set before navigating from home/category search to /search. */
export function markSearchShouldFocus(): void {
  try {
    sessionStorage.setItem(FOCUS_KEY, "1");
  } catch {
    // private mode / blocked storage — focus just won't auto-apply
  }
}

function takeFocusRequest(): boolean {
  try {
    if (sessionStorage.getItem(FOCUS_KEY) !== "1") return false;
    sessionStorage.removeItem(FOCUS_KEY);
    return true;
  } catch {
    return false;
  }
}

function getSearchPageInput(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    'header.sticky.top-14 input[name="search"]',
  );
}

function focusInput(input: HTMLInputElement): boolean {
  input.focus({ preventScroll: true });
  const len = input.value.length;
  try {
    input.setSelectionRange(len, len);
  } catch {
    // some inputs reject setSelectionRange
  }
  return document.activeElement === input;
}

/**
 * If we arrived from a landing search click, focus the /search input
 * (retries through hydration).
 */
export function startSearchFocusOnArrive(): void {
  if (!location.pathname.includes("/search")) return;
  if (!takeFocusRequest()) return;

  const delays = [0, 50, 150, 300, 600, 1200];
  let done = false;

  const attempt = (): void => {
    if (done) return;
    const input = getSearchPageInput();
    if (!input) return;
    if (focusInput(input)) done = true;
  };

  for (const ms of delays) {
    window.setTimeout(attempt, ms);
  }
}
