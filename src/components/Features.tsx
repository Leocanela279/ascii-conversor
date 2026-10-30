import { Copy, Download, ShieldCheck } from "lucide-react";
import { CHARSETS } from "../engine/charsets";
import { useAsciiImage } from "../lib/useAsciiImage";
import { useReveal } from "../lib/useReveal";
import { AsciiCanvas } from "./AsciiCanvas";

/**
 * The peeking-window card, adapted from animations.dev's community card:
 * text up top, a miniature of the product's own UI tucked into the
 * bottom-right corner, cropped by the card. On hover the window rises —
 * and on the hero card, a slider thumb nudges, as if someone is tuning.
 *
 * Layout: one wide hero cell (the live converter, the product's main act)
 * over two supporting cells — hierarchy through size, not three equal boxes.
 */

function Card({
  field,
  title,
  copy,
  delay,
  hero = false,
  children,
}: {
  field: string;
  title: string;
  copy: string;
  delay: number;
  hero?: boolean;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal group relative flex flex-col overflow-hidden rounded-xl pt-7 md:pt-9 ${
        hero ? "min-h-[420px] md:col-span-2 md:min-h-[440px]" : "min-h-[340px] md:min-h-[360px]"
      }`}
      style={{ background: field, animationDelay: `${delay}ms` }}
    >
      <div className="px-6 md:px-8">
        <h3
          className={`font-extrabold tracking-[-0.02em] ${
            hero ? "text-[clamp(22px,2vw,30px)]" : "text-[20px]"
          }`}
        >
          {title}
        </h3>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-[23px] text-[var(--color-muted)]">
          {copy}
        </p>
      </div>
      {/* the peek: flush with the card's bottom-right corner, cropped by overflow */}
      <div
        className={`ml-6 mt-6 select-none md:ml-8 ${hero ? "h-[250px] md:h-[260px]" : "h-[190px]"}`}
        aria-hidden="true"
      >
        <div data-ui className="peek h-full overflow-hidden rounded-tl-lg border-l border-t border-[var(--color-panel-2)] bg-[var(--color-panel)]">
          {children}
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  at,
  live = false,
}: {
  label: string;
  value: string;
  at: string;
  live?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[9px] font-semibold text-[var(--color-on-panel)]">{label}</span>
        <span className="text-[8px] tabular-nums text-[var(--color-on-panel-muted)]">{value}</span>
      </div>
      <div className="relative h-1 rounded-full bg-[var(--color-panel-2)]">
        <span
          className={`absolute -top-[3px] h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] ${
            live ? "peek-thumb" : "-translate-x-1/2"
          }`}
          style={live ? { left: at, marginLeft: -5 } : { left: at }}
        />
      </div>
    </div>
  );
}

/** A tiny live converter: real render on the left, miniature controls right. */
function MiniConverter() {
  // 170 cols ≈ 920px natural width (1836px at dpr 2): the canvas downscales
  // into the window instead of stretching, so the glyphs stay crisp.
  const { grid } = useAsciiImage("/samples/stairs.jpg", 170, {
    mode: "phosphor",
    charset: CHARSETS.standard,
  });
  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col overflow-hidden bg-[var(--color-artbg)]">
        <div className="flex flex-1 items-center overflow-hidden p-3">
          {grid && <AsciiCanvas grid={grid} fontSize={9} ariaLabel="" />}
        </div>
        <div className="flex items-baseline justify-between px-3 pb-2 text-[9px] text-[var(--color-on-panel-muted)]">
          <span>stairs.jpg · sample</span>
          {grid && (
            <span className="tabular-nums">
              {grid.cols} × {grid.rows} characters
            </span>
          )}
        </div>
      </div>
      <div className="flex w-[132px] flex-col gap-3 p-3 md:w-[150px] md:gap-3.5 md:p-4">
        <SliderRow label="Resolution" value="170 cols" at="58%" live />
        <SliderRow label="Contrast" value="1.15" at="34%" />
        <SliderRow label="Brightness" value="1.00" at="26%" />
        <div className="mt-1 flex gap-1">
          <span className="h-3.5 flex-1 rounded-full bg-[var(--color-accent)]" />
          <span className="h-3.5 flex-1 rounded-full bg-[var(--color-panel-2)]" />
          <span className="h-3.5 flex-1 rounded-full bg-[var(--color-panel-2)]" />
        </div>
      </div>
    </div>
  );
}

/** File rows with a "0 uploads" badge — the notification dot, flipped. */
function MiniPrivacy() {
  return (
    <div className="flex h-full flex-col gap-2 p-3.5">
      <div className="flex items-center gap-1.5">
        <ShieldCheck size={12} className="text-[var(--color-accent)]" />
        <span className="h-2 w-20 rounded-full bg-[var(--color-panel-2)]" />
      </div>
      {["photo.jpg", "portrait.png"].map((name) => (
        <div
          key={name}
          className="mt-1 flex items-center justify-between rounded-md bg-[var(--color-panel-2)] px-2.5 py-2"
        >
          <span className="text-[10px] font-medium text-[var(--color-on-panel)]">{name}</span>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-[var(--color-on-accent)]">
            0
          </span>
        </div>
      ))}
      <span className="mt-auto text-[9px] text-[var(--color-on-panel-muted)]">
        uploads · every conversion runs locally
      </span>
    </div>
  );
}

/** Mini export row: the two real actions, plus the toast that confirms. */
function MiniExport() {
  return (
    <div className="flex h-full flex-col gap-2 p-3.5">
      <div className="flex flex-1 flex-col justify-center gap-1.5 rounded-md bg-[var(--color-artbg)] px-2.5">
        <span className="h-1 w-4/5 rounded-full bg-[var(--color-panel-2)]" />
        <span className="h-1 w-3/5 rounded-full bg-[var(--color-panel-2)]" />
        <span className="h-1 w-[70%] rounded-full bg-[var(--color-panel-2)]" />
      </div>
      <div className="flex gap-1.5">
        <span className="flex h-6 flex-1 items-center justify-center gap-1 rounded-md bg-[var(--color-accent)] text-[9px] font-semibold text-[var(--color-on-accent)]">
          <Download size={9} strokeWidth={2.5} />
          Save PNG
        </span>
        <span className="flex h-6 flex-1 items-center justify-center gap-1 rounded-md bg-[var(--color-panel-2)] text-[9px] font-semibold text-[var(--color-on-panel)]">
          <Copy size={9} strokeWidth={2.5} />
          Copy text
        </span>
      </div>
      <span className="mx-auto rounded-full bg-[var(--color-panel-2)] px-2.5 py-1 text-[8px] text-[var(--color-on-panel-muted)]">
        PNG saved.
      </span>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" aria-label="Why ascii conversor" className="px-4 py-8 md:px-5 md:py-20">
      <h2 className="sr-only">Why ascii conversor</h2>
      {/* a true bento: separated, rounded cells in the converter's column;
          fields rotate so no cell disappears against the page */}
      <div className="mx-auto grid max-w-[1100px] gap-3 md:grid-cols-2 md:gap-4">
        <Card
          field="var(--color-field)"
          title="Every slider, live"
          copy="Resolution, contrast, brightness, charset — each nudge re-renders in milliseconds, right in front of you."
          delay={0}
          hero
        >
          <MiniConverter />
        </Card>
        <Card
          field="var(--color-surface)"
          title="Private by design"
          copy="The math runs in a Web Worker on your machine. Nothing is uploaded, ever."
          delay={90}
        >
          <MiniPrivacy />
        </Card>
        <Card
          field="var(--color-field)"
          title="Yours to keep"
          copy="Save a crisp PNG or copy the raw text. No account, no watermark."
          delay={180}
        >
          <MiniExport />
        </Card>
      </div>
    </section>
  );
}
