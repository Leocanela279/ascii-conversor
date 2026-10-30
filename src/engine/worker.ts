/// <reference lib="webworker" />
import { convert, type ConvertOptions, type Grid } from "./convert";

export interface ConvertRequest {
  id: number;
  width: number;
  height: number;
  buffer: ArrayBuffer;
  opts: ConvertOptions;
}

export interface ConvertResponse {
  id: number;
  grid: Grid;
}

self.onmessage = (e: MessageEvent<ConvertRequest>) => {
  const { id, width, height, buffer, opts } = e.data;
  const grid = convert(new Uint8ClampedArray(buffer), width, height, opts);
  (self as unknown as Worker).postMessage({ id, grid } satisfies ConvertResponse, [
    grid.chars.buffer,
    grid.colors.buffer,
  ]);
};
