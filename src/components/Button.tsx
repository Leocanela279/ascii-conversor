import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * The one button recipe, from the taste skill's motion reference:
 * colors ease on hover, the press gives way with scale(0.97) — and
 * transform must be part of the transition, or the press snaps.
 * Shared by every action so the recipe can't drift between buttons.
 */
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const VARIANTS = {
  accent:
    "bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)]",
  onPanel: "bg-[var(--color-on-panel)] text-[var(--color-panel)] hover:bg-white",
  ghost:
    "bg-[var(--color-panel-2)] text-[var(--color-on-panel)] hover:bg-[var(--color-panel-hover)]",
} as const;

const SIZES = {
  sm: "h-9 rounded-lg px-3 text-[13px]",
  md: "h-11 rounded-lg px-5 text-[15px]",
  lg: "h-12 rounded-lg px-6 text-[15px]",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: LucideIcon;
  children: ReactNode;
}

export function Button({
  variant = "accent",
  size = "md",
  icon: Icon,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={15} strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Toggle chip with a pressed state — the charset and color-mode pickers. */
export function Chip({
  pressed,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`${BASE} h-9 rounded-md px-3 text-[13px] ${
        pressed ? VARIANTS.accent : VARIANTS.ghost
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
