#!/usr/bin/env python3
"""Generate the ascii conversor mark: the letter A as phosphor scanlines.

The A is rasterized once, then each row's filled runs become horizontal
bars — exactly what a run of "█" glyphs looks like in the product's own
output. Two outputs:
  public/logo.svg    display mark: dark tile, scanline A, restrained glow
  public/favicon.svg flat, chunkier bars, legible at 16px
"""

from PIL import Image, ImageDraw, ImageFont

LETTER = "A"
ARTBG = "#211d19"      # --color-artbg (light theme tile ground)
PHOSPHOR = "#1cb266"   # --color-accent-strong (dark): bright terminal green

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/HelveticaNeue.ttc",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    raise SystemExit("no usable bold font found")


def letter_runs(rows: int, cols: int) -> list[list[tuple[float, float, float]]]:
    """Rasterize the letter on a rows x cols grid; per row, return the
    filled x-runs as (start, end, luminance) fractions of the grid width."""
    img = Image.new("L", (cols, rows), 0)
    draw = ImageDraw.Draw(img)
    font = load_font(int(rows * 1.15))
    bbox = draw.textbbox((0, 0), LETTER, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (cols - w) / 2 - bbox[0]
    y = (rows - h) / 2 - bbox[1]
    draw.text((x, y), LETTER, fill=255, font=font)
    # widen the letterform ~14%: a more monumental A that fills its tile
    img = img.resize((int(cols * 1.14), rows), Image.LANCZOS)
    left = (img.width - cols) // 2
    img = img.crop((left, 0, left + cols, rows))
    px = img.load()

    runs_per_row: list[list[tuple[float, float, float]]] = []
    for r in range(rows):
        runs: list[tuple[float, float, float]] = []
        c = 0
        while c < cols:
            if px[c, r] > 110:
                start = c
                total = 0
                while c < cols and px[c, r] > 110:
                    total += px[c, r]
                    c += 1
                lum = total / ((c - start) * 255)
                runs.append((start / cols, c / cols, lum))
            else:
                c += 1
        runs_per_row.append(runs)
    return runs_per_row


def bars_svg(runs_per_row, area, rows, fill_ratio):
    """SVG rects for every run; bars keep a gap below for the scanline rhythm."""
    x0, y0, side = area
    row_h = side / rows
    bar_h = row_h * fill_ratio
    parts = []
    for r, runs in enumerate(runs_per_row):
        y = y0 + r * row_h
        for start, end, _lum in runs:
            parts.append(
                f'<rect x="{x0 + start * side:.1f}" y="{y:.1f}" '
                f'width="{(end - start) * side:.1f}" height="{bar_h:.1f}"/>'
            )
    return "".join(parts)


def build(path, size, rows, pad_ratio, fill_ratio, radius, glow):
    cols = rows * 2  # letter grid finer horizontally: crisper diagonals
    runs = letter_runs(rows, cols)
    pad = size * pad_ratio
    area = (pad, pad, size - 2 * pad)
    bars = bars_svg(runs, area, rows, fill_ratio)

    glow_defs = ""
    glow_layer = ""
    if glow:
        glow_defs = (
            '<defs><filter id="glow" x="-40%" y="-40%" width="180%" height="180%">'
            '<feGaussianBlur stdDeviation="7"/></filter></defs>'
        )
        glow_layer = f'<g filter="url(#glow)" opacity="0.5" fill="{PHOSPHOR}">{bars}</g>'

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" '
        f'aria-label="ascii conversor logo">{glow_defs}'
        f'<rect width="{size}" height="{size}" rx="{radius}" fill="{ARTBG}"/>'
        f"{glow_layer}"
        f'<g fill="{PHOSPHOR}">{bars}</g>'
        f"</svg>"
    )
    with open(path, "w") as f:
        f.write(svg)
    print(f"wrote {path} ({len(svg)} bytes)")


# ---------------------------------------------------------------------------
# explorations: giving the mark more life (owner brief, Emil's orb as inspo)

import math
import os

GREEN_DIM = "#0e5c33"
GREEN_MID = "#149b57"
GREEN_HOT = "#3ddc84"

EXPLORATIONS_DIR = "design/logo-explorations"
SIZE = 512
ROWS = 64
COLS = ROWS * 2
PAD_RATIO = 0.13
FILL = 0.55
RADIUS = 72
PAD = SIZE * PAD_RATIO
AREA = (PAD, PAD, SIZE - 2 * PAD)
ROW_H = AREA[2] / ROWS
BAR_H = ROW_H * FILL


def hex_lerp(a: str, b: str, t: float) -> str:
    ar, ag, ab = int(a[1:3], 16), int(a[3:5], 16), int(a[5:7], 16)
    br, bg, bb = int(b[1:3], 16), int(b[3:5], 16), int(b[5:7], 16)
    return (
        f"#{round(ar + (br - ar) * t):02x}"
        f"{round(ag + (bg - ag) * t):02x}"
        f"{round(ab + (bb - ab) * t):02x}"
    )


def rect(x, y, w, h, extra=""):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}"{extra}/>'


def write_exploration(name, body, defs=""):
    os.makedirs(EXPLORATIONS_DIR, exist_ok=True)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">{defs}'
        f'<rect width="{SIZE}" height="{SIZE}" rx="{RADIUS}" fill="{ARTBG}"/>'
        f"{body}</svg>"
    )
    path = f"{EXPLORATIONS_DIR}/{name}.svg"
    with open(path, "w") as f:
        f.write(svg)
    print(f"wrote {path} ({len(svg)} bytes)")


