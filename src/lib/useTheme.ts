import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const EVENT = "ascii:themechange";

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) root.classList.add("theme-transition");
  root.dataset.theme = theme;
  if (!reduce) {
    window.setTimeout(() => root.classList.remove("theme-transition"), 320);
  }
  try {
    localStorage.setItem("ascii-theme", theme);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Current theme plus a toggle that persists and notifies canvases. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    const onChange = () => setTheme(getTheme());
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const toggle = useCallback(() => {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  }, []);

  return [theme, toggle];
}

/** Re-render trigger for canvas components when the theme flips. */
export function useThemeTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  return tick;
}

/** Resolve a CSS custom property on :root. */
export function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}
