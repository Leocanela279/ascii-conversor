import { useRef, useState } from "react";
import { CHARSETS } from "../../engine/charsets";
import { useAsciiImage } from "../../lib/useAsciiImage";
import { AsciiCanvas } from "../../components/AsciiCanvas";

/**
 * Photograph underneath, ASCII clipped over the left portion.
 * The rule tracks the pointer 1:1. Pointer capture keeps the drag
 * alive if the cursor leaves the handle.
 */
export function Compare({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const dragId = useRef<number | null>(null);
  const [pos, setPos] = useState(58);
  const { grid } = useAsciiImage(src, 78, {
    mode: "color",
    charset: CHARSETS.standard,
    contrast: 1.4,
  });

  const setFromClient = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(92, Math.max(8, next)));
  };

  return (
    <div
      ref={frame}
      className="relative h-[min(52vh,520px)] min-h-[280px] overflow-hidden bg-[var(--color-artbg)]"
    >
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
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
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)} percent ASCII`}
        className="absolute inset-y-0 z-10 w-11 -translate-x-1/2 cursor-ew-resize touch-none"
        style={{ left: `${pos}%` }}
        onPointerDown={(e) => {
          if (dragId.current !== null) return;
          dragId.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClient(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragId.current !== e.pointerId) return;
          setFromClient(e.clientX);
        }}
        onPointerUp={(e) => {
          if (dragId.current === e.pointerId) dragId.current = null;
        }}
        onPointerCancel={(e) => {
          if (dragId.current === e.pointerId) dragId.current = null;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.stopPropagation();
            setPos((p) => Math.max(8, p - 4));
          } else if (e.key === "ArrowRight") {
            e.stopPropagation();
            setPos((p) => Math.min(92, p + 4));
          }
        }}
      >
        <span className="absolute inset-y-0 left-1/2 flex -translate-x-1/2" aria-hidden="true">
          <span className="w-px bg-[var(--color-ink)]" />
          <span className="w-px bg-white" />
        </span>
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-ink)] bg-white"
        >
          <span className="flex gap-[3px]" aria-hidden="true">
            <span className="h-3 w-px bg-[var(--color-ink)]" />
            <span className="h-3 w-px bg-[var(--color-ink)]" />
          </span>
        </span>
      </div>
    </div>
  );
}
