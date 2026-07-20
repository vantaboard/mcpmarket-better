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
 * If we arrived from a landing search click, keep the /search input focused
 * through hydration/remounts until the page has finished loading.
 */
export function startSearchFocusOnArrive(): void {
  if (!location.pathname.includes("/search")) return;
  if (!takeFocusRequest()) return;

  let pending = true;
  let stableTimer: ReturnType<typeof setTimeout> | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let observer: MutationObserver | null = null;
  let finished = false;

  const cleanup = (): void => {
    if (finished) return;
    finished = true;
    pending = false;
    if (stableTimer) clearTimeout(stableTimer);
    if (intervalId) clearInterval(intervalId);
    observer?.disconnect();
    document.removeEventListener("focusout", onFocusOut, true);
    window.removeEventListener("load", onLoad);
  };

  const markStableIfReady = (): void => {
    if (!pending) return;
    if (document.readyState !== "complete") return;
    const input = getSearchPageInput();
    if (!input || document.activeElement !== input) return;

    if (stableTimer) clearTimeout(stableTimer);
    // Stay focused through late React remounts after window.load.
    stableTimer = setTimeout(() => {
      const still = getSearchPageInput();
      if (
        pending &&
        document.readyState === "complete" &&
        still &&
        document.activeElement === still
      ) {
        cleanup();
      }
    }, 500);
  };

  const tryFocus = (): void => {
    if (!pending) return;
    const input = getSearchPageInput();
    if (!input) return;
    if (document.activeElement !== input) {
      focusInput(input);
    }
    markStableIfReady();
  };

  const onFocusOut = (e: FocusEvent): void => {
    if (!pending) return;
    const target = e.target as Element | null;
    if (!(target instanceof HTMLInputElement) || target.name !== "search") {
      return;
    }
    if (stableTimer) {
      clearTimeout(stableTimer);
      stableTimer = null;
    }
    // Host remounts blur the field — reclaim until we're done loading.
    queueMicrotask(tryFocus);
    requestAnimationFrame(tryFocus);
  };

  const onLoad = (): void => {
    tryFocus();
    // Extra passes after load for sticky chrome / soft enhance.
    window.setTimeout(tryFocus, 0);
    window.setTimeout(tryFocus, 100);
    window.setTimeout(tryFocus, 300);
  };

  document.addEventListener("focusout", onFocusOut, true);
  observer = new MutationObserver(() => {
    if (pending) tryFocus();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  intervalId = setInterval(tryFocus, 120);

  tryFocus();
  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }

  // Hard stop so we never trap focus forever.
  window.setTimeout(cleanup, 8000);
}
