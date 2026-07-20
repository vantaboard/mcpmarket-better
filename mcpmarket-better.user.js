// ==UserScript==
// @name             MCP Market Better
// @name:en          MCP Market Better
// @namespace        https://github.com/vantaboard/mcpmarket-better
// @version          0.1.0
// @author           Brighten Tompkins <brightenqtompkins@gmail.com>
// @description      Improves mcpmarket.com search: compact sticky chrome, soft search while typing, favorites with hearts, infinite scroll, and open-in-background tabs.
// @description:en   Improves mcpmarket.com search: compact sticky chrome, soft search while typing, favorites with hearts, infinite scroll, and open-in-background tabs.
// @match            *://mcpmarket.com/search*
// @license          MIT
// @grant            GM.xmlHttpRequest
// @grant            GM.setValue
// @grant            GM.getValue
// @grant            GM.openInTab
// @run-at           document-end
// ==/UserScript==

/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/less-loader@13.0.0_less@4.7.0_webpack@5.108.4/node_modules/less-loader/dist/cjs/index.js!./src/style/main.less"(
      module,
      __webpack_exports__,
      __webpack_require__,
    ) {
      /* harmony import */ var _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(
          "./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/runtime/noSourceMaps.js",
        );
      /* harmony import */ var _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default =
        /*#__PURE__*/ __webpack_require__.n(
          _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__,
        );
      /* harmony import */ var _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(
          "./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/runtime/api.js",
        );
      /* harmony import */ var _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default =
        /*#__PURE__*/ __webpack_require__.n(
          _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__,
        );
      // Imports

      var ___CSS_LOADER_EXPORT___ =
        _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(
          _node_modules_pnpm_css_loader_7_1_4_webpack_5_108_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default(),
        );
      // Module
      ___CSS_LOADER_EXPORT___.push([
        module.id,
        `/* On /search: let the main site nav (MCP Market logo bar) scroll away… */
body:has(header.sticky.top-14) header.sticky.top-0 {
  position: relative !important;
  top: auto !important;
  /* Stay above the search chrome so nav dropdowns aren't covered */
  z-index: 60 !important;
}
/* …and keep only the search chrome sticky at the top of the viewport. */
header.sticky.top-14 {
  position: sticky !important;
  top: 0 !important;
  /* Below site-nav (z-60) so MCP Servers / Agent Skills menus overlay it */
  z-index: 40 !important;
  /* Solid gray fill (host uses translucent bg + blur) */
  background-color: hsl(0, 0%, 9%) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  /* Host grid-line overlay: absolute inset-0 + linear-gradient bg */
  /* Narrower side padding than results (px-6/md:px-8) so the search row
     spans wider than the card grid below. */
  /* One line: [ search .... ] [ tabs ] [ Favorites ] [ Filter ] */
  /* Icon-only type tabs; labels via title/aria-label tooltips */
  /* Promote search + filter into the parent grid */
  /* Hide category chips without removing React nodes */
}
header.sticky.top-14 > .pointer-events-none.absolute.inset-0,
header.sticky.top-14 > div.pointer-events-none.absolute.inset-0 {
  display: none !important;
}
header.sticky.top-14 section.py-4 {
  padding-top: 0.375rem !important;
  padding-bottom: 0.375rem !important;
}
header.sticky.top-14 section.py-4 > .container {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}
header.sticky.top-14 section.py-4 .flex.flex-col {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  grid-template-rows: auto;
  gap: 0.5rem !important;
  align-items: center;
}
header.sticky.top-14 section.py-4 .flex.flex-col > * + * {
  margin-top: 0 !important;
}
header.sticky.top-14 section.py-4 .flex.flex-col > nav[aria-label="Breadcrumb"] {
  display: none !important;
}
header.sticky.top-14 section.py-4 .flex.flex-col > div:has([role="tablist"]) {
  grid-column: 2;
  grid-row: 1;
}
header.sticky.top-14 [role="tablist"] [role="tab"] {
  gap: 0 !important;
  padding-left: 0.625rem !important;
  padding-right: 0.625rem !important;
}
header.sticky.top-14 [role="tablist"] [role="tab"] > span {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
header.sticky.top-14 section.py-4 .flex.flex-col > .mmb-search-row {
  display: contents;
}
header.sticky.top-14 section.py-4 .flex.flex-col .mmb-search-row > .flex-1:has(input[name="search"]) {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}
header.sticky.top-14 section.py-4 .flex.flex-col .mmb-search-row > .mmb-fav-mode-btn {
  grid-column: 3;
  grid-row: 1;
  align-self: stretch;
}
header.sticky.top-14 section.py-4 .flex.flex-col .mmb-search-row > .mmb-filter {
  grid-column: 4;
  grid-row: 1;
  align-self: stretch;
}
header.sticky.top-14 > section.border-t {
  display: none !important;
}
@media (min-width: 768px) {
  header.sticky.top-14 section.py-4 > .container {
    /* Results use md:px-8 (2rem); stay tighter so search stays wider */
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
/* Tighten the gap between sticky search chrome and the results grid */
body:has(header.sticky.top-14) main.relative > .py-8,
body:has(header.sticky.top-14) main .py-8.md\\:py-12,
body:has(header.sticky.top-14) .py-8.md\\:py-12 {
  padding-top: 0.75rem !important;
  padding-bottom: 1.5rem !important;
}
@media (min-width: 768px) {
  body:has(header.sticky.top-14) .py-8.md\\:py-12 {
    padding-top: 1rem !important;
    padding-bottom: 2rem !important;
  }
}
.mmb-fav-mode-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.mmb-fav-mode-btn:hover {
  color: hsl(var(--foreground));
  background: hsl(var(--muted) / 0.5);
}
.mmb-fav-mode-btn.mmb-fav-mode-btn--active {
  border-color: hsl(0, 72%, 51%);
  background: hsla(0, 72%, 51%, 0.12);
  color: hsl(0, 72%, 45%);
}
.mmb-fav-mode-btn.mmb-fav-mode-btn--active svg {
  fill: currentColor;
}
.mmb-card-actions {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.125rem;
  margin-left: 0.25rem;
}
.mmb-card-actions > svg {
  margin-top: 0 !important;
  display: block;
}
.mmb-fav-heart {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: hsl(var(--muted-foreground) / 0.55);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}
.mmb-fav-heart svg {
  display: block;
  width: 1rem;
  height: 1rem;
}
.mmb-fav-heart:hover {
  color: hsl(0, 72%, 45%);
  background: hsl(var(--muted) / 0.5);
}
.mmb-fav-heart.mmb-fav-heart--active {
  color: hsl(0, 72%, 45%);
}
.mmb-fav-heart.mmb-fav-heart--active svg {
  fill: currentColor;
}
.mmb-filter {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
}
.mmb-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.75rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  color: hsl(var(--muted-foreground));
  font-family: var(--font-geist-mono, ui-monospace, monospace);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.mmb-filter-btn:hover {
  color: hsl(var(--foreground));
  background: hsl(var(--muted) / 0.5);
}
.mmb-filter-btn.mmb-filter-btn--active {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
.mmb-filter-icon {
  flex-shrink: 0;
}
.mmb-filter-label {
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mmb-filter-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 50;
  width: max-content;
  min-width: 16rem;
  max-width: min(28rem, calc(100vw - 2rem));
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--popover, var(--card)));
  padding: 0.5rem;
  box-shadow: none;
}
.mmb-filter-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.mmb-filter-item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}
.mmb-filter-item:hover {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
.mmb-filter-item.mmb-filter-item--active {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
.mmb-filter-item.mmb-filter-item--active .mmb-filter-item-count {
  background: hsl(var(--primary-foreground) / 0.15);
  color: hsl(var(--primary-foreground));
}
.mmb-filter-item-name {
  flex: 1 1 auto;
  white-space: nowrap;
  padding-right: 0.75rem;
}
.mmb-filter-item-count {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: hsl(var(--muted));
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
}
@media (max-width: 640px) {
  header.sticky.top-14 section.py-4 .flex.flex-col {
    grid-template-columns: minmax(0, 1fr) auto auto;
    grid-template-rows: auto auto;
  }
  header.sticky.top-14 section.py-4 .flex.flex-col .mmb-search-row > .flex-1:has(input[name="search"]) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  header.sticky.top-14 section.py-4 .flex.flex-col > div:has([role="tablist"]) {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
  }
  header.sticky.top-14 section.py-4 .flex.flex-col .mmb-search-row > .mmb-fav-mode-btn {
    grid-column: 2;
    grid-row: 2;
  }
  header.sticky.top-14 section.py-4 .flex.flex-col .mmb-search-row > .mmb-filter {
    grid-column: 3;
    grid-row: 2;
  }
  .mmb-filter-label {
    max-width: 6rem;
  }
}
/* Infinite scroll replaces the host control */
button.mmb-load-more,
button[data-mmb-load-more="1"] {
  display: none !important;
}
.mmb-infinite-sentinel {
  width: 100%;
  height: 1px;
  margin: 0;
  padding: 0;
  pointer-events: none;
  visibility: hidden;
}
`,
        "",
      ]);
      // Exports
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
        ___CSS_LOADER_EXPORT___;

      /* harmony export */ __webpack_require__.d(__webpack_exports__, [
        /* harmony export */ "A",
        0,
        /* export default binding */ __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      ]);

      /***/
    },

    /***/ "./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/runtime/api.js"(
      module,
    ) {
      /*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
      module.exports = function (cssWithMappingToString) {
        var list = [];

        // return the list of modules as css string
        list.toString = function toString() {
          return this.map(function (item) {
            var content = "";
            var needLayer = typeof item[5] !== "undefined";
            if (item[4]) {
              content += "@supports (".concat(item[4], ") {");
            }
            if (item[2]) {
              content += "@media ".concat(item[2], " {");
            }
            if (needLayer) {
              content += "@layer".concat(
                item[5].length > 0 ? " ".concat(item[5]) : "",
                " {",
              );
            }
            content += cssWithMappingToString(item);
            if (needLayer) {
              content += "}";
            }
            if (item[2]) {
              content += "}";
            }
            if (item[4]) {
              content += "}";
            }
            return content;
          }).join("");
        };

        // import a list of modules into the list
        list.i = function i(modules, media, dedupe, supports, layer) {
          if (typeof modules === "string") {
            modules = [[null, modules, undefined]];
          }
          var alreadyImportedModules = {};
          if (dedupe) {
            for (var k = 0; k < this.length; k++) {
              var id = this[k][0];
              if (id != null) {
                alreadyImportedModules[id] = true;
              }
            }
          }
          for (var _k = 0; _k < modules.length; _k++) {
            var item = [].concat(modules[_k]);
            if (dedupe && alreadyImportedModules[item[0]]) {
              continue;
            }
            if (typeof layer !== "undefined") {
              if (typeof item[5] === "undefined") {
                item[5] = layer;
              } else {
                item[1] = "@layer"
                  .concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")
                  .concat(item[1], "}");
                item[5] = layer;
              }
            }
            if (media) {
              if (!item[2]) {
                item[2] = media;
              } else {
                item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                item[2] = media;
              }
            }
            if (supports) {
              if (!item[4]) {
                item[4] = "".concat(supports);
              } else {
                item[1] = "@supports ("
                  .concat(item[4], ") {")
                  .concat(item[1], "}");
                item[4] = supports;
              }
            }
            list.push(item);
          }
        };
        return list;
      };

      /***/
    },

    /***/ "./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/runtime/noSourceMaps.js"(
      module,
    ) {
      module.exports = function (i) {
        return i[1];
      };

      /***/
    },

    /***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"(
      module,
    ) {
      var stylesInDOM = [];
      function getIndexByIdentifier(identifier) {
        var result = -1;
        for (var i = 0; i < stylesInDOM.length; i++) {
          if (stylesInDOM[i].identifier === identifier) {
            result = i;
            break;
          }
        }
        return result;
      }
      function modulesToDom(list, options) {
        var idCountMap = {};
        var identifiers = [];
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var id = options.base ? item[0] + options.base : item[0];
          var count = idCountMap[id] || 0;
          var identifier = "".concat(id, " ").concat(count);
          idCountMap[id] = count + 1;
          var indexByIdentifier = getIndexByIdentifier(identifier);
          var obj = {
            css: item[1],
            media: item[2],
            sourceMap: item[3],
            supports: item[4],
            layer: item[5],
          };
          if (indexByIdentifier !== -1) {
            stylesInDOM[indexByIdentifier].references++;
            stylesInDOM[indexByIdentifier].updater(obj);
          } else {
            var updater = addElementStyle(obj, options);
            options.byIndex = i;
            stylesInDOM.splice(i, 0, {
              identifier: identifier,
              updater: updater,
              references: 1,
            });
          }
          identifiers.push(identifier);
        }
        return identifiers;
      }
      function addElementStyle(obj, options) {
        var api = options.domAPI(options);
        api.update(obj);
        var updater = function updater(newObj) {
          if (newObj) {
            if (
              newObj.css === obj.css &&
              newObj.media === obj.media &&
              newObj.sourceMap === obj.sourceMap &&
              newObj.supports === obj.supports &&
              newObj.layer === obj.layer
            ) {
              return;
            }
            api.update((obj = newObj));
          } else {
            api.remove();
          }
        };
        return updater;
      }
      module.exports = function (list, options) {
        options = options || {};
        list = list || [];
        var lastIdentifiers = modulesToDom(list, options);
        return function update(newList) {
          newList = newList || [];
          for (var i = 0; i < lastIdentifiers.length; i++) {
            var identifier = lastIdentifiers[i];
            var index = getIndexByIdentifier(identifier);
            stylesInDOM[index].references--;
          }
          var newLastIdentifiers = modulesToDom(newList, options);
          for (var _i = 0; _i < lastIdentifiers.length; _i++) {
            var _identifier = lastIdentifiers[_i];
            var _index = getIndexByIdentifier(_identifier);
            if (stylesInDOM[_index].references === 0) {
              stylesInDOM[_index].updater();
              stylesInDOM.splice(_index, 1);
            }
          }
          lastIdentifiers = newLastIdentifiers;
        };
      };

      /***/
    },

    /***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/insertBySelector.js"(
      module,
    ) {
      var memo = {};

      /* istanbul ignore next  */
      function getTarget(target) {
        if (typeof memo[target] === "undefined") {
          var styleTarget = document.querySelector(target);

          // Special case to return head of iframe instead of iframe itself
          if (
            window.HTMLIFrameElement &&
            styleTarget instanceof window.HTMLIFrameElement
          ) {
            try {
              // This will throw an exception if access to iframe is blocked
              // due to cross-origin restrictions
              styleTarget = styleTarget.contentDocument.head;
            } catch (e) {
              // istanbul ignore next
              styleTarget = null;
            }
          }
          memo[target] = styleTarget;
        }
        return memo[target];
      }

      /* istanbul ignore next  */
      function insertBySelector(insert, style) {
        var target = getTarget(insert);
        if (!target) {
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        }
        target.appendChild(style);
      }
      module.exports = insertBySelector;

      /***/
    },

    /***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/insertStyleElement.js"(
      module,
    ) {
      /* istanbul ignore next  */
      function insertStyleElement(options) {
        var element = document.createElement("style");
        options.setAttributes(element, options.attributes);
        options.insert(element, options.options);
        return element;
      }
      module.exports = insertStyleElement;

      /***/
    },

    /***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"(
      module,
      __unused_webpack_exports,
      __webpack_require__,
    ) {
      /* istanbul ignore next  */
      function setAttributesWithoutAttributes(styleElement) {
        var nonce = true ? __webpack_require__.nc : 0;
        if (nonce) {
          styleElement.setAttribute("nonce", nonce);
        }
      }
      module.exports = setAttributesWithoutAttributes;

      /***/
    },

    /***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/styleDomAPI.js"(
      module,
    ) {
      /* istanbul ignore next  */
      function apply(styleElement, options, obj) {
        var css = "";
        if (obj.supports) {
          css += "@supports (".concat(obj.supports, ") {");
        }
        if (obj.media) {
          css += "@media ".concat(obj.media, " {");
        }
        var needLayer = typeof obj.layer !== "undefined";
        if (needLayer) {
          css += "@layer".concat(
            obj.layer.length > 0 ? " ".concat(obj.layer) : "",
            " {",
          );
        }
        css += obj.css;
        if (needLayer) {
          css += "}";
        }
        if (obj.media) {
          css += "}";
        }
        if (obj.supports) {
          css += "}";
        }
        var sourceMap = obj.sourceMap;
        if (sourceMap && typeof btoa !== "undefined") {
          css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))),
            " */",
          );
        }

        // For old IE
        /* istanbul ignore if  */
        options.styleTagTransform(css, styleElement, options.options);
      }
      function removeStyleElement(styleElement) {
        // istanbul ignore if
        if (styleElement.parentNode === null) {
          return false;
        }
        styleElement.parentNode.removeChild(styleElement);
      }

      /* istanbul ignore next  */
      function domAPI(options) {
        if (typeof document === "undefined") {
          return {
            update: function update() {},
            remove: function remove() {},
          };
        }
        var styleElement = options.insertStyleElement(options);
        return {
          update: function update(obj) {
            apply(styleElement, options, obj);
          },
          remove: function remove() {
            removeStyleElement(styleElement);
          },
        };
      }
      module.exports = domAPI;

      /***/
    },

    /***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/styleTagTransform.js"(
      module,
    ) {
      /* istanbul ignore next  */
      function styleTagTransform(css, styleElement) {
        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = css;
        } else {
          while (styleElement.firstChild) {
            styleElement.removeChild(styleElement.firstChild);
          }
          styleElement.appendChild(document.createTextNode(css));
        }
      }
      module.exports = styleTagTransform;

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ const __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ const cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ const module = (__webpack_module_cache__[moduleId] = {
      /******/ id: moduleId,
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__,
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat get default export */
  /******/ (() => {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = (module) => {
      /******/ const getter =
        module && module.__esModule
          ? /******/ () => module["default"]
          : /******/ () => module;
      /******/ __webpack_require__.d(getter, { a: getter });
      /******/ return getter;
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter/value functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ if (Array.isArray(definition)) {
        /******/ var i = 0;
        /******/ while (i < definition.length) {
          /******/ var key = definition[i++];
          /******/ var binding = definition[i++];
          /******/ if (!__webpack_require__.o(exports, key)) {
            /******/ if (binding === 0) {
              /******/ Object.defineProperty(exports, key, {
                enumerable: true,
                value: definition[i++],
              });
              /******/
            } else {
              /******/ Object.defineProperty(exports, key, {
                enumerable: true,
                get: binding,
              });
              /******/
            }
            /******/
          } else if (binding === 0) {
            i++;
          }
          /******/
        }
        /******/
      } else {
        /******/ for (var key in definition) {
          /******/ if (
            __webpack_require__.o(definition, key) &&
            !__webpack_require__.o(exports, key)
          ) {
            /******/ Object.defineProperty(exports, key, {
              enumerable: true,
              get: definition[key],
            });
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/nonce */
  /******/ (() => {
    /******/ __webpack_require__.nc = undefined;
    /******/
  })();
  /******/
  /************************************************************************/
  let __webpack_exports__ = {};

  // EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
  var injectStylesIntoStyleTag = __webpack_require__(
    "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js",
  );
  var injectStylesIntoStyleTag_default = /*#__PURE__*/ __webpack_require__.n(
    injectStylesIntoStyleTag,
  );
  // EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/styleDomAPI.js
  var styleDomAPI = __webpack_require__(
    "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/styleDomAPI.js",
  );
  var styleDomAPI_default = /*#__PURE__*/ __webpack_require__.n(styleDomAPI);
  // EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/insertBySelector.js
  var insertBySelector = __webpack_require__(
    "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/insertBySelector.js",
  );
  var insertBySelector_default =
    /*#__PURE__*/ __webpack_require__.n(insertBySelector);
  // EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
  var setAttributesWithoutAttributes = __webpack_require__(
    "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js",
  );
  var setAttributesWithoutAttributes_default =
    /*#__PURE__*/ __webpack_require__.n(setAttributesWithoutAttributes);
  // EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/insertStyleElement.js
  var insertStyleElement = __webpack_require__(
    "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/insertStyleElement.js",
  );
  var insertStyleElement_default =
    /*#__PURE__*/ __webpack_require__.n(insertStyleElement);
  // EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/styleTagTransform.js
  var styleTagTransform = __webpack_require__(
    "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.108.4/node_modules/style-loader/dist/runtime/styleTagTransform.js",
  );
  var styleTagTransform_default =
    /*#__PURE__*/ __webpack_require__.n(styleTagTransform);
  // EXTERNAL MODULE: ./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/less-loader@13.0.0_less@4.7.0_webpack@5.108.4/node_modules/less-loader/dist/cjs/index.js!./src/style/main.less
  var main = __webpack_require__(
    "./node_modules/.pnpm/css-loader@7.1.4_webpack@5.108.4/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/less-loader@13.0.0_less@4.7.0_webpack@5.108.4/node_modules/less-loader/dist/cjs/index.js!./src/style/main.less",
  ); // ./src/style/main.less
  var options = {};

  options.styleTagTransform = styleTagTransform_default();
  options.setAttributes = setAttributesWithoutAttributes_default();
  options.insert = insertBySelector_default().bind(null, "head");
  options.domAPI = styleDomAPI_default();
  options.insertStyleElement = insertStyleElement_default();

  var update = injectStylesIntoStyleTag_default()(
    main /* default */.A,
    options,
  );

  /* harmony default export */ const style_main =
    main /* default */.A && main /* default */.A.locals
      ? main /* default */.A.locals
      : undefined; // ./src/card-navigation.ts

  const CARD_SEL = 'a[id^="tool-card-"]';
  const HEART_SEL = ".mmb-fav-heart";
  let listenersBound = false;
  function isSearchPage() {
    return location.pathname.includes("/search");
  }
  function getOpenInTab() {
    const gm = typeof GM !== "undefined" ? GM : null;
    if (gm && typeof gm.openInTab === "function") {
      return gm.openInTab.bind(gm);
    }
    // Legacy grant name some managers expose.
    const legacy = globalThis.GM_openInTab;
    return typeof legacy === "function" ? legacy : null;
  }
  /** Open URL in a new tab without focusing away from search when possible. */
  function openInBackground(url) {
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
  function onCardClick(e) {
    if (!isSearchPage()) return;
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    // Modifier clicks: keep native new-tab behavior.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target;
    if (!target?.closest) return;
    if (target.closest(HEART_SEL)) return;
    const card = target.closest(CARD_SEL);
    if (!card?.href) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (!openInBackground(card.href)) {
      // Absolute last resort — same-tab navigation.
      location.assign(card.href);
    }
  }
  function startCardNavigation() {
    if (listenersBound) return;
    listenersBound = true;
    document.addEventListener("click", onCardClick, true);
  } // ./src/favorites-heart.ts

  const HEART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
  function renderHeartButton(id, active) {
    const activeClass = active ? " mmb-fav-heart--active" : "";
    const pressed = active ? "true" : "false";
    return `<button type="button" class="mmb-fav-heart${activeClass}" data-mmb-fav-id="${escapeAttr(id)}" aria-label="Favorite" title="Favorite" aria-pressed="${pressed}">${HEART_SVG}</button>`;
  }
  function createHeartButton(id, active) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = active
      ? "mmb-fav-heart mmb-fav-heart--active"
      : "mmb-fav-heart";
    btn.setAttribute("data-mmb-fav-id", id);
    btn.setAttribute("aria-label", "Favorite");
    btn.setAttribute("title", "Favorite");
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.innerHTML = HEART_SVG;
    return btn;
  }
  function setHeartActive(btn, active) {
    btn.classList.toggle("mmb-fav-heart--active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("fill", active ? "currentColor" : "none");
    }
  }
  function escapeAttr(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  } // ./src/favorites-mode.ts

  let favoritesMode = false;
  let refreshFavoritesGrid = null;
  let favoritesScrollY = 0;
  function isFavoritesMode() {
    return favoritesMode;
  }
  function setFavoritesMode(on) {
    favoritesMode = on;
    document.documentElement.classList.toggle("mmb-fav-mode", on);
  }
  function getFavoritesScrollY() {
    return favoritesScrollY;
  }
  function setFavoritesScrollY(y) {
    favoritesScrollY = y;
  }
  /** Clear when the favorites filter (q/type/category) changes. */
  function resetFavoritesScrollY() {
    favoritesScrollY = 0;
  }
  function registerFavoritesGridRefresh(fn) {
    refreshFavoritesGrid = fn;
  }
  /** Re-render favorites grid when mode is on (e.g. after soft URL/q updates). */
  function refreshFavoritesIfActive() {
    if (favoritesMode) refreshFavoritesGrid?.();
  } // ./src/favorites-store.ts

  const STORAGE_KEY = "mmb.favorites";
  let cache = null;
  function favoriteId(type, slug) {
    return `${type}:${slug}`;
  }
  async function loadFavorites() {
    if (cache) return cache;
    try {
      const raw = await GM.getValue(STORAGE_KEY, "[]");
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      cache = Array.isArray(parsed) ? parsed : [];
    } catch {
      cache = [];
    }
    return cache;
  }
  async function saveFavorites(list) {
    cache = list;
    try {
      const ret = GM.setValue(STORAGE_KEY, JSON.stringify(list));
      // Some GM hosts return a thenable that never settles; don't hang callers.
      await Promise.race([
        Promise.resolve(ret),
        new Promise((resolve) => {
          setTimeout(resolve, 250);
        }),
      ]);
    } catch (e) {
      console.error("[mcpmarket-better] save favorites failed", e);
    }
  }
  async function isFavorite(id) {
    const list = await loadFavorites();
    return list.some((f) => f.id === id);
  }
  /** Sync check against in-memory cache (false until loadFavorites has run). */
  function isFavoriteSync(id) {
    return cache?.some((f) => f.id === id) ?? false;
  }
  async function toggleFavorite(item) {
    const list = [...(await loadFavorites())];
    const id = item.id || favoriteId(item.type, item.slug);
    const idx = list.findIndex((f) => f.id === id);
    if (idx >= 0) {
      list.splice(idx, 1);
      await saveFavorites(list);
      return { list, added: false };
    }
    const next = {
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
  function clearFavoritesCache() {
    cache = null;
  } // ./src/search-params.ts

  function readSearchParams() {
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
  function buildSearchUrl(updates = {}) {
    const current = readSearchParams();
    const next = {
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
  function navigateSearch(updates = {}) {
    const next = buildSearchUrl(updates);
    const current = location.pathname + location.search + location.hash;
    if (next === current) return;
    location.assign(next);
  }
  /** Update the address bar without a page navigation (no skeleton flash). */
  function replaceSearchUrl(updates = {}) {
    const next = buildSearchUrl(updates);
    const current = location.pathname + location.search + location.hash;
    if (next === current) return;
    history.replaceState(history.state, "", next);
  } // ./src/soft-search.ts

  const PAGE_LIMIT = 21;
  const GRID_SEL =
    'div.grid.gap-6[data-mmb-results], div.grid.gap-6:has(a[id^="tool-card-"])';
  let softState = null;
  let cachedGrid = null;
  let abortController = null;
  let requestSeq = 0;
  let loadMoreBound = false;
  let loadMoreInFlight = false;
  let infiniteScrollStarted = false;
  let sentinelVisible = false;
  let infiniteObserver = null;
  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function formatStars(n) {
    if (n >= 1000) {
      const k = n / 1000;
      const rounded = Math.round(k * 10) / 10;
      return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded}k`;
    }
    return String(n);
  }
  function avatarSrc(url) {
    if (!url) return "";
    if (url.includes("avatars.githubusercontent.com") && !url.includes("s=")) {
      return url.includes("?") ? `${url}&s=40` : `${url}?s=40`;
    }
    return url;
  }
  function itemHref(item, isSkills) {
    if (isSkills || item.type === "skills" || item.type === "skill") {
      return `/skill/${item.slug}`;
    }
    return `/server/${item.slug}`;
  }
  function categoryLabel(item) {
    return item.categories?.[0]?.name || item.category_name || "";
  }
  function renderResultCard(item, isSkills) {
    const href = itemHref(item, isSkills);
    const name = escapeHtml(item.name || "");
    const desc = escapeHtml(item.description || "");
    const owner = escapeHtml(item.owner_name || "");
    const avatar = escapeHtml(avatarSrc(item.owner_avatar));
    const cat = escapeHtml(categoryLabel(item));
    const stars = item.github_stars ?? 0;
    const type =
      isSkills || item.type === "skills" || item.type === "skill"
        ? "skills"
        : "server";
    const favId = favoriteId(type, item.slug);
    const heart = renderHeartButton(favId, isFavoriteSync(favId));
    const avatarHtml = avatar
      ? `<img alt="${owner}" loading="lazy" width="20" height="20" decoding="async" class="shrink-0 rounded-full object-cover opacity-50 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0" src="${avatar}" style="color: transparent;">`
      : `<span class="shrink-0 h-5 w-5 rounded-full bg-muted"></span>`;
    const starsHtml =
      stars > 0
        ? `<div class="flex items-center font-geist-mono text-xs text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-3 w-3 fill-muted-foreground/30 text-muted-foreground"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>${escapeHtml(formatStars(stars))}</div>`
        : "";
    const catHtml = cat
      ? `<div class="inline-flex items-center border transition-colors rounded-lg border-border px-1.5 py-0 font-geist-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">${cat}</div>`
      : "";
    return `<a id="tool-card-${escapeHtml(item.slug)}" class="group block h-full" href="${escapeHtml(href)}" data-mmb-soft="1"><div class="group relative h-full rounded-lg border border-border bg-card transition-colors duration-200 hover:border-foreground/20 hover:bg-accent/50"><div class="flex h-full flex-col p-5"><div class="mb-3 flex items-center justify-between gap-2"><div class="flex min-w-0 items-center gap-2.5">${avatarHtml}<h3 class="line-clamp-1 font-geist-mono text-base font-semibold text-foreground transition-colors group-hover:text-foreground/80">${name}</h3></div><div class="mmb-card-actions">${heart}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground/60"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></div></div><p class="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">${desc}</p><div class="mt-auto flex items-center justify-between"><div class="flex items-center gap-2">${catHtml}</div>${starsHtml}</div></div></div></a>`;
  }
  function renderCard(item, isSkills) {
    return renderResultCard(item, isSkills);
  }
  function renderEmptyState(q) {
    const query = q ? ` for “${escapeHtml(q)}”` : "";
    return `<div class="mmb-empty-results" data-mmb-empty="1" style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center;">
    <p class="font-geist-mono text-base font-semibold text-foreground" style="margin: 0 0 0.5rem;">No search results${query}</p>
    <p class="text-sm text-muted-foreground" style="margin: 0;">Try a different query or clear the category filter.</p>
  </div>`;
  }
  function findResultsGrid() {
    if (cachedGrid?.isConnected) return cachedGrid;
    const found = document.querySelector(GRID_SEL);
    if (found) {
      found.setAttribute("data-mmb-results", "1");
      cachedGrid = found;
      return found;
    }
    // Fallback: common host results grid class without requiring cards.
    const fallback = document.querySelector(
      "div.grid.gap-6.sm\\:grid-cols-1, div.grid.gap-6.md\\:grid-cols-2",
    );
    if (fallback) {
      fallback.setAttribute("data-mmb-results", "1");
      cachedGrid = fallback;
      return fallback;
    }
    cachedGrid = null;
    return null;
  }
  function getResultsGrid() {
    return findResultsGrid();
  }
  function findLoadMoreButton() {
    const marked = document.querySelector(
      "button[data-mmb-load-more], button.mmb-load-more",
    );
    if (marked) return marked;
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (/load more/i.test(btn.textContent || "")) {
        btn.setAttribute("data-mmb-load-more", "1");
        btn.classList.add("mmb-load-more");
        return btn;
      }
    }
    return null;
  }
  function hostHasLoadMore() {
    return !!findLoadMoreButton();
  }
  /** Seed soft pagination from the host page so infinite scroll works before typing. */
  function ensureSoftStateFromPage() {
    if (softState || isFavoritesMode()) return;
    const grid = findResultsGrid();
    if (!grid?.querySelector('a[id^="tool-card-"]')) return;
    softState = {
      page: 1,
      hasMore: hostHasLoadMore(),
      params: readSearchParams(),
      requestId: requestSeq,
    };
  }
  function ensureInfiniteSentinel() {
    const grid = findResultsGrid();
    if (!grid) return null;
    let sentinel = document.querySelector(".mmb-infinite-sentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.className = "mmb-infinite-sentinel";
      sentinel.setAttribute("aria-hidden", "true");
    }
    // Keep the sentinel just after the results grid (before Browse by Category).
    if (sentinel.previousElementSibling !== grid) {
      grid.after(sentinel);
    }
    return sentinel;
  }
  function syncInfiniteSentinel(hasMore) {
    const sentinel = ensureInfiniteSentinel();
    if (!sentinel || !infiniteObserver) return;
    if (hasMore && !isFavoritesMode()) {
      sentinel.hidden = false;
      infiniteObserver.observe(sentinel);
    } else {
      sentinel.hidden = true;
      infiniteObserver.unobserve(sentinel);
      sentinelVisible = false;
    }
  }
  async function maybeLoadMore() {
    if (!sentinelVisible || isFavoritesMode() || loadMoreInFlight) return;
    ensureSoftStateFromPage();
    if (!softState?.hasMore) {
      syncLoadMoreButton(false);
      return;
    }
    await loadMoreSoft();
    // Still near the bottom with more pages — keep going.
    if (sentinelVisible && softState?.hasMore && !isFavoritesMode()) {
      void maybeLoadMore();
    }
  }
  function buildListUrl(params, page) {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("limit", String(PAGE_LIMIT));
    if (params.type === "skills") {
      qs.set("type", "skills");
    } else {
      qs.set("type", "server");
    }
    if (params.q) qs.set("q", params.q);
    if (params.category_slug) qs.set("category_slug", params.category_slug);
    return `/api/list?${qs.toString()}`;
  }
  class SoftSearchHalt extends Error {
    constructor(message) {
      super(message);
      this.name = "SoftSearchHalt";
    }
  }
  async function fetchList(params, page, signal) {
    const isSkills = params.type === "skills";
    // Manual redirects so a 301/302 does not get followed into a loop.
    const res = await fetch(buildListUrl(params, page), {
      signal,
      redirect: "manual",
    });
    if (
      res.type === "opaqueredirect" ||
      (res.status >= 300 && res.status < 400)
    ) {
      throw new SoftSearchHalt(`redirect ${res.status || "opaque"}`);
    }
    if (!res.ok) {
      throw new SoftSearchHalt(`list ${res.status}`);
    }
    const data = await res.json();
    const items = isSkills ? data.skills || [] : data.tools || [];
    const hasMore = !!data.pagination?.hasMore;
    return { items, hasMore, isSkills };
  }
  function ensureLoadMoreHandler() {
    if (loadMoreBound) return;
    loadMoreBound = true;
    document.addEventListener(
      "click",
      (e) => {
        if (isFavoritesMode()) return;
        ensureSoftStateFromPage();
        if (!softState?.hasMore) return;
        const target = e.target;
        const btn = target?.closest?.("button");
        if (
          !btn ||
          !(
            btn.hasAttribute("data-mmb-load-more") ||
            btn.classList.contains("mmb-load-more") ||
            /load more/i.test(btn.textContent || "")
          )
        ) {
          return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        void maybeLoadMore();
      },
      true,
    );
  }
  function syncLoadMoreButton(hasMore) {
    const btn = findLoadMoreButton();
    if (btn) {
      btn.setAttribute("data-mmb-load-more", "1");
      btn.classList.add("mmb-load-more");
      // Infinite scroll replaces the control — keep it out of the way.
      btn.hidden = true;
      btn.style.display = "none";
      btn.disabled = true;
      btn.setAttribute("aria-hidden", "true");
    }
    syncInfiniteSentinel(hasMore && !isFavoritesMode());
  }
  function syncLoadMoreVisibility(hasMore) {
    syncLoadMoreButton(hasMore);
  }
  /** Capture results HTML + pagination so Favorites mode can restore place. */
  function captureResultsView() {
    const grid = findResultsGrid();
    if (!grid) return null;
    return {
      gridHTML: grid.innerHTML,
      href: location.pathname + location.search + location.hash,
      softState: softState
        ? {
            page: softState.page,
            hasMore: softState.hasMore,
            requestId: softState.requestId,
            params: { ...softState.params },
          }
        : null,
    };
  }
  /** Restore a prior results view without refetching (preserves scroll target). */
  function restoreResultsView(snapshot) {
    const grid = findResultsGrid();
    if (!grid) return false;
    grid.innerHTML = snapshot.gridHTML;
    softState = snapshot.softState
      ? {
          page: snapshot.softState.page,
          hasMore: snapshot.softState.hasMore,
          requestId: snapshot.softState.requestId,
          params: { ...snapshot.softState.params },
        }
      : null;
    const current = location.pathname + location.search + location.hash;
    if (snapshot.href && snapshot.href !== current) {
      history.replaceState(history.state, "", snapshot.href);
    }
    syncLoadMoreButton(!!softState?.hasMore);
    return true;
  }
  function showEmpty(grid, q) {
    grid.innerHTML = renderEmptyState(q);
    syncLoadMoreButton(false);
    if (softState) softState.hasMore = false;
  }
  async function loadMoreSoft() {
    if (isFavoritesMode()) return;
    if (!softState?.hasMore) return;
    if (loadMoreInFlight) return;
    const grid = findResultsGrid();
    if (!grid) return;
    loadMoreInFlight = true;
    const nextPage = softState.page + 1;
    const myId = ++requestSeq;
    softState.requestId = myId;
    // Don't abort an in-flight first-page softSearch from a stray load-more;
    // only replace the shared controller for this pagination request.
    const localAbort = new AbortController();
    abortController = localAbort;
    try {
      const { items, hasMore, isSkills } = await fetchList(
        softState.params,
        nextPage,
        localAbort.signal,
      );
      if (myId !== requestSeq || !softState) return;
      if (items.length === 0) {
        softState.hasMore = false;
        syncLoadMoreButton(false);
        return;
      }
      const html = items.map((item) => renderCard(item, isSkills)).join("");
      grid.insertAdjacentHTML("beforeend", html);
      softState.page = nextPage;
      softState.hasMore = hasMore;
      syncLoadMoreButton(hasMore);
    } catch (e) {
      if (e?.name === "AbortError") return;
      if (e instanceof SoftSearchHalt) {
        if (softState) softState.hasMore = false;
        syncLoadMoreButton(false);
        return;
      }
      console.error("[mcpmarket-better] soft load more failed", e);
    } finally {
      loadMoreInFlight = false;
    }
  }
  function mergeParams(updates) {
    const current = readSearchParams();
    return {
      q: updates.q !== undefined ? updates.q : current.q,
      category_slug:
        updates.category_slug !== undefined
          ? updates.category_slug
          : current.category_slug,
      type: updates.type !== undefined ? updates.type : current.type,
    };
  }
  function searchQueryChanged(a, b) {
    return (
      a.q !== b.q || a.category_slug !== b.category_slug || a.type !== b.type
    );
  }
  function scrollResultsToTop() {
    window.scrollTo(0, 0);
  }
  /**
   * Update results in-place and sync the URL via replaceState — no full
   * navigation, so the sticky search chrome does not remount/skeleton.
   * Returns false only when there is no results container to update.
   * Redirects / empty / errors show an empty state and still return true
   * so callers must not fall back to hard navigation (host 301 loops).
   */
  async function softSearch(updates) {
    const grid = findResultsGrid();
    if (!grid) return false;
    const prev = readSearchParams();
    const params = mergeParams(updates);
    const queryChanged = searchQueryChanged(prev, params);
    // Favorites mode: keep URL in sync and refresh the saved grid — no API.
    if (isFavoritesMode()) {
      replaceSearchUrl(updates);
      refreshFavoritesIfActive();
      syncLoadMoreButton(false);
      if (queryChanged) {
        resetFavoritesScrollY();
        scrollResultsToTop();
      }
      return true;
    }
    replaceSearchUrl(updates);
    ensureLoadMoreHandler();
    ensureInfiniteScroll();
    const myId = ++requestSeq;
    abortController?.abort();
    abortController = new AbortController();
    loadMoreInFlight = false;
    softState = {
      page: 1,
      hasMore: false,
      params,
      requestId: myId,
    };
    try {
      const { items, hasMore, isSkills } = await fetchList(
        params,
        1,
        abortController.signal,
      );
      if (myId !== requestSeq) return true;
      // Favorites mode may have been entered while the request was in flight.
      if (isFavoritesMode()) {
        refreshFavoritesIfActive();
        syncLoadMoreButton(false);
        return true;
      }
      if (items.length === 0) {
        showEmpty(grid, params.q);
        if (queryChanged) scrollResultsToTop();
        return true;
      }
      grid.innerHTML = items.map((item) => renderCard(item, isSkills)).join("");
      softState.hasMore = hasMore;
      softState.page = 1;
      syncLoadMoreButton(hasMore);
      if (queryChanged) scrollResultsToTop();
      return true;
    } catch (e) {
      if (e?.name === "AbortError") return true;
      if (isFavoritesMode()) {
        refreshFavoritesIfActive();
        syncLoadMoreButton(false);
        return true;
      }
      if (e instanceof SoftSearchHalt) {
        if (myId === requestSeq) {
          showEmpty(grid, params.q);
          if (queryChanged) scrollResultsToTop();
        }
        return true;
      }
      console.error("[mcpmarket-better] soft search failed", e);
      if (myId === requestSeq) {
        showEmpty(grid, params.q);
        if (queryChanged) scrollResultsToTop();
      }
      return true;
    }
  }
  /**
   * Prefer soft in-place update. Hard-navigate only when there is no results
   * grid (browse landing). Soft path already handles empty/redirect safely.
   */
  function softSearchOrNavigate(updates) {
    void softSearch(updates).then((ok) => {
      if (!ok) navigateSearch(updates);
    });
  }
  /** Watch near the bottom of results and auto-fetch the next page. */
  function ensureInfiniteScroll() {
    ensureLoadMoreHandler();
    if (!infiniteObserver) {
      infiniteObserver = new IntersectionObserver(
        (entries) => {
          sentinelVisible = entries.some((e) => e.isIntersecting);
          if (sentinelVisible) void maybeLoadMore();
        },
        {
          root: null,
          // Prefetch while the last cards are still a screenful away.
          rootMargin: "800px 0px",
          threshold: 0,
        },
      );
    }
    if (!infiniteScrollStarted) {
      infiniteScrollStarted = true;
      const boot = () => {
        if (!location.pathname.includes("/search")) return;
        ensureSoftStateFromPage();
        syncLoadMoreButton(!!softState?.hasMore);
      };
      boot();
      window.setTimeout(boot, 250);
      window.setTimeout(boot, 1000);
      // Host remounts can drop our sentinel or re-show Load More — tidy only.
      const mo = new MutationObserver(() => {
        if (!location.pathname.includes("/search")) return;
        const btn = findLoadMoreButton();
        if (btn) {
          btn.setAttribute("data-mmb-load-more", "1");
          btn.classList.add("mmb-load-more");
          btn.hidden = true;
          btn.style.display = "none";
          btn.disabled = true;
        }
        if (!softState) ensureSoftStateFromPage();
        ensureInfiniteSentinel();
        syncInfiniteSentinel(!!softState?.hasMore && !isFavoritesMode());
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
    ensureSoftStateFromPage();
    syncLoadMoreButton(!!softState?.hasMore);
  } // ./src/favorites-ui.ts

  const favorites_ui_CARD_SEL = 'a[id^="tool-card-"]';
  const favorites_ui_HEART_SEL = ".mmb-fav-heart";
  let favorites_ui_listenersBound = false;
  let cardObserver = null;
  let resultsSnapshot = null;
  let savedSearchScrollY = 0;
  function syncSearchInputFromUrl() {
    const input = document.querySelector(
      'header.sticky.top-14 input[name="search"]',
    );
    if (!input) return;
    const q = new URLSearchParams(location.search).get("q") || "";
    if (input.value === q) return;
    const proto = Object.getPrototypeOf(input);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc?.set) {
      desc.set.call(input, q);
    } else {
      input.value = q;
    }
  }
  function scrollToY(y) {
    window.scrollTo(0, y);
    // Second frame: layout may still be settling after grid HTML swap.
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  }
  function parseStars(text) {
    const t = text.trim().toLowerCase();
    if (!t) return undefined;
    if (t.endsWith("k")) {
      const n = parseFloat(t.slice(0, -1));
      return Number.isFinite(n) ? Math.round(n * 1000) : undefined;
    }
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  function favoriteFromCard(card) {
    const slug = card.id.replace(/^tool-card-/, "");
    if (!slug) return null;
    const href = card.getAttribute("href") || "";
    const type =
      href.includes("/skill/") || href.includes("/skills/")
        ? "skills"
        : "server";
    const name =
      card.querySelector("h3")?.textContent?.trim() ||
      card.querySelector("h2")?.textContent?.trim() ||
      slug;
    const description =
      card.querySelector("p")?.textContent?.trim() || undefined;
    const category =
      [...card.querySelectorAll("div")]
        .find((el) => (el.className || "").includes("tracking-wider"))
        ?.textContent?.trim() || undefined;
    const avatar = card.querySelector("img")?.getAttribute("src") || undefined;
    const starsEl = [...card.querySelectorAll("div")].find((el) => {
      const cls = el.className || "";
      return cls.includes("font-geist-mono") && cls.includes("text-xs");
    });
    const starsText = starsEl?.textContent?.replace(/[^\dk.]/gi, "") || "";
    const github_stars = parseStars(starsText);
    return {
      id: favoriteId(type, slug),
      slug,
      name,
      type,
      href,
      description,
      category,
      owner_avatar: avatar,
      github_stars,
      savedAt: Date.now(),
    };
  }
  /** Place heart in the title row, immediately before the open/external icon. */
  function placeHeartInHeader(card, heart) {
    if (heart.closest(".mmb-card-actions")) return true;
    const title = card.querySelector("h3");
    const row = title?.closest("div.flex");
    if (!row) return false;
    let actions = row.querySelector(":scope > .mmb-card-actions");
    if (!actions) {
      const openIcon =
        row.querySelector(":scope > svg") ||
        [...row.children]
          .reverse()
          .find(
            (el) =>
              el instanceof HTMLElement &&
              el !== heart &&
              !!el.querySelector?.("svg") &&
              !el.contains(title),
          ) ||
        null;
      actions = document.createElement("div");
      actions.className = "mmb-card-actions";
      if (openIcon) {
        openIcon.replaceWith(actions);
        actions.appendChild(openIcon);
      } else {
        row.appendChild(actions);
      }
    }
    const openIcon =
      actions.querySelector(":scope > svg") ||
      actions.querySelector(":scope > :not(.mmb-fav-heart)");
    if (openIcon) {
      openIcon.before(heart);
    } else {
      actions.appendChild(heart);
    }
    return true;
  }
  async function enhanceCard(card) {
    const existing = card.querySelector(favorites_ui_HEART_SEL);
    if (existing) {
      const id = existing.getAttribute("data-mmb-fav-id");
      if (id) setHeartActive(existing, isFavoriteSync(id));
      placeHeartInHeader(card, existing);
      return;
    }
    const fav = favoriteFromCard(card);
    if (!fav) return;
    await loadFavorites();
    const btn = createHeartButton(fav.id, isFavoriteSync(fav.id));
    if (!placeHeartInHeader(card, btn)) {
      const fallback =
        card.querySelector(".relative") || card.querySelector("div") || card;
      fallback.appendChild(btn);
    }
  }
  async function enhanceCardHearts(root = document) {
    await loadFavorites();
    const cards = root.querySelectorAll(favorites_ui_CARD_SEL);
    for (const card of cards) {
      await enhanceCard(card);
    }
  }
  function syncAllHeartButtons() {
    document.querySelectorAll(favorites_ui_HEART_SEL).forEach((btn) => {
      const id = btn.getAttribute("data-mmb-fav-id");
      if (id) setHeartActive(btn, isFavoriteSync(id));
    });
  }
  function syncFavModeButton() {
    const btn = document.querySelector(".mmb-fav-mode-btn");
    if (!btn) return;
    const on = isFavoritesMode();
    btn.classList.toggle("mmb-fav-mode-btn--active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function renderFavoritesEmpty() {
    return `<div class="mmb-empty-results" data-mmb-empty="1" style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center;">
    <p class="font-geist-mono text-base font-semibold text-foreground" style="margin: 0 0 0.5rem;">No favorites yet</p>
    <p class="text-sm text-muted-foreground" style="margin: 0;">Tap the heart on any result card to save it here.</p>
  </div>`;
  }
  function filterFavorites(list) {
    const params = readSearchParams();
    const type = params.type === "skills" ? "skills" : "server";
    let items = list.filter((f) => f.type === type);
    const q = params.q?.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.description || "").toLowerCase().includes(q),
      );
    }
    return items;
  }
  function favoriteToCardHtml(fav) {
    const isSkills = fav.type === "skills";
    return renderResultCard(
      {
        name: fav.name,
        slug: fav.slug,
        description: fav.description || "",
        github_stars: fav.github_stars ?? null,
        owner_avatar: fav.owner_avatar ?? null,
        category_name: fav.category ?? null,
        type: fav.type,
      },
      isSkills,
    );
  }
  async function renderFavoritesGrid() {
    if (!isFavoritesMode()) return;
    const grid = getResultsGrid();
    if (!grid) return;
    const list = await loadFavorites();
    const items = filterFavorites(list);
    if (items.length === 0) {
      grid.innerHTML = renderFavoritesEmpty();
    } else {
      grid.innerHTML = items.map(favoriteToCardHtml).join("");
    }
    syncLoadMoreVisibility(false);
    await enhanceCardHearts(grid);
  }
  async function enterFavoritesMode() {
    // Remember search place before we swap to favorites.
    savedSearchScrollY = window.scrollY;
    resultsSnapshot = captureResultsView();
    setFavoritesMode(true);
    syncFavModeButton();
    await renderFavoritesGrid();
    // Restore prior favorites scroll (0 on first visit / after filter change).
    scrollToY(getFavoritesScrollY());
  }
  async function exitFavoritesMode() {
    // Remember favorites place for the next visit.
    setFavoritesScrollY(window.scrollY);
    setFavoritesMode(false);
    syncFavModeButton();
    const snap = resultsSnapshot;
    const y = savedSearchScrollY;
    resultsSnapshot = null;
    if (snap && restoreResultsView(snap)) {
      syncSearchInputFromUrl();
      await enhanceCardHearts();
      scrollToY(y);
      return;
    }
    softSearchOrNavigate({});
  }
  async function toggleFavoritesMode() {
    if (isFavoritesMode()) {
      await exitFavoritesMode();
    } else {
      await enterFavoritesMode();
    }
  }
  function ensureFavoritesModeButton(row) {
    if (row.querySelector(".mmb-fav-mode-btn")) {
      syncFavModeButton();
      return;
    }
    const filter = row.querySelector(".mmb-filter");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mmb-fav-mode-btn";
    btn.setAttribute("title", "Favorites");
    btn.setAttribute("aria-label", "Favorites");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      void toggleFavoritesMode();
    });
    if (filter) {
      filter.before(btn);
    } else {
      row.appendChild(btn);
    }
    syncFavModeButton();
  }
  function syncHeartsById(id, active) {
    document.querySelectorAll(favorites_ui_HEART_SEL).forEach((el) => {
      if (el.getAttribute("data-mmb-fav-id") === id) {
        setHeartActive(el, active);
      }
    });
  }
  async function onHeartClick(btn) {
    const id = btn.getAttribute("data-mmb-fav-id");
    const card = btn.closest(favorites_ui_CARD_SEL);
    if (!card || !id) return;
    const fav = favoriteFromCard(card);
    if (!fav) return;
    // Button id is canonical (soft-rendered markup + injected hearts).
    const [type, ...slugParts] = id.split(":");
    if (type === "server" || type === "skills") {
      fav.id = id;
      fav.type = type;
      fav.slug = slugParts.join(":") || fav.slug;
    }
    // Optimistic paint — do not wait on GM.setValue (can hang in some hosts).
    const nextActive = !isFavoriteSync(id);
    syncHeartsById(id, nextActive);
    try {
      const { added } = await toggleFavorite(fav);
      syncHeartsById(id, added);
      syncAllHeartButtons();
      if (isFavoritesMode()) {
        await renderFavoritesGrid();
      }
    } catch (e) {
      console.error("[mcpmarket-better] toggle favorite failed", e);
      syncHeartsById(id, isFavoriteSync(id));
    }
  }
  function bindDocumentListeners() {
    if (favorites_ui_listenersBound) return;
    favorites_ui_listenersBound = true;
    // Toggle on pointerdown so we don't depend on click (preventDefault on
    // mousedown inside an <a> can suppress the click event in Chromium).
    const onHeartPointerDown = (e) => {
      if (e instanceof PointerEvent && e.button !== 0) return;
      const target = e.target;
      const btn = target?.closest?.(favorites_ui_HEART_SEL);
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      void onHeartClick(btn);
    };
    const suppressNav = (e) => {
      const target = e.target;
      if (!target?.closest?.(favorites_ui_HEART_SEL)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    document.addEventListener("pointerdown", onHeartPointerDown, true);
    document.addEventListener("mousedown", suppressNav, true);
    document.addEventListener("click", suppressNav, true);
  }
  function observeCards() {
    if (cardObserver) return;
    cardObserver = new MutationObserver((mutations) => {
      let needsEnhance = false;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (
            node.matches?.(favorites_ui_CARD_SEL) ||
            node.querySelector?.(favorites_ui_CARD_SEL)
          ) {
            needsEnhance = true;
            break;
          }
        }
        if (needsEnhance) break;
      }
      if (needsEnhance) void enhanceCardHearts();
    });
    cardObserver.observe(document.body, { childList: true, subtree: true });
  }
  function startFavorites() {
    registerFavoritesGridRefresh(() => {
      void renderFavoritesGrid();
    });
    bindDocumentListeners();
    observeCards();
    void loadFavorites().then(() => {
      void enhanceCardHearts();
    });
    window.setTimeout(() => {
      void enhanceCardHearts();
    }, 250);
    window.setTimeout(() => {
      void enhanceCardHearts();
    }, 1000);
  } // ./src/search-navigation.ts

  const HEADER_SEL = "header.sticky.top-14";
  const DEBOUNCE_MS = 300;
  const boundInputs = new WeakSet();
  let documentListenersBound = false;
  let debounceTimer = null;
  let lastSyncedHref = "";
  function search_navigation_isSearchPage() {
    return location.pathname.includes("/search");
  }
  function getSearchInput() {
    return document.querySelector(`${HEADER_SEL} input[name="search"]`);
  }
  /** Set React-controlled input value via native setter. */
  function setNativeInputValue(input, value) {
    const proto = Object.getPrototypeOf(input);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc?.set) {
      desc.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function onSearchSubmit(e) {
    if (!search_navigation_isSearchPage()) return;
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    const input = form.querySelector('input[name="search"]');
    if (!input) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    softSearchOrNavigate({ q: input.value.trim() || null });
  }
  function onSearchInput(e) {
    if (!search_navigation_isSearchPage()) return;
    const input = e.target;
    if (!(input instanceof HTMLInputElement) || input.name !== "search") return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      const next = input.value.trim() || null;
      const current = readSearchParams().q;
      if (next === current) return;
      // Soft update only — do not fall back to location.assign on empty /
      // redirect; that can 301-loop on some category+q combinations.
      void softSearch({ q: next });
    }, DEBOUNCE_MS);
  }
  /** Keep Radix tab visuals in sync when we intercept navigation. */
  function syncTypeTabs(type) {
    const tabs = document.querySelectorAll(
      `${HEADER_SEL} [role="tablist"] [role="tab"]`,
    );
    for (const tab of tabs) {
      const label = tab.textContent?.trim() || "";
      const shouldActive =
        (type === "skills" && label === "Agent Skills") ||
        (type !== "skills" && label === "MCP Servers");
      tab.setAttribute("data-state", shouldActive ? "active" : "inactive");
      tab.setAttribute("aria-selected", shouldActive ? "true" : "false");
      tab.tabIndex = shouldActive ? 0 : -1;
      if (!shouldActive && document.activeElement === tab) {
        tab.blur();
      }
    }
    // Placeholder flips with type; keep category hint from Filter / URL slug.
    const input = getSearchInput();
    if (input) {
      const filterLabel = document
        .querySelector(".mmb-filter-label")
        ?.textContent?.trim();
      const catHint =
        filterLabel && filterLabel !== "Filter"
          ? filterLabel
          : (new URLSearchParams(location.search).get("category_slug") || "")
              .split("-")
              .filter(Boolean)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
      const base =
        type === "skills"
          ? "Search for Agent Skills..."
          : "Search for MCP servers...";
      input.placeholder = catHint ? `${base} ${catHint}` : base;
    }
  }
  /**
   * Host Radix tabs navigate on mousedown (not click). Intercept early in
   * capture so q / category_slug are not wiped by the host handler.
   */
  function onTypeTabActivate(e) {
    if (!search_navigation_isSearchPage()) return;
    // Ignore non-primary mouse buttons on mouse/pointer events.
    if ("button" in e && e.button !== 0) return;
    const target = e.target;
    const tab = target?.closest?.(
      `${HEADER_SEL} [role="tablist"] [role="tab"]`,
    );
    if (!tab) return;
    const selected =
      tab.getAttribute("aria-selected") === "true" ||
      tab.getAttribute("data-state") === "active";
    if (selected) return;
    const label = tab.textContent?.trim() || "";
    if (label !== "Agent Skills" && label !== "MCP Servers") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const nextType = label === "Agent Skills" ? "skills" : null;
    syncTypeTabs(nextType);
    softSearchOrNavigate({ type: nextType });
  }
  function bindSearchInput(input) {
    if (boundInputs.has(input)) return;
    boundInputs.add(input);
    input.addEventListener("input", onSearchInput);
  }
  function ensureSearchInputBound() {
    if (!search_navigation_isSearchPage()) return;
    const input = getSearchInput();
    if (input) bindSearchInput(input);
  }
  /** Sync search input value from URL `q` (back/forward / external nav). */
  function search_navigation_syncSearchInputFromUrl() {
    if (!search_navigation_isSearchPage()) return;
    if (location.href === lastSyncedHref) return;
    lastSyncedHref = location.href;
    syncTypeTabs(readSearchParams().type);
    const input = getSearchInput();
    if (!input) return;
    const q = readSearchParams().q || "";
    if (input.value === q) return;
    // Don't fight the user while they're typing.
    if (document.activeElement === input) return;
    setNativeInputValue(input, q);
  }
  function startSearchNavigation() {
    if (!documentListenersBound) {
      documentListenersBound = true;
      document.addEventListener("submit", onSearchSubmit, true);
      // Radix tabs fire navigation on mousedown; also catch click/keydown.
      document.addEventListener("mousedown", onTypeTabActivate, true);
      document.addEventListener("click", onTypeTabActivate, true);
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          onTypeTabActivate(e);
        },
        true,
      );
      window.addEventListener("popstate", () => {
        lastSyncedHref = "";
        search_navigation_syncSearchInputFromUrl();
      });
      setInterval(() => {
        ensureSearchInputBound();
        search_navigation_syncSearchInputFromUrl();
      }, 500);
    }
    ensureSearchInputBound();
    search_navigation_syncSearchInputFromUrl();
  } // ./src/search-chrome.ts

  const search_chrome_HEADER_SEL = "header.sticky.top-14";
  let categoriesCache = null;
  let enhanceScheduled = false;
  let search_chrome_documentListenersBound = false;
  let observer = null;
  function search_chrome_isSearchPage() {
    return location.pathname.includes("/search");
  }
  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  function getHeader() {
    return document.querySelector(search_chrome_HEADER_SEL);
  }
  function getStack(header) {
    return header.querySelector("section.py-4 .flex.flex-col");
  }
  function getSelectedCategory(header) {
    // URL is source of truth — host chip/placeholder lag after soft clears.
    const slug = new URLSearchParams(location.search).get("category_slug");
    if (!slug) return null;
    if (categoriesCache) {
      const match = categoriesCache.find((c) => c.slug === slug);
      if (match) return match.name;
    }
    const primary = header.querySelector(
      "section.border-t .scrollbar-hide > button[class*='bg-primary']",
    );
    const chipName = primary?.querySelector("span")?.textContent?.trim();
    if (chipName) return chipName;
    const placeholder =
      header.querySelector('input[name="search"]')?.placeholder || "";
    const fromPlaceholder = placeholder.match(/\.\.\.\s*(.+)$/);
    if (fromPlaceholder) return fromPlaceholder[1].trim();
    // Last resort: title-case the slug
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  /** Host-style placeholder: "Search for MCP servers... {Category}". */
  function syncSearchPlaceholder(header) {
    const input = header.querySelector('input[name="search"]');
    if (!input) return;
    const type = new URLSearchParams(location.search).get("type");
    const category = getSelectedCategory(header);
    const base =
      type === "skills"
        ? "Search for Agent Skills..."
        : "Search for MCP servers...";
    const next = category ? `${base} ${category}` : base;
    if (input.placeholder !== next) {
      input.placeholder = next;
    }
  }
  function navigateCategory(slug) {
    softSearchOrNavigate({ category_slug: slug });
    // Soft nav uses replaceState; sync Filter label + placeholder from URL.
    const header = getHeader();
    if (!header) return;
    syncFilterControl(header);
  }
  async function loadCategories(header) {
    if (categoriesCache) return categoriesCache;
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
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
    const scraped = [];
    const seen = new Set();
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
  function closeFilterPanel(root) {
    const panel = root.querySelector(".mmb-filter-panel");
    const btn = root.querySelector(".mmb-filter-btn");
    if (panel) panel.hidden = true;
    btn?.setAttribute("aria-expanded", "false");
  }
  function updateFilterButtonLabel(btn, selected) {
    const label = btn.querySelector(".mmb-filter-label");
    if (!label) return;
    const next = selected || "Filter";
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
  function renderFilterPanel(panel, categories, selected) {
    panel.replaceChildren();
    const list = document.createElement("div");
    list.className = "mmb-filter-list";
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className =
      "mmb-filter-item" + (!selected ? " mmb-filter-item--active" : "");
    allBtn.innerHTML = `<span class="mmb-filter-item-name">All categories</span>`;
    allBtn.addEventListener("click", () => {
      closeFilterPanel(panel.closest(".mmb-filter") || panel);
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
      item.querySelector(".mmb-filter-item-name").textContent = cat.name;
      item.querySelector(".mmb-filter-item-count").textContent = String(
        cat.count,
      );
      item.addEventListener("click", () => {
        closeFilterPanel(panel.closest(".mmb-filter") || panel);
        if (isActive) {
          navigateCategory(null);
        } else {
          navigateCategory(cat.slug);
        }
      });
      list.appendChild(item);
    }
    panel.appendChild(list);
  }
  function syncFilterControl(header) {
    const btn = header.querySelector(".mmb-filter-btn");
    if (btn) {
      updateFilterButtonLabel(btn, getSelectedCategory(header));
    }
    syncSearchPlaceholder(header);
  }
  /**
   * Wrap search + Filter in a flex row (full grid width) so the input
   * fills up to the Filter with only a small gap — no empty column.
   */
  function ensureFilterControl(stack, header) {
    const existingRow = stack.querySelector(":scope > .mmb-search-row");
    if (existingRow) {
      ensureFavoritesModeButton(existingRow);
      syncFilterControl(header);
      return;
    }
    const searchWrap = stack.querySelector(
      ':scope > .flex-1:has(input[name="search"])',
    );
    if (!searchWrap) return;
    const row = document.createElement("div");
    row.className = "mmb-search-row";
    row.setAttribute("data-mmb", "search-row");
    searchWrap.before(row);
    row.appendChild(searchWrap);
    const filterRoot = document.createElement("div");
    filterRoot.className = "mmb-filter";
    filterRoot.setAttribute("data-mmb", "filter");
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
        closeFilterPanel(filterRoot);
      }
    });
    filterRoot.appendChild(btn);
    filterRoot.appendChild(panel);
    ensureFavoritesModeButton(row);
    row.appendChild(filterRoot);
    const selected = getSelectedCategory(header);
    updateFilterButtonLabel(btn, selected);
    void loadCategories(header).then((cats) => {
      renderFilterPanel(panel, cats, selected);
    });
  }
  function headerNeedsFilter(header) {
    const stack = getStack(header);
    if (!stack) return false;
    const hasSearch = !!stack.querySelector('input[name="search"]');
    const hasRow = !!stack.querySelector(":scope > .mmb-search-row");
    return hasSearch && !hasRow;
  }
  /** Icon-only tabs: expose label via native tooltip + aria-label. */
  function ensureTypeTabTooltips(header) {
    const tabs = header.querySelectorAll('[role="tablist"] [role="tab"]');
    for (const tab of tabs) {
      const label =
        tab.querySelector("span")?.textContent?.trim() ||
        tab.textContent?.trim() ||
        "";
      if (!label) continue;
      if (tab.getAttribute("title") !== label) tab.setAttribute("title", label);
      if (tab.getAttribute("aria-label") !== label) {
        tab.setAttribute("aria-label", label);
      }
    }
  }
  function enhanceSearchChrome() {
    if (!search_chrome_isSearchPage()) return;
    const header = getHeader();
    if (!header) return;
    const stack = getStack(header);
    if (!stack) return;
    // Layout/hide is pure CSS — only inject the Filter control.
    ensureFilterControl(stack, header);
    ensureTypeTabTooltips(header);
    syncSearchPlaceholder(header);
    ensureSearchInputBound();
  }
  function scheduleEnhance() {
    if (enhanceScheduled) return;
    enhanceScheduled = true;
    requestAnimationFrame(() => {
      enhanceScheduled = false;
      try {
        observer?.disconnect();
        enhanceSearchChrome();
      } catch (e) {
        console.error("[mcpmarket-better] enhance failed", e);
      } finally {
        observeHeader();
      }
    });
  }
  function observeHeader() {
    if (!observer) return;
    const header = getHeader();
    observer.observe(header ?? document.body, {
      childList: true,
      subtree: true,
    });
  }
  function startSearchChromeObserver() {
    if (!search_chrome_documentListenersBound) {
      search_chrome_documentListenersBound = true;
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target?.closest?.(".mmb-filter")) {
          document.querySelectorAll(".mmb-filter").forEach((root) => {
            closeFilterPanel(root);
          });
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          document.querySelectorAll(".mmb-filter").forEach((root) => {
            closeFilterPanel(root);
          });
        }
      });
      let lastHref = location.href;
      const syncFromUrl = () => {
        if (location.href === lastHref) return;
        lastHref = location.href;
        const header = getHeader();
        if (!header) return;
        if (headerNeedsFilter(header)) {
          scheduleEnhance();
        } else {
          syncFilterControl(header);
        }
      };
      window.addEventListener("popstate", syncFromUrl);
      setInterval(syncFromUrl, 500);
    }
    if (!observer) {
      observer = new MutationObserver((mutations) => {
        const header = getHeader();
        if (!header) {
          scheduleEnhance();
          return;
        }
        const onlyOurs = mutations.every((m) => {
          const el =
            m.target instanceof Element ? m.target : m.target.parentElement;
          return !!el?.closest?.(".mmb-filter, .mmb-search-row");
        });
        if (onlyOurs) return;
        if (headerNeedsFilter(header)) {
          scheduleEnhance();
        }
      });
    }
    // Run after hydration so we don't move nodes React still owns.
    scheduleEnhance();
    window.setTimeout(() => scheduleEnhance(), 0);
    window.setTimeout(() => scheduleEnhance(), 250);
    window.setTimeout(() => scheduleEnhance(), 1000);
  } // ./src/index.ts

  async function src_main() {
    console.log("[mcpmarket-better] loaded on", location.href);
    startSearchChromeObserver();
    startSearchNavigation();
    startFavorites();
    startCardNavigation();
    ensureInfiniteScroll();
  }
  src_main().catch((e) => {
    console.error("[mcpmarket-better]", e);
  });

  /******/
})();
