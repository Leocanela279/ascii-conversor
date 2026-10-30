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


def letter_runs(rows: int, cols: int) -> list[list[tuple[float, float]]]:
    """Rasterize the letter on a rows x cols grid; per row, return the
    filled x-runs as (start, end) fractions of the grid width."""
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

    runs_per_row: list[list[tuple[float, float]]] = []
    for r in range(rows):
        runs: list[tuple[float, float]] = []
        c = 0
        while c < cols:
            if px[c, r] > 110:
                start = c
                while c < cols and px[c, r] > 110:
                    c += 1
                runs.append((start / cols, c / cols))
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
        for start, end in runs:
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


# display mark: fine scanlines + a restrained phosphor glow (the CRT nod)
build("public/logo.svg", size=512, rows=64, pad_ratio=0.13, fill_ratio=0.55, radius=24, glow=True)
# favicon: coarse bars, flat, must survive 16px
build("public/favicon.svg", size=64, rows=22, pad_ratio=0.11, fill_ratio=0.72, radius=8, glow=False)
