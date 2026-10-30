# Design history

## 2026-10-30 — v1 "The well-kept board"

- Direction: dense-tiles (seed 210652694), dealt via tasteskill v2
- Idea: the character grid — the anatomy of ASCII art — becomes the layout.
  The hero is a staggered sheet of real sample conversions; the product's own
  output is the imagery.
- Grounds: rose grey #ebe5e3 / #e1dad7, dark inverse #2b2622 for render areas
- Accent: terminal green #0f7d45 (action only)
- Type: Schibsted Grotesk 800/600/400; monospace only for the ASCII art itself
- Live thing: the converter (drop/paste image, live resolution slider)
- Gate: lint 0 FAIL/0 WARN, inspect 0 FAIL at 1440/768/390.
  Defended WARNs: dealt palette reads warm to the meter; 12 sizes = dealt fluid
  steps + app-control sizes; no stock footage exists for ASCII conversion —
  the live converter is the moving element.
- Engine note: coverage compensation (glyph color ÷ ink density) was the single
  biggest fidelity win — bright areas stay bright on the dark ground.
- User verdict: pending

## 2026-10-30 — v1.1 dark mode

- Full second theme via `[data-theme="dark"]` token overrides; every component
  already referenced role tokens, so the flip required no per-component redesign.
- Ground #141210 (near-black, never pure), panels elevate by lighter steps
  (#211d19, #2e2823), art ground drops to #100d0b.
- Accent lifts to #149b57 with dark text on it (white would fail contrast).
- The footer wordmark inverts: light blocks on the dark field.
- Toggle lives in the hero panel nav; persists to localStorage, defaults to
  system preference, `?theme=` URL override for testing. No FOUC (inline
  class-set before paint).
- Gate: 0 FAIL in BOTH themes at 1440/768/390; same two defended WARNs.
  One real catch: muted-on-panel needed its own token (`--color-on-panel-muted`),
  because "muted text" means a different value on dark grounds vs light grounds.

## 2026-10-30 — v1.2 white default (user override)

- Owner prefers full white over dark: light grounds pushed to pure white
  (#ffffff page, #f5f2f0 surface, #ece7e3 field), keeping the rose family in
  the tone steps. Default theme is now light regardless of system preference;
  dark stays one toggle away. Recorded per the rule: the user's taste outranks
  the dealt palette.
- Gate: 0 FAIL; palette-cream WARN on #f5f2f0 is a near-white false positive.

## 2026-10-30 — v1.3 motion pass (Emil's review-animations standard)

- Audit doc: design/motion-audit.md. Verdict: approve with required fixes.
- Fixes: `--ease-out` strengthened to cubic-bezier(0.23,1,0.32,1); HowItWorks
  hover-lift gated behind (hover:hover) and (pointer:fine) via .lift-hover;
  reduced-motion reworked — keeps color/opacity fades, drops only movement
  (transition-property scoping instead of the 0.01ms blanket).
- Three new moments:
  1. Conversion dissolve — new source re-keys the render wrapper; 260ms
     opacity + blur(2px→0) masks the grid swap. Never fires on slider drags.
  2. Drop feedback — .drop-scale leans the render surface to 1.015 on
     drag-over; interruptible transition, not a keyframe.
  3. Theme settle — temporary .theme-transition class on <html> for 320ms,
     color-only transitions, never on first paint, skipped under
     reduced-motion.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes.

## 2026-10-30 — v1.4 CTA stream (marquee)

- The peek-tiles promised a stream; now it moves. Full-bleed track of mixed
  tiles (source photos + live conversions in varied charsets/modes) drifts
  right-to-left behind the FIXED green card — the CTA never moves.
- Linear 45s infinite translateX(0 → -50%), content duplicated 2x, each tile
  carrying its own trailing margin so the loop lands on identical content.
  Linear is deliberate: any ease stutters at the seam of an infinite loop.
- Edge dissolve via mask-image alpha mask (defended vs gradient lint rule —
  it is an alpha mask, not a visible fill). Hover pauses (hover:hover gated).
  Reduced-motion: drift off, strip becomes a static scrollable row.
- Stream is lg+ only; below that the card stands alone, as before.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes.
  Two new WARNs defended: the meter reads the 2x-duplicated absolute track
  as "edges with nothing between" — the composite shows the fixed card
  centered with the stream passing at both edges.

## 2026-10-30 — v1.5 stream-only CTA (user override)

- Owner call: drop the green static card, keep only the stream. The converter
  already owns the action (drop/paste/browse), so the card was a second
  doorway; the section is now a pure showcase. User taste outranks the dealt
  layout — recorded per the rule.
- With the card gone the stream no longer needs side room: it now runs at
  every width (mobile included), in-flow with h-[220px] md:h-[320px].
- Removing the card also removed the two defended inspector WARNs — the meter
  was confused by the absolute track behind the card; gate back to 0 FAIL +
  the original 3 defended WARNs in both themes.

## 2026-10-30 — v1.6 hero panel joins the board (user ask)

- Owner: the hero panel read as "a random card in the middle". Three tells
  fixed so it speaks the board's grammar:
  1. Square corners — every tile is square; the panel's rounded-lg was a
     card tell. Surfaces are now square; only controls keep rounding.
  2. Caption strip — the panel was the only rectangle without the
     "subject · qualifier" bar. It now carries "ascii conversor · the tool"
     on the accent strip, same component as every tile.
  3. Glyph field — a faint phosphor vaults render (opacity 0.14) fills the
     panel, masked to dissolve toward the nav row: the panel is literally
     made of the same stuff as the ASCII tiles.
- Phone sheet padding adjusted +28px to clear the new caption strip.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes
  (2 WARN light / 3 dark — all previously defended categories).

## 2026-10-30 — v1.7 button system + footer credit

- Audit found the press scale SNAPPED on most buttons: `transition-colors`
  never covered `active:scale-[0.97]` — only Save/Copy had transform in
  their transition. Same class of bug: Back-to-top's `hover:opacity-85`
  snapped (opacity not in transition-colors).
- Fix per the taste skill's own motion recipe (references/motion.md):
  one shared `Button` + `Chip` component (src/components/Button.tsx) —
  transition-[background-color,color,transform] duration-150 ease-out,
  scale(0.97) press, variants accent/onPanel/ghost, sizes sm/md/lg.
  One recipe, no class drift.
- Icons: lucide-react (skill-sanctioned style: outline, functional, small).
  Only where they carry meaning — Download on Save PNG, Copy on Copy text,
  ImagePlus on Browse files, Sun/Moon on the theme toggle. No arrows
  anywhere (skill's copy rule: at most one arrow glyph per page); nav
  links and the hero CTA stay words.
- Footer credit: © year Leandro Canela (linked to GitHub) · ascii conversor.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes.

## 2026-10-30 — v1.8 the mark: scanline A

- Logo, from the owner's CRT reference: the letter A built from horizontal
  phosphor bars — literally what a run of "█" glyphs looks like in the
  product's own output. The mark demonstrates the product.
- Dark tile ground (--color-artbg), bars in bright terminal green
  (--color-accent-strong dark). Display variant carries a restrained
  gaussian glow (the CRT nod); favicon variant is flat with coarse bars
  that survive 16px. Letterform widened 14% for monumentality.
- Generated by design/make-logo.py (reproducible); outputs public/logo.svg
  and public/favicon.svg, the latter wired as the site icon.
- Research notes: 2026 trend reports name mono/tech typography a live
  current; rebrand case studies say keep the color that makes you
  different — terminal green is ours.

## 2026-10-30 — v1.9 the mark takes its place

- The scanline-A logo now sits above the hero headline: 48px on phone,
  56px on desktop, dark tile reading as an inset against the panel.
- Panel grew 410 → 482px (lg) and shifted up 28 → 26svh to hold the mark
  inside the first screen; phone sheet clearance bumped to match.
- Catch from the screenshots: the theme toggle's new icon made the hero
  nav wrap mid-phrase below sm — the toggle is now icon-only there
  (label returns at sm and up).
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes.

## 2026-10-30 — v1.9a softer mark (user tweak)

- Tile corner radius up: 24 → 72 on the 512 viewBox (≈14%, clearly rounded,
  not squircle), favicon 8 → 11 to match. Regenerated via make-logo.py.

## 2026-10-30 — v1.9b mark explorations (awaiting pick)

- "Give the logo more life" — studied Emil Kowalski's own mark (a plain
  gradient orb): the life comes from light and motion, not detail.
- Five variants generated into design/logo-explorations/ (comparison sheet
  at design/logo-explorations/index.html, live at /design/logo-explorations/
  on the dev server):
  beam (radial phosphor light falloff, static), dissolve (feet scatter into
  cells, static), cursor (SMIL blinking block cursor), sweep (SMIL light
  band clipped to the glyph, 3.8s loop), resolve (SMIL rows settle on load).
- make-logo.py extended: letter_runs now yields (start, end, luminance).
- Caveat: SMIL does not advance under headless --virtual-time-budget, so
  animated variants were verified in code, not by screenshot — confirm in a
  real browser before adopting. Recommendation: beam (static) or sweep
  (animated); favicon stays flat regardless.

## 2026-10-30 — v1.10 back-to-top is a link, not a button

- Owner's call: the footer's dark pill was a button where a link belongs —
  it also wrapped onto two lines at phone widths.
- Now an inline link: "Back to top" + ArrowUp (lucide, 14px), underlined on
  hover; the arrow rises 2px on hover via a .link-arrow utility gated to
  hover-capable pointers, 150ms var(--ease-out), transform-only.
- Deliberate exception: this is the page's ONE arrow glyph (skill copy
  rule: at most one). Nav links and hero CTA stay words.
- Follow-up: at 390px the phrase still broke ("top ↑" dropping under
  "Back to") — the link now carries whitespace-nowrap + shrink-0, so the
  credit wraps instead and the phrase + arrow always hold one line.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes
  (3 WARN — all previously defended categories). Mobile wrap fix verified
  on a real-scroll 390px capture.

## 2026-10-30 — v1.11 peeking windows replace How-it-works

- Adapted the animations.dev "community" card (owner supplied the HTML):
  text up top, a miniature of the product's own UI peeking from the
  bottom-right corner — mt-auto, overflow-hidden crop, top/left border
  only, select-none, so it reads as picture. The badge detail ("7")
  became our "0 uploads" badge.
- Owner's call: the four-stage How-it-works band comes out; this section
  takes its place right after the hero. HowItWorks.tsx deleted; hero and
  footer nav now point to #features ("Features").
- Layout per 2026 bento research: hierarchy through size, not three equal
  boxes — one wide hero cell ("Every slider, live", md:col-span-2) over
  two supporting cells ("Private by design", "Yours to keep"). Full-bleed
  seamless grid, fields rotating bg/surface/field like the old band.
- The hero window runs a REAL conversion (stairs, phosphor, 170 cols).
  First attempt used 44 cols stretched to ~1200px — soft green blobs.
  AsciiCanvas draws at natural size ×dpr then CSS-stretches, so cols now
  make natural width ≈ window width: dpr-2 backing downscales, glyphs
  stay crisp. Caption and slider value both say 170 cols.
- Micro-delights (gated to hover-capable pointers, transform-only,
  var(--ease-out)): the window rises 6px on card hover; on the hero card
  the Resolution thumb nudges 8px right, as if someone is tuning.
  Entrance: staggered reveal, 0/90/180ms.
- Footer deduplication: its "Private by design" blurb moved up into the
  cards, so the footer grid drops to 3 columns.
- New defended finding: [eyebrow] @1440 — the detector reads a hero tile
  caption ("building → 56 cols · color") as a kicker above "Every slider,
  live". It's tile metadata; allowed via --allow eyebrow.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL both themes
  (4 WARN light / 3 dark — all previously defended categories). Crops
  verified at 1440 light+dark and 390 mobile.

## 2026-10-30 — v1.11a contain the band on desktop (user tweak)

- Owner: mobile is perfect, desktop stretches too much. From md up the
  grid now sits in the same contained column as the converter
  (mx-auto max-w-[1100px], overflow-hidden rounded-lg, md:px-5 md:py-20).
  Mobile keeps the full-bleed stack untouched.
- Side effect: the defended [eyebrow] finding disappeared — the heading
  no longer neighbours a hero tile caption. Allowance dropped.
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL (3 WARN — all
  previously defended). Desktop crop verified.

## 2026-10-30 — v1.11b true bento: separated, rounded cells (user tweak)

- Owner wanted the cells apart and rounded. The seamless wrapper is gone:
  real gaps (12px phone / 16px desktop), every card rounded-xl with
  overflow-hidden so the peeking window clips against the rounded corner.
  Mobile gains side margins (px-4) — cards no longer touch the edges.
- Field rotation adjusted: hero was on --color-bg (page white) and would
  have vanished against the white gaps — now field/surface/field.
- The [eyebrow] allowance is back (same tile-caption false positive).
- Gate: build clean, lint 0 FAIL/0 WARN, inspect 0 FAIL (4 WARN — all
  defended). Crops verified at 1440 and 390.
