# Changelog

All notable changes to GUI.js are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
GUI.js adheres to [Semantic Versioning](https://semver.org/).

---

## [1.6.0] — 2026

### Added
- Expanded `_sanitize()` allowlist: `ol`, `code`, `pre`, `small`, `mark`, `h3`-`h6`.
- Hardened `href` sanitization: block `data:` and `vbscript:` schemes.
- `CHANGELOG.md`.

### Changed
- Toast stacking offset unified to 70px (CSS hover + JS `applyStacking()`). Previously mismatched 60px/70px, causing a visible jump on hover.
- `showToasts()` refactored: a single `maxVisible` check replaces the previous duplicate animate-then-robust-check pattern.
- `h()` helper removed: DOM creation standardized to `document.createElement()`.
- All `var` replaced with `const`/`let` throughout.

### Fixed
- `GUI.toast.update()` now injects a progress bar when `duration` changes from `0` to a positive value.
- Duplicate tooltip logic for `copyOnClick` extracted into `_showCopiedTooltip()`.

## [1.5.1] — 2026

### Fixed
- `_sanitize()` returning `undefined`: switched from `DocumentFragment` to a wrapper `div` (`fragment.innerHTML` is not defined).
- Icons rendering as raw SVG text instead of actual SVG elements.
- Toast container losing `position: fixed` layout.
- Enter animation conflicting with `applyStacking()` overrides.
- `GUI.toast.promise` now uses `update()` instead of dismiss + create.
- `README.md` starting with a JS block comment syntax.

## [1.5.0] — 2026

### Added
- Sonner-style toast stacking with collapse/expand on hover.
- Mobile drag-to-dismiss (touch swipe right).
- `GUI.toast.update(id, options)` — reactive toast updates.
- Event delegation on the toast container (replaces per-element listeners).

### Changed
- Layered box-shadow system for depth perception.
- Spring physics easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

## [1.2.1] — 2026

### Fixed
- `GUI.toast.config()` now works as both getter and setter.
- `GUI.init()` not updating the container `className` when position changes.

## [1.2.0] — 2026

### Added
- Built-in HTML sanitizer (`_sanitize`) with an allowlist approach.
- TypeScript definitions (`gui.d.ts`).
- `README.md` with API documentation.

### Changed
- Internal state refactored into a single `state` object.

### Security
- `allowHTML` option (default: `false`) — opt-in HTML rendering.
- Shadow DOM CSS variables scoped to the toast host element.

## [1.1.1] — 2025

### Fixed
- XSS vulnerability in modal title via string concatenation.
- XSS vulnerability in `GUI.modal.prompt()` message via `innerHTML`.
- Modal header now built with DOM API instead of `innerHTML`.

## [1.1.0] — 2026

### Security
- `allowHTML` option added (default: `false`) — XSS safe by default.
- Shadow DOM + CSS custom properties now correctly scoped to host.
- `validateForm()` extended to include `select` elements.

### Fixed
- Bug: container variable referenced before assignment.
- Toast position not updating after `GUI.toast.config({ position })`.

---

[1.6.0]: https://github.com/lazydev-areus/gui.js/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/lazydev-areus/gui.js/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/lazydev-areus/gui.js/compare/v1.2.1...v1.5.0
[1.2.1]: https://github.com/lazydev-areus/gui.js/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/lazydev-areus/gui.js/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/lazydev-areus/gui.js/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/lazydev-areus/gui.js/releases/tag/v1.1.0
