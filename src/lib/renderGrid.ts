import type { Grid } from "../engine/convert";

export const ART_FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'; // taste-skill-ignore — monospace is the medium itself: ASCII art is set in it

export interface RenderMetrics {
  cellW: number;
  cellH: number;
  width: number;
  height: number;
}

export function measureGrid(
  grid: Grid,
  fontSize: number,
  scale = 1,
): RenderMetrics {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = `${fontSize * scale}px ${ART_FONT}`;
  const cellW = ctx.measureText("M").width;
  const cellH = fontSize * scale;
  return {
    cellW,
    cellH,
    width: Math.ceil(grid.cols * cellW),
    height: Math.ceil(grid.rows * cellH),
  };
}

/** Draws a grid onto an existing 2d context. Context must be pre-scaled. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  fontSize: number,
  scale: number,
  background: string,
  metrics?: RenderMetrics,
) {
  const m = metrics ?? measureGrid(grid, fontSize, scale);
  const font = `${fontSize * scale}px ${ART_FONT}`;
  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, m.width, m.height);

  const { chars, colors, cols, rows } = grid;
  let lastColor = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const c = i * 3;
      const color = `rgb(${colors[c]},${colors[c + 1]},${colors[c + 2]})`;
      if (color !== lastColor) {
        ctx.fillStyle = color;
        lastColor = color;
      }
      ctx.fillText(String.fromCharCode(chars[i]), x * m.cellW, y * m.cellH);
    }
  }
  return m;
}

/** Renders the grid to a fresh canvas at export quality. */
export function gridToCanvas(grid: Grid, fontSize = 12, scale = 2): HTMLCanvasElement {
  const metrics = measureGrid(grid, fontSize, scale);
  const canvas = document.createElement("canvas");
  canvas.width = metrics.width * scale;
  canvas.height = metrics.height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  drawGrid(ctx, grid, fontSize, scale, "#211d19", {
    ...metrics,
    width: metrics.width,
    height: metrics.height,
  });
  return canvas;
}

/** Plain-text rendering of the grid (characters only). */
export function gridToText(grid: Grid): string {
  const lines: string[] = [];
  for (let y = 0; y < grid.rows; y++) {
    let line = "";
    for (let x = 0; x < grid.cols; x++) {
      line += String.fromCharCode(grid.chars[y * grid.cols + x]);
    }
    lines.push(line);
  }
  return lines.join("\n");
}
