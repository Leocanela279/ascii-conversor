# ascii conversor — Plan

## Goal

Website: drop an image → get ASCII art that preserves the original's look
(shades, colors, structure) as closely as possible while still reading as ASCII.

## Key architecture decisions

### 1. Everything client-side. No backend (v1).

- Image never leaves the user's device → privacy is a feature, zero server cost.
- No upload latency; conversion is local compute, which browsers are great at.
- Backend deferred until we need: sharing links, image-from-URL (CORS proxy),
  accounts. Art_to_ascii and ASCII O Matic both prove this model works.

### 2. Two conversion engines, one glyph atlas

| Mode | Engine | Why |
|------|--------|-----|
| **Live preview** (sliders, real-time feedback) | WebGL2 fragment shader + glyph atlas texture | Per-cell work is independent → embarrassingly parallel; 60 fps while dragging sliders |
| **Quality / final render** (and export) | Web Worker + OffscreenCanvas, CPU, typed arrays | Full shape-matching (patch vs every glyph bitmap) is easier and more accurate on CPU; worker keeps UI at 60 fps |

Both engines consume the same **glyph atlas**: at startup we rasterize every
candidate glyph from the bundled font onto a canvas, keep (a) the texture for
WebGL and (b) per-glyph luminance bitmaps for CPU matching.

### 3. Bundle the font. Non-negotiable for accuracy.

Glyph bitmaps must match the rendered output exactly. System fonts differ per
machine → different glyphs, wrong matching. Bundle one monospace font
(candidate: JetBrains Mono — clean, open license), load via FontFace API,
rasterize the atlas from it, render output with it. (chafa does the same via
FreeType glyph loading.)

### 4. Render output to Canvas, never DOM text

Thousands of colored `<span>`s = layout thrash. Canvas (or WebGL) draws tinted
glyph sprites; export via `canvas.toBlob()`.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Build | **Vite** | Fastest dev loop; static SPA output, deploy anywhere (Vercel/Netlify/GH Pages) |
| UI | **React + TypeScript** | Component model for the control panel; TS for engine correctness |
| Styling | **Tailwind CSS** | Fast path to a genuinely good-looking tool UI |
| Compute | Web Worker + OffscreenCanvas (quality), WebGL2 shader (preview), Canvas2D fallback | Covers every browser, keeps main thread free |
| Export | PNG (canvas.toBlob), SVG (colored glyphs), .txt, ANSI truecolor | Covers web, print, terminal use |
| Backend | none (v1) | see decision 1 |

No WebAssembly for v1: typed-array JS in a worker is fast enough for still
images (95 glyphs × ~60k cells ≈ millions of ops, sub-second). Revisit
WASM/Rust only if profiling says so — don't pay complexity before data demands it.

## Algorithm roadmap (per RESEARCH.md fidelity ladder)

1. **MVP**: luminance ramp + truecolor per cell (proves pipeline end-to-end)
2. **Shape matching**: per-cell patch vs glyph-bitmap distance (the big fidelity jump)
3. **Charset modes**: pure ASCII (95 printable) / blocks+half-blocks / Braille
4. **Preprocessing**: gamma, contrast, optional histogram equalization
5. **Dithering**: ordered Bayer first, Floyd–Steinberg for gradients
6. **Metric**: SSIM(original, rendered-output) shown in dev panel → objective tuning

## Phases

- **P1 — Scaffold**: Vite+React+TS+Tailwind, drop/paste/file image input, canvas preview
- **P2 — Engine v1**: worker pipeline, ramp + truecolor, PNG export
- **P3 — Engine v2**: glyph atlas + shape matching, charset modes
- **P4 — Real-time**: WebGL preview shader, sliders (resolution, contrast, charset, dither)
- **P5 — Exports & polish**: SVG/txt/ANSI export, UI polish, before/after compare view

## Open questions (decide in P1–P2)

- Output character aspect ratio compensation (font cells are ~1:2) — target
  font-ratio setting like chafa's `--font-ratio`.
- Max output grid size vs performance (start: configurable up to ~300 cols).
- Whether "pure 7-bit ASCII only" is a mode or the default identity of the site.
