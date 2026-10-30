# ascii conversor — Research Notes

## Core insight: decouple shape from color

Classic ASCII art maps brightness → one char from a ramp (`@%#*+=-:. `) and loses
everything else. High-fidelity renderers split the problem:

1. **Shape** — per character cell, compare the image patch against precomputed
   bitmaps of each glyph (rendered in the exact output font); pick nearest match
   via L2/MSE or SSIM. Preserves edges, diagonals, gradients — not just average
   brightness.
2. **Color** — color the chosen glyph with the cell's average color (CSS color in
   HTML, ANSI 24-bit truecolor in terminals). Color fidelity is independent of
   glyph choice, so it can be near-perfect.

## Fidelity ladder

| Level | Technique | What it adds |
|-------|-----------|--------------|
| 1 | Luminance ramp (`@%#*+=-:. `) | Retro grayscale look, low fidelity |
| 2 | Shape-aware glyph matching (patch vs glyph bitmap) | Edges & structure |
| 3 | + truecolor per glyph | Full color reproduction |
| 4 | Sub-cell symbols: half-blocks `▀▄` (2 samples/cell), Braille (2×4 dots), sextants | Higher effective resolution |
| 5 | Dithering (Floyd–Steinberg / Bayer) + preprocessing (AHE, gamma) | Smooth gradients, survives dark/light sources |

## State of the art / benchmarks

- **chafa** (C) — the reference. Symbol-map matching over Unicode blocks+Braille,
  DIN99d perceptual color space, dithering, SIMD+threads, work factor 1–9.
  Glyph bitmaps rasterized from a font file via FreeType. This is the bar.
- **viu / viuer** (Rust) — half-block + truecolor terminal rendering.
- **jp2a, libcaca** — classic baselines (what we're beating).
- **ASCII O Matic** — proof a pure client-side browser tool works: 142 KB JS,
  fully offline, luminance-weighted char selection, GPU-composited rendering.
- **art_to_ascii** — proof of the web architecture: React + WebGL + Web Workers +
  OffscreenCanvas, real-time images/video/webcam, GPU-accelerated export.

## ML caution (arXiv 2503.14375)

Deep CNNs for glyph selection cause "overmatching": per-tile-perfect characters
that break global structure (ResNet SSIM 0.6364 < Random Forest 0.6654).
Simple, deterministic matching with global coherence beats clever per-cell choices.

## Quality metric

Render the ASCII output back to an image (same font, same colors) and compute
**SSIM vs the original**. Objective score for every algorithm tweak; enables
A/B testing of ramps, glyph sets, dithering, preprocessing.
