import { useLayoutEffect, useRef } from "react";
import { CHARSETS } from "../engine/charsets";
import { useAsciiImage } from "../lib/useAsciiImage";
import { AsciiCanvas } from "./AsciiCanvas";

const START = 58;

function clamp(n: number) {
  return Math.min(92, Math.max(8, n));
}

/**
 * Photograph underneath, ASCII clipped over the left portion.
 * The rule tracks the pointer 1:1. Position is written to the DOM,
 * not React state, so a drag does not re-render the canvas.
 */
export function Compare({ src, alt }: { src: string; alt: string }) {
  const { grid } = useAsciiImage(src, 78, {
    mode: "color",
    charset: CHARSETS.standard,
    contrast: 1.4,
  });
    const frame = useRef<HTMLDivElement>(null);
    const clip = useRef<HTMLDivElement>(null);
    const rule = useRef<HTMLDivElement>(null);
    const pos = useRef(START);
    const drag = useRef<{ id: number; left: number; width: number } | null>(null);

    const apply = (next: number) => {
      const value = clamp(next);
      pos.current = value;
      const frameEl = frame.current;
      const clipEl = clip.current;
      const ruleEl = rule.current;
      if (clipEl) clipEl.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      if (frameEl && ruleEl) {
        const width = drag.current?.width || frameEl.clientWidth;
        const x = (value / 100) * width;
        ruleEl.style.transform = `translate3d(${x}px, 0, 0) translateX(-50%)`;
      }
      const hit = frameEl?.querySelector<HTMLElement>("[role=slider]");
      if (hit) {
        hit.setAttribute("aria-valuenow", String(Math.round(value)));
        hit.setAttribute("aria-valuetext", `${Math.round(value)} percent ASCII`);
      }
    };

  useLayoutEffect(() => {
    apply(pos.current);
  });

  const fromClient = (clientX: number) => {
    const current = drag.current;
    if (!current || current.width === 0) return;
    apply(((clientX - current.left) / current.width) * 100);
  };

  return (
    <div
      ref={frame}
      className="relative h-[min(52vh,520px)] min-h-[280px] overflow-hidden bg-[var(--color-artbg)]"
    >
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div ref={clip} className="compare-clip pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          {grid && (
            <AsciiCanvas
              grid={grid}
              fontSize={10}
              ariaLabel="ASCII rendering of the same photograph"
            />
          )}
        </div>
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare the photograph and the ASCII"
        aria-valuemin={8}
        aria-valuemax={92}
        aria-valuenow={START}
        aria-valuetext={`${START} percent ASCII`}
        className="compare-hit absolute inset-0 z-10 cursor-ew-resize touch-none"
        onPointerDown={(e) => {
          if (drag.current) return;
          const rect = frame.current?.getBoundingClientRect();
          if (!rect) return;
          drag.current = { id: e.pointerId, left: rect.left, width: rect.width };
          e.currentTarget.setPointerCapture(e.pointerId);
          fromClient(e.clientX);
        }}
        onPointerMove={(e) => {
          if (drag.current?.id !== e.pointerId) return;
          fromClient(e.clientX);
        }}
        onPointerUp={(e) => {
          if (drag.current?.id === e.pointerId) drag.current = null;
        }}
        onPointerCancel={(e) => {
          if (drag.current?.id === e.pointerId) drag.current = null;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.stopPropagation();
            apply(pos.current - 4);
          } else if (e.key === "ArrowRight") {
            e.stopPropagation();
            apply(pos.current + 4);
          }
        }}
      >
        <div ref={rule} className="pointer-events-none absolute inset-y-0 left-0 w-11">
          <span className="absolute inset-y-0 left-1/2 flex -translate-x-1/2" aria-hidden="true">
            <span className="w-px bg-[var(--color-ink)]" />
            <span className="w-px bg-white" />
          </span>
          <span
            aria-hidden="true"
            className="compare-grip absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-ink)] bg-white"
          >
            <span className="flex gap-[3px]">
              <span className="h-3 w-px bg-[var(--color-ink)]" />
              <span className="h-3 w-px bg-[var(--color-ink)]" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
