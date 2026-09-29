# Vendored ES modules

Pinned, unmodified builds loaded through the import map in `index.html` (no bundler — see
`docs/architecture.md` A1, A3). Update by copying the new package's ESM files into a new
versioned folder and changing the import map.

| Package | Version | Files | License |
|---|---|---|---|
| preact | 10.29.8 | `preact.module.js`, `hooks.module.js` | MIT (`preact-10.29.8/LICENSE`) |
| htm | 3.1.1 | `htm.module.js`, `htm-preact.module.js` (`htm/preact`) | Apache-2.0 (`htm-3.1.1/LICENSE`) |
| inkjs | 2.4.0 | `ink.mjs` (the runtime only: `Story`, `InkList`; `inkjs`) | MIT (`inkjs-2.4.0/LICENSE.md`) |

The Ink compiler is not vendored: it runs only in `tools/content/ink.mjs`, from the `inkjs` devDependency
(the same version), and the compiled JSON is committed next to each `.ink`.
