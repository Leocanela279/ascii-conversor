import { useEffect, useRef } from "react";
import type { Grid } from "../engine/convert";
import { drawGrid, measureGrid } from "../lib/renderGrid";
import { cssVar, useThemeTick } from "../lib/useTheme";

interface Props {
  grid: Grid | null;
  fontSize?: number;
  background?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Renders a converted Grid onto a canvas: dark ground, one tinted glyph per cell.
 * The ground follows the theme's art background unless one is passed explicitly.
 */
export function AsciiCanvas({
  grid,
  fontSize = 10,
  background,
  className,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const themeTick = useThemeTick();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = background ?? cssVar("--color-artbg", "#211d19");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const metrics = measureGrid(grid, fontSize, 1);
    canvas.width = Math.ceil(metrics.width * dpr);
    canvas.height = Math.ceil(metrics.height * dpr);
    ctx.scale(dpr, dpr);
    drawGrid(ctx, grid, fontSize, 1, bg, metrics);
  }, [grid, fontSize, background, themeTick]);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label={ariaLabel ?? "ASCII rendering"}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}
