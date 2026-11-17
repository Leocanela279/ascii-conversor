import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Desk } from "./Desk";
import { Field } from "./Field";
import { Proof } from "./Proof";
import "./picker.css";
import "./variants.css";

const VARIANTS = [
  { name: "Field", Component: Field },
  { name: "Proof", Component: Proof },
  { name: "Desk", Component: Desk },
] as const;

function readInitial() {
  const n = parseInt(new URLSearchParams(location.search).get("v") ?? "1", 10);
  return n >= 1 && n <= VARIANTS.length ? n - 1 : 0;
}

/**
 * Isolated prototype surface. Production home (App) does not import this.
 * Keys 1–3 and arrows switch. R replays the entrance. Swap is instant.
 */
export default function PrototypeHome() {
  const [index, setIndex] = useState(readInitial);
  const [epoch, setEpoch] = useState(0);
  const [ready, setReady] = useState(false);
  const [highlight, setHighlight] = useState({ x: 0, w: 0 });
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = useCallback((i: number) => {
    const el = items.current[i];
    if (!el) return;
    setHighlight({ x: el.offsetLeft, w: el.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    measure(index);
  }, [index, measure]);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    const onResize = () => measure(index);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => measure(index));
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [index, measure]);

  const setActive = useCallback(
    (i: number) => {
      if (i < 0 || i >= VARIANTS.length || i === index) {
        if (i === index) measure(i);
        return;
      }
      setIndex(i);
      const url = new URL(location.href);
      url.searchParams.set("v", String(i + 1));
      history.replaceState(null, "", url);
    },
    [index, measure],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) setActive(num - 1);
      else if (e.key === "ArrowRight") setActive((index + 1) % VARIANTS.length);
      else if (e.key === "ArrowLeft") setActive((index - 1 + VARIANTS.length) % VARIANTS.length);
      else if (e.key === "r" || e.key === "R") setEpoch((n) => n + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, setActive]);

  const Variant = VARIANTS[index].Component;

  return (
    <>
      <div key={`${index}-${epoch}`}>
        <Variant />
      </div>
      <nav className="proto-picker" data-ready={ready ? "" : undefined} aria-label="Prototype variants">
        <span
          className="proto-picker-highlight"
          aria-hidden="true"
          style={{ width: highlight.w, transform: `translateX(${highlight.x}px)` }}
        />
        {VARIANTS.map((variant, i) => (
          <button
            key={variant.name}
            ref={(el) => {
              items.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === index ? "" : undefined}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setActive(i)}
          >
            {variant.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={() => setEpoch((n) => n + 1)}
        >
          ↻
        </button>
      </nav>
    </>
  );
}
