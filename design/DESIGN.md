# DESIGN — ascii conversor

## Brief

- **Subject:** ascii conversor — a web tool that converts any image into color ASCII art
  that keeps the original's shades, colors and structure. Runs fully in the browser;
  the image never leaves the device.
- **Audience:** developers, designers, terminal people. Desktop-led, fully usable on phone.
- **Job:** operate. The one action: **drop an image and convert it.**
- **User's taste:** the owner built the taste skill itself; wants a grab-attention UI with
  launch/SaaS ambitions. No stated light/dark preference → dealt palette leads (light rose grey).

## Inventory (what belongs to this subject and no competitor)

1. The character cell grid — the anatomy of every ASCII render
2. The luminance ramp ` .:-=+*#%@` — light glyph to heavy glyph
3. The `@` — heaviest glyph of the classic ramp
4. Terminal phosphor green — the accent's ancestry
5. Monospace type — the only typeface the medium allows
6. The moment a photo dissolves into text and stays recognizable
7. Dithering — Floyd–Steinberg, Bayer matrices
8. ANSI / teletype heritage, dot-matrix printouts
9. Half-blocks `▀▄`, Braille `⣿` — sub-cell resolution
10. The pipeline: image → cells → characters → colored characters

## Idea sentence

> On this page, **the character grid — the anatomy of ASCII art itself** becomes **the layout.**

Competitor test: put remove.bg or chafa in the sentence — a grid of character cells belongs
to ASCII conversion, not to image tools in general. Passes.

**The one live thing:** the converter itself — drop an image, watch it become ASCII in real
time while you drag the resolution slider. It IS the page's showcase section.

## Direction

**The well-kept board** (dense-tiles, seed 210652694, dealt by tasteskill v2).
12-column board, 8px gaps, flat filled tiles, one radius (8px), no shadows, no outlines.
Every tile holds one real thing: a sample conversion, the original photo, a number, a clause.

- Hero: full-viewport sheet of staggered frames (originals + their ASCII renders) with one
  text cell: wordmark, one sentence, one green action, three links.
- how-it-works: four flat fields, one image shown at the four real pipeline stages.
- showcase: the working converter, split 62/38 — live render left, controls right.
- cta: one green action tile row.
- footer: the wordmark built from blocks.

## Token plan

**Grounds (2, tone step ~4 RGB steps):** page `#ebe5e3`, tile `#e1dad7`; dark inverse
`#2b2622` for the converter render area (ASCII art reads best on dark — subject decision).
**Inks (staircase):** `#2b2622` (13.9:1 on bg) body/headings · `#6a615d` (5.0:1) secondary ·
`#ebe5e3` on `#2b2622` (13.9:1) inverse.
**Accent (one):** terminal green `#0f7d45` — the action tile, the primary button, nothing else.
**Type:** Schibsted Grotesk only. 800 / −0.05em / 0.88 display; 400 text, 600 functional;
steps small 13–14px, body 17–19px, lead 20–26px, head 32–64px. Monospace appears ONLY as
rendered ASCII art (the medium's own content) and figure captions of conversions.
**Spacing:** 4px base — 8 gap inside board, 20–24 tile padding, 120–160 section gaps.
**Radii:** 8px everywhere, nested concentrically.
**Boldness spent on:** the hero sheet of live ASCII renders. Everything else quiet.

**Cost lines:**
- Hero ASCII renders: canvas, paint-only, one-time per sample (no per-frame JS). Cheap.
- Converter: worker compute + canvas paint, debounced slider. No layout thrash.
- Section entrances: transform/opacity only, staggered 60–90ms, reduced-motion fallback.
- Shutter move (signature): clip-path + scale settle, once, on first hero frame.

## Argument (claims → sections)

1. This turns images into ASCII that still looks like the image → hero sheet shows it, no claim needed
2. It's real conversion, not a filter → how-it-works shows the four pipeline stages
3. You control it → showcase: the live converter with controls
4. Do it now → cta tile

## Copy deck

- Wordmark: ascii conversor
- Sentence: Any image, rebuilt as text — same shades, same colors, same you.
- Action: Convert an image
- Links: How it works · Try it · GitHub
- how-it-works heading: How it works
  - First, the image arrives. / Then it becomes a grid of cells. /
    Then each cell finds its character. / Finally, every character takes its color.
- showcase heading: Try it on yours — sentence: Drop an image. It never leaves your browser.
- cta heading: Give it a picture. — lines: JPEG, PNG, WebP, GIF frames. Text out as PNG, SVG or plain .txt.
- footer: block wordmark, link columns, photo credits.

## Sample content to confirm

- Sample photos: picsum #508 (Jeff Sheldon), #620 (Matthew Wiebe), #1081 (Julien Moreau)
  — Unsplash license, credited in footer. Replace with the owner's own images later.
