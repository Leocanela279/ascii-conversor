import { useEffect, useRef, useState } from "react";
import type { ConvertOptions, Grid } from "../engine/convert";
import {
  loadBitmap,
  measureCellAspect,
  runConvert,
  sampleCells,
} from "./asciiClient";
import { ART_FONT } from "./renderGrid";

const DEFAULT_OPTS: ConvertOptions = {
  contrast: 1.15,
  brightness: 1,
  invert: false,
  charset: " .:-=+*#%@",
  mode: "color",
};

const bitmapCache = new Map<string | Blob, ImageBitmap>();

async function getBitmap(src: string | Blob): Promise<ImageBitmap> {
  const hit = bitmapCache.get(src);
  if (hit) return hit;
  const bitmap = await loadBitmap(src);
  if (bitmapCache.size > 8) bitmapCache.clear();
  bitmapCache.set(src, bitmap);
  return bitmap;
}

/**
 * Loads an image (URL or Blob) and keeps a converted Grid in sync with the
 * options. The bitmap is decoded once per source; option changes only re-run
 * the sampling + worker conversion.
 */
export function useAsciiImage(
  src: string | Blob | null,
  cols: number,
  opts?: Partial<ConvertOptions>,
) {
  const [grid, setGrid] = useState<Grid | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);
  const optsKey = JSON.stringify(opts ?? {});

  useEffect(() => {
    if (!src) {
      setGrid(null);
      return;
    }
    let cancelled = false;
    const requestId = ++requestRef.current;
    const options: ConvertOptions = { ...DEFAULT_OPTS, ...(opts ?? {}) };

    (async () => {
      try {
        const bitmap = await getBitmap(src);
        if (cancelled || requestRef.current !== requestId) return;
        const aspect = measureCellAspect(`10px ${ART_FONT}`);
        const { pixels, cols: c, rows } = sampleCells(bitmap, cols, aspect);
        const result = await runConvert(pixels, c, rows, options);
        if (!cancelled && requestRef.current === requestId) {
          setGrid(result);
          setError(null);
        }
      } catch {
        if (!cancelled && requestRef.current === requestId) {
          setError("Could not read that image.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, cols, optsKey]);

  return { grid, error };
}
