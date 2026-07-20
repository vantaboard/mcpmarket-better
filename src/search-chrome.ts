const HEADER_SEL = "header.sticky.top-14";
const ENHANCED_ATTR = "data-mmb-enhanced";

type Category = { name: string; count: number; slug: string };

let categoriesCache: Category[] | null = null;
let enhanceScheduled = false;
let documentListenersBound = false;

function isSearchPage(): boolean {
  return location.pathname.includes("/search");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getHeader(): HTMLElement | null {
  return document.querySelector(HEADER_SEL);
}

function getStack(header: HTMLElement): HTMLElement | null {
  return header.querySelector("section.py-4 .flex.flex-col");
}

function getCategorySection(header: HTMLElement): HTMLElement | null {
  return header.querySelector("section.border-t");
}

function getSelectedCategory(header: HTMLElement): string | null {
  const slug = new URLSearchParams(location.search).get("category_slug");

  if (slug && categoriesCache) {
    const match = categoriesCache.find((c) => c.slug === slug);
    if (match) return match.name;
  }

  const primary = header.querySelector(
    "section.border-t .scrollbar-hide > button[class*='bg-primary']",
  );
  const chipName = primary?.querySelector("span")?.textContent?.trim();
  if (chipName) return chipName;

  const placeholder =
    header.querySelector<HTMLInputElement>('input[name="search"]')
      ?.placeholder || "";
  const fromPlaceholder = placeholder.match(/\.\.\.\s*(.+)$/);
  if (fromPlaceholder) return fromPlaceholder[1].trim();

  return null;
}

function findVisibleCategoryChip(
  header: HTMLElement,
  name: string,
): HTMLElement | null {
  const chips = header.querySelectorAll<HTMLElement>(
    "section.border-t .scrollbar-hide > button",
  );
  for (const btn of chips) {
    if (btn.querySelector("span")?.textContent?.trim() === name) {
      return btn;
    }
  }
  return null;
}

function navigateCategory(slug: string | null, name?: string | null): void {
  const header = getHeader();

  if (slug && name && header) {
    const chip = findVisibleCategoryChip(header, name);
    if (chip) {
      chip.click();
      return;
    }
  }

  const url = new URL(location.href);
  if (slug) {
    url.searchParams.set("category_slug", slug);
  } else {
    url.searchParams.delete("category_slug");
  }
  location.assign(url.pathname + url.search + url.hash);
}

async function loadCategories(header: HTMLElement): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;

  try {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data: { name: string; count: number }[] = await res.json();
      categoriesCache = data.map((c) => ({
        name: c.name,
        count: c.count,
        slug: slugify(c.name),
      }));
      return categoriesCache;
    }
  } catch {
    // fall through to DOM scrape
  }

  const scraped: Category[] = [];
  const seen = new Set<string>();

  const chips = header.querySelectorAll(
    "section.border-t .scrollbar-hide > button",
  );
  chips.forEach((btn) => {
    const name = btn.querySelector("span")?.textContent?.trim();
    if (!name || name === "More categories" || seen.has(name)) return;
    const countText = btn.textContent?.replace(name, "").replace(/\D/g, "");
    scraped.push({
      name,
      count: Number(countText) || 0,
      slug: slugify(name),
    });
    seen.add(name);
  });

  categoriesCache = scraped;
  return scraped;
}

function closeFilterPanel(root: HTMLElement): void {
  const panel = root.querySelector<HTMLElement>(".mmb-filter-panel");
  const btn = root.querySelector<HTMLElement>(".mmb-filter-btn");
  if (panel) panel.hidden = true;
  btn?.setAttribute("aria-expanded", "false");
}