def explore_beam(runs):
    """The orb's light, translated: bars are brightest near a focal point
    and fall off toward the edges — phosphor excited by an electron beam."""
    fx, fy = 0.42, 0.36
    parts = []
    for r, row in enumerate(runs):
        y = AREA[1] + r * ROW_H
        for start, end, lum in row:
            cx = (start + end) / 2
            d = math.hypot(cx - fx, (r + 0.5) / ROWS - fy)
            falloff = max(0.0, 1.0 - d / 0.72)
            t = min(1.0, 0.14 + 0.86 * falloff * (0.45 + 0.55 * lum))
            parts.append(
                rect(AREA[0] + start * AREA[2], y, (end - start) * AREA[2], BAR_H,
                     f' fill="{hex_lerp(GREEN_DIM, GREEN_HOT, t)}"')
            )
    write_exploration("beam", "".join(parts))


def explore_dissolve(runs):
    """The product's own story: solid type above, scattering into cells
    below — the image dissolving into type, inverted."""
    dissolve_from = 0.70
    cell_w = AREA[2] / COLS
    parts = []
    for r, row in enumerate(runs):
        y = AREA[1] + r * ROW_H
        depth = max(0.0, (r / ROWS - dissolve_from) / (1 - dissolve_from))
        for start, end, _lum in row:
            if depth <= 0:
                parts.append(rect(AREA[0] + start * AREA[2], y, (end - start) * AREA[2], BAR_H,
                                  f' fill="{GREEN_MID}"'))
                continue
            keep = 1.0 - depth * 0.9
            c0, c1 = int(start * COLS), int(end * COLS)
            for c in range(c0, c1):
                h = ((c * 7349 + r * 15731) % 1000) / 1000  # deterministic scatter
                if h < keep:
                    parts.append(rect(AREA[0] + c * cell_w, y, cell_w * (0.9 if h < keep / 2 else 0.45),
                                      BAR_H, f' fill="{hex_lerp(GREEN_DIM, GREEN_MID, 1 - depth)}"'))
    write_exploration("dissolve", "".join(parts))


def explore_cursor(runs):
    """Terminal life: the glyph, then a block cursor that blinks."""
    bars = bars_svg(runs, AREA, ROWS, FILL)
    last = max(r for r, row in enumerate(runs) if row)
    right = max(end for row in runs if row for _, end, _ in [row[-1]])
    cx = AREA[0] + (right + 0.035) * AREA[2]
    cy = AREA[1] + (last - 1.1) * ROW_H
    cursor = (
        f'<rect x="{cx:.1f}" y="{cy:.1f}" width="{AREA[2] * 0.085:.1f}" '
        f'height="{ROW_H * 2.1:.1f}" fill="{PHOSPHOR}">'
        '<animate attributeName="opacity" values="1;1;0;0;1" '
        'keyTimes="0;0.42;0.5;0.92;1" dur="1.15s" repeatCount="indefinite"/>'
        "</rect>"
    )
    write_exploration("cursor", f'<g fill="{PHOSPHOR}">{bars}</g>{cursor}')


def explore_sweep(runs):
    """A light band travels down the glyph every few seconds — a CRT
    refresh passing through the letter. Clipped to the A's shape."""
    bars = bars_svg(runs, AREA, ROWS, FILL)
    band_h = AREA[2] * 0.30
    defs = (
        f'<defs><clipPath id="glyph">{bars}</clipPath>'
        f'<linearGradient id="band" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="{GREEN_HOT}" stop-opacity="0"/>'
        f'<stop offset="0.5" stop-color="{GREEN_HOT}" stop-opacity="0.85"/>'
        f'<stop offset="1" stop-color="{GREEN_HOT}" stop-opacity="0"/>'
        f"</linearGradient></defs>"
    )
    sweep = (
        f'<g clip-path="url(#glyph)">'
        f'<rect x="{AREA[0]}" y="{-band_h}" width="{AREA[2]}" height="{band_h}" fill="url(#band)">'
        f'<animate attributeName="y" from="{-band_h}" to="{SIZE}" dur="3.8s" '
        f'repeatCount="indefinite"/></rect></g>'
    )
    write_exploration("sweep", f'<g fill="{GREEN_MID}">{bars}</g>{sweep}', defs)


def explore_resolve(runs):
    """The hero moment of the site, as a mark: the A resolves top to
    bottom, row by row, every time it appears. Plays once, stays."""
    parts = []
    for r, row in enumerate(runs):
        if not row:
            continue
        y = AREA[1] + r * ROW_H
        row_bars = "".join(
            rect(AREA[0] + start * AREA[2], y, (end - start) * AREA[2], BAR_H)
            for start, end, _ in row
        )
        parts.append(
            f'<g opacity="0">{row_bars}'
            f'<animate attributeName="opacity" from="0" to="1" begin="{r * 0.016:.3f}s" '
            f'dur="0.22s" fill="freeze"/></g>'
        )
    write_exploration("resolve", f'<g fill="{PHOSPHOR}">{"".join(parts)}</g>')


def build_explorations():
    runs = letter_runs(ROWS, COLS)
    explore_beam(runs)
    explore_dissolve(runs)
    explore_cursor(runs)
    explore_sweep(runs)
    explore_resolve(runs)


# display mark: fine scanlines + a restrained phosphor glow (the CRT nod)
build("public/logo.svg", size=512, rows=64, pad_ratio=0.13, fill_ratio=0.55, radius=72, glow=True)
# favicon: coarse bars, flat, must survive 16px
build("public/favicon.svg", size=64, rows=22, pad_ratio=0.11, fill_ratio=0.72, radius=11, glow=False)
build_explorations()
