import type { ConvertOptions, Grid } from "../engine/convert";
import type { ConvertRequest, ConvertResponse } from "../engine/worker";

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, (grid: Grid) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("../engine/worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (e: MessageEvent<ConvertResponse>) => {
      const { id, grid } = e.data;
      const resolve = pending.get(id);
      if (resolve) {
        pending.delete(id);
        resolve(grid);
      }
    };
  }
  return worker;
}

/** Run a conversion off the main thread. `pixels` is RGBA at cols x rows. */
export function runConvert(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  opts: ConvertOptions,
): Promise<Grid> {
  const w = getWorker();
  const id = ++seq;
  const buffer = pixels.buffer.slice(0) as ArrayBuffer;
  return new Promise<Grid>((resolve) => {
    pending.set(id, resolve);
    const msg: ConvertRequest = { id, width, height, buffer, opts };
    w.postMessage(msg, [buffer]);
  });
}

export async function loadBitmap(src: string | Blob): Promise<ImageBitmap> {
  const blob =
    typeof src === "string" ? await (await fetch(src)).blob() : src;
  return createImageBitmap(blob);
}

const sampleCanvas = document.createElement("canvas");
const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true })!;

/**
 * Draw the bitmap down to one pixel per character cell and read it back.
 * Canvas scaling gives us the per-cell average color for free.
 */
export function sampleCells(
  bitmap: ImageBitmap,
  cols: number,
  cellAspect: number, // cell width / cell height of the rendering font
): { pixels: Uint8ClampedArray; cols: number; rows: number } {
  const imgAspect = bitmap.height / bitmap.width;
  const rows = Math.max(1, Math.round(cols * cellAspect * imgAspect));
  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.imageSmoothingQuality = "high";
  sampleCtx.drawImage(bitmap, 0, 0, cols, rows);
  const img = sampleCtx.getImageData(0, 0, cols, rows);
  return { pixels: img.data, cols, rows };
}

/** Measured width/height ratio of one monospace glyph at a given font size. */
const aspectCache = new Map<string, number>();
export function measureCellAspect(font: string): number {
  const hit = aspectCache.get(font);
  if (hit) return hit;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = font;
  const w = ctx.measureText("M").width;
  const h = parseFloat(font) || 12; // font size px, line-height 1
  const aspect = w / h;
  aspectCache.set(font, aspect);
  return aspect;
}