function updateFilterButtonLabel(
  btn: HTMLElement,
  selected: string | null,
): void {
  const label = btn.querySelector(".mmb-filter-label");
  if (!label) return;
  const next = selected || "Filter";
  // Avoid no-op DOM writes — textContent assignment always mutates childList
  // and would re-trigger MutationObserver into a tight loop.
  if (label.textContent !== next) {
    label.textContent = next;
  }
  const shouldBeActive = !!selected;
  if (btn.classList.contains("mmb-filter-btn--active") !== shouldBeActive) {
    btn.classList.toggle("mmb-filter-btn--active", shouldBeActive);
  }
  const nextTitle = selected ? `Category: ${selected}` : "Filter by category";
  if (btn.title !== nextTitle) {
    btn.title = nextTitle;
  }
}

function renderFilterPanel(
  panel: HTMLElement,
  categories: Category[],
  selected: string | null,
): void {
  panel.replaceChildren();

  const list = document.createElement("div");
  list.className = "mmb-filter-list";

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className =
    "mmb-filter-item" + (!selected ? " mmb-filter-item--active" : "");
  allBtn.innerHTML = `<span class="mmb-filter-item-name">All categories</span>`;
  allBtn.addEventListener("click", () => {
    closeFilterPanel(panel.closest(".mmb-search-row") || panel);
    navigateCategory(null);
  });
  list.appendChild(allBtn);

  for (const cat of categories) {
    const item = document.createElement("button");
    item.type = "button";
    const isActive = selected === cat.name;
    item.className =
      "mmb-filter-item" + (isActive ? " mmb-filter-item--active" : "");
    item.innerHTML = `
      <span class="mmb-filter-item-name"></span>
      <span class="mmb-filter-item-count"></span>
    `;
    item.querySelector(".mmb-filter-item-name")!.textContent = cat.name;
    item.querySelector(".mmb-filter-item-count")!.textContent = String(
      cat.count,
    );
    item.addEventListener("click", () => {
      closeFilterPanel(panel.closest(".mmb-search-row") || panel);
      if (isActive) {
        navigateCategory(null);
      } else {
        navigateCategory(cat.slug, cat.name);
      }
    });
    list.appendChild(item);
  }

  panel.appendChild(list);
}

function syncFilterControl(header: HTMLElement): void {
  const btn = header.querySelector<HTMLElement>(".mmb-filter-btn");
  if (!btn) return;
  updateFilterButtonLabel(btn, getSelectedCategory(header));
}

function ensureFilterControl(
  searchWrap: HTMLElement,
  header: HTMLElement,
): void {
  if (searchWrap.closest(".mmb-search-row")) {
    syncFilterControl(header);
    return;
  }

  const row = document.createElement("div");
  row.className = "mmb-search-row";
  searchWrap.parentElement!.insertBefore(row, searchWrap);
  row.appendChild(searchWrap);

  const filterRoot = document.createElement("div");
  filterRoot.className = "mmb-filter";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mmb-filter-btn";
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `
    <svg class="mmb-filter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
    <span class="mmb-filter-label">Filter</span>
  `;

  const panel = document.createElement("div");
  panel.className = "mmb-filter-panel";
  panel.hidden = true;
  panel.setAttribute("role", "listbox");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = panel.hidden;
    if (open) {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      void loadCategories(header).then((cats) => {
        renderFilterPanel(panel, cats, getSelectedCategory(header));
      });
    } else {
      closeFilterPanel(row);
    }
  });

  filterRoot.appendChild(btn);
  filterRoot.appendChild(panel);
  row.appendChild(filterRoot);

  const selected = getSelectedCategory(header);
  updateFilterButtonLabel(btn, selected);
  void loadCategories(header).then((cats) => {
    renderFilterPanel(panel, cats, selected);
  });
}

