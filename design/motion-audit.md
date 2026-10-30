# Motion audit — ascii conversor

Standard applied: Emil Kowalski's review-animations rulebook (ease-out only, UI motion < 300 ms, transform/opacity only, interruptibility, asymmetric press, hover gating, reduced-motion keeps fades but drops movement).

## Verdict: Approve with required fixes — nothing blocks

The foundation is right: every interactive transition already runs on transform/opacity/color with `duration-150`, presses use `active:scale-[0.97]`, and the two entrances (`rise`, `shutter`) are one-shot scroll moments. The problems are three missed moments and three standard violations.

## Findings

| # | Where | Before | After | Why |
|---|-------|--------|-------|-----|
| 1 | `HowItWorks.tsx` card | `group-hover:-translate-y-1.5` fires on touch devices, where hover is sticky/emulated | Gate behind `@media (hover:hover) and (pointer:fine)` via a `.lift-hover` utility | Hover motion must never trigger on touch — it sticks and reads as a bug |
| 2 | `index.css` reduced-motion block | `* { transition-duration: 0.01ms !important }` nukes *all* transitions, including harmless color fades | Restrict `transition-property` to color/opacity under reduced motion; drop transform + keyframe movement | Reduced-motion users still benefit from fades; only movement causes discomfort |
| 3 | `index.css` `--ease-out` token | `cubic-bezier(0, 0, 0.2, 1)` — the weak default | `cubic-bezier(0.23, 1, 0.32, 1)` — strong ease-out | Entrances should decelerate decisively; the default curve feels lazy at 700–1100 ms |
| 4 | Theme toggle | Colors snap instantly across the whole page | Temporary `.theme-transition` class on `<html>` for 320 ms: background/color transitions only, scoped, never on first paint | A global state change this large needs a coordinated settle, not a hard cut |
| 5 | Dropzone drag-over | Flat background-color swap only | Inner content scales to 1.015 with a 160 ms interruptible transition on drag-over | Physical "the surface is ready to receive" feedback; scale communicates affordance color alone can't |
| 6 | New image conversion | Old grid → new grid is a hard cut (the product's core moment!) | `convert-in`: 260 ms opacity + blur(2px→0) ease-out, keyed on source change only — never on slider drags | The dissolve *is* the product promise ("watch the image dissolve into type"); blur masks the mid-flight grid swap |
| 7 | `.reveal` entrances | Keyframe-based, non-interruptible | Keep as-is | Fires once per element, unobserved after — interruptibility doesn't apply to one-shot scroll entrances |

## Implementation plan

1. **`index.css`** — strengthen `--ease-out`; add `.lift-hover` (hover-gated), `.drop-scale` + `[data-dragging]` rule, `@keyframes convert-in`, `.theme-transition` scoping; rework the reduced-motion block to keep color/opacity fades and drop only movement.
2. **`HowItWorks.tsx`** — swap the Tailwind hover classes for `.lift-hover`.
3. **`useTheme.ts`** — add/remove `.theme-transition` around the dataset flip (320 ms), skipped under reduced-motion.
4. **`Converter.tsx`** — wrap render-area children in `.drop-scale`; key the grid wrapper on a `sourceTick` counter so a new source replays `convert-in` while slider changes don't.

Validation: `npm run build` → taste lint (0 FAIL) → inspector screenshots in both themes.
