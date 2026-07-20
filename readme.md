# MCP Market Better

Userscript that enhances [mcpmarket.com](https://mcpmarket.com/search) search and browsing.

Built with the [webpack-userscript-template](https://github.com/trim21/webpack-userscript-template) toolchain (TypeScript + webpack + Tampermonkey).

## Dev

1. Allow Tampermonkey access to local file URIs ([faq](https://tampermonkey.net/faq.php?ext=dhdg#Q204)).
2. Install deps: `pnpm install`
3. Start the watcher: `pnpm run dev`

You will see two files in `./dist/`:

- `dist/index.dev.user.js` — **Install this** in Tampermonkey. It loads the debug build via `@require`.
- `dist/index.debug.js` — Development build with source maps. Do not install it directly.

4. Edit [`src/index.ts`](./src/index.ts) (and styles under `src/style/`).
5. Open [https://mcpmarket.com/search](https://mcpmarket.com/search) and confirm `[mcpmarket-better] loaded` in the console.

Livereload is enabled by default; use the [LiveReload Chrome extension](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei) if you want automatic page refresh.

### Notice

After changing userscript metadata in [`config/metadata.cjs`](./config/metadata.cjs), restart webpack and reinstall `dist/index.dev.user.js`.

If the console shows `EvalError` / `unsafe-eval` on mcpmarket.com (common with Tampermonkey Beta + UserScripts API), reinstall after a rebuild so `@inject-into content` is present. Alternatively set Tampermonkey → Settings → **Modify existing content security policy (CSP) headers** to **Remove entirely**.

## Match

The script runs on:

- `*://mcpmarket.com/search*`
- `*://mcpmarket.com/*`

## Build

```bash
pnpm run build
```

Production output: `dist/index.prod.user.js`
