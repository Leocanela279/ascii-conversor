export type ColorMode = "color" | "paper" | "phosphor";

export interface ConvertOptions {
  contrast: number; // 0.5 – 2
  brightness: number; // 0.5 – 2
  invert: boolean;
  charset: string; // ramp, ordered light -> dark
  mode: ColorMode;
}

export interface Grid {
  cols: number;
  rows: number;
  /** char codes, row-major, length cols*rows */
  chars: Uint16Array;
  /** rgb per cell, row-major, length cols*rows*3 */
  colors: Uint8ClampedArray;
}

const PAPER_INK: [number, number, number] = [239, 233, 230];

function adjustChannel(v: number, brightness: number, contrast: number): number {
  let x = (v / 255) * brightness;
  x = (x - 0.5) * contrast + 0.5;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Engine v1: luminance ramp + truecolor per cell.
 * `data` is RGBA pixel data already downsampled to cols x rows by the caller,
 * so each pixel is one character cell (its average color, courtesy of the
 * canvas scaler).
 */
export function convert(
  data: Uint8ClampedArray,
  cols: number,
  rows: number,
  opts: ConvertOptions,
): Grid {
  const n = opts.charset.length;
  const cells = cols * rows;
  const chars = new Uint16Array(cells);
  const colors = new Uint8ClampedArray(cells * 3);

  for (let i = 0; i < cells; i++) {
    const p = i * 4;
    let r = adjustChannel(data[p], opts.brightness, opts.contrast);
    let g = adjustChannel(data[p + 1], opts.brightness, opts.contrast);
    let b = adjustChannel(data[p + 2], opts.brightness, opts.contrast);
    if (opts.invert) {
      r = 1 - r;
      g = 1 - g;
      b = 1 - b;
    }

    // Rec. 709 luma
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // dark pixel -> heavy glyph (end of ramp)
    let idx = Math.round((1 - lum) * (n - 1));
    if (idx < 0) idx = 0;
    else if (idx >= n) idx = n - 1;
    chars[i] = opts.charset.charCodeAt(idx);

    // Coverage compensation: a cell's perceived brightness is roughly
    // glyph-ink-coverage x glyph-color. Dividing the cell color by the
    // glyph's density keeps the average close to the source pixel, so
    // bright areas stay bright instead of sinking into the dark ground.
    const density = (idx + 1) / n;
    const comp = 1 / Math.max(density, 1 / n);

    const c = i * 3;
    if (opts.mode === "color") {
      colors[c] = Math.min(255, Math.round(r * 255 * comp));
      colors[c + 1] = Math.min(255, Math.round(g * 255 * comp));
      colors[c + 2] = Math.min(255, Math.round(b * 255 * comp));
    } else if (opts.mode === "paper") {
      colors[c] = PAPER_INK[0];
      colors[c + 1] = PAPER_INK[1];
      colors[c + 2] = PAPER_INK[2];
    } else {
      // phosphor: luminance-driven terminal green, coverage-compensated
      const v = Math.min(1, lum * comp);
      colors[c] = Math.round(v * 64);
      colors[c + 1] = Math.round(v * 255);
      colors[c + 2] = Math.round(v * 140);
    }
  }

  return { cols, rows, chars, colors };
}