function relayoutTopRow(stack: HTMLElement): void {
  if (stack.querySelector(".mmb-top-row")) return;

  const breadcrumb = stack.querySelector<HTMLElement>(
    'nav[aria-label="Breadcrumb"]',
  );
  const tabsRow = Array.from(stack.children).find((el) =>
    el.querySelector('[role="tablist"]'),
  ) as HTMLElement | undefined;

  if (!breadcrumb || !tabsRow) return;

  const topRow = document.createElement("div");
  topRow.className = "mmb-top-row";
  stack.insertBefore(topRow, breadcrumb);
  topRow.appendChild(breadcrumb);
  topRow.appendChild(tabsRow);
}

function headerNeedsEnhance(header: HTMLElement): boolean {
  return (
    !header.hasAttribute(ENHANCED_ATTR) ||
    !header.querySelector(".mmb-top-row") ||
    !header.querySelector(".mmb-filter") ||
    !header.classList.contains("mmb-search-chrome")
  );
}

export function enhanceSearchChrome(): void {
  if (!isSearchPage()) return;

  const header = getHeader();
  if (!header) return;

  const stack = getStack(header);
  if (!stack) return;

  header.classList.add("mmb-search-chrome");

  const catSection = getCategorySection(header);
  if (catSection) {
    catSection.classList.add("mmb-category-strip");
  }

  relayoutTopRow(stack);

  const searchInput = stack.querySelector<HTMLInputElement>(
    'input[name="search"]',
  );
  const searchWrap = searchInput?.closest(".flex-1") as HTMLElement | null;
  if (searchWrap) {
    ensureFilterControl(searchWrap, header);
  }

  header.setAttribute(ENHANCED_ATTR, "1");
}

function scheduleEnhance(): void {
  if (enhanceScheduled) return;
  enhanceScheduled = true;
  requestAnimationFrame(() => {
    enhanceScheduled = false;
    try {
      // Pause observation while we mutate so we don't re-enter.
      observer?.disconnect();
      enhanceSearchChrome();
    } catch (e) {
      console.error("[mcpmarket-better] enhance failed", e);
    } finally {
      observeHeader();
    }
  });
}

let observer: MutationObserver | null = null;

function observeHeader(): void {
  if (!observer) return;
  const header = getHeader();
  // Prefer the sticky chrome; fall back to body until it mounts.
  observer.observe(header ?? document.body, {
    childList: true,
    subtree: true,
  });
}

export function startSearchChromeObserver(): void {
  if (!documentListenersBound) {
    documentListenersBound = true;

    document.addEventListener("click", (e) => {
      const target = e.target as Element | null;
      if (!target?.closest?.(".mmb-filter")) {
        document.querySelectorAll(".mmb-search-row").forEach((row) => {
          closeFilterPanel(row as HTMLElement);
        });
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".mmb-search-row").forEach((row) => {
          closeFilterPanel(row as HTMLElement);
        });
      }
    });

    // Sync label on SPA navigations without re-enhancing.
    let lastHref = location.href;
    const syncFromUrl = () => {
      if (location.href === lastHref) return;
      lastHref = location.href;
      const header = getHeader();
      if (!header) return;
      if (headerNeedsEnhance(header)) {
        scheduleEnhance();
      } else {
        syncFilterControl(header);
      }
    };
    window.addEventListener("popstate", syncFromUrl);
    // Next.js client navigations often don't fire popstate; poll lightly.
    setInterval(syncFromUrl, 500);
  }

  if (!observer) {
    observer = new MutationObserver((mutations) => {
      const header = getHeader();
      if (!header) {
        scheduleEnhance();
        return;
      }

      // Ignore mutations we caused inside our own UI (filter panel renders, etc.).
      const onlyOurs = mutations.every((m) => {
        const el =
          m.target instanceof Element ? m.target : m.target.parentElement;
        return !!el?.closest?.(
          ".mmb-filter, .mmb-search-row, .mmb-top-row, .mmb-category-strip",
        );
      });
      if (onlyOurs) return;

      if (headerNeedsEnhance(header)) {
        header.removeAttribute(ENHANCED_ATTR);
        scheduleEnhance();
      }
    });
  }

  scheduleEnhance();
}
