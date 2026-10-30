import { CHARSETS } from "../engine/charsets";
import { useAsciiImage } from "../lib/useAsciiImage";
import { useReveal } from "../lib/useReveal";
import { AsciiCanvas } from "./AsciiCanvas";
import { ThemeToggle } from "./ThemeToggle";

const STRIPS = [
  { bg: "var(--color-accent)", ink: "var(--color-on-accent)" },
  { bg: "var(--color-panel)", ink: "var(--color-on-panel)" },
  { bg: "var(--color-muted)", ink: "var(--color-on-muted)" },
  { bg: "var(--color-field)", ink: "var(--color-ink)" },
];

function Strip({ index, children }: { index: number; children: string }) {
  const s = STRIPS[index % STRIPS.length];
  return (
    <div
      className="flex h-7 items-center px-3 text-[13px] font-semibold"
      style={{ background: s.bg, color: s.ink }}
    >
      {children}
    </div>
  );
}

function AsciiFrame({
  src,
  caption,
  strip,
  charset = "standard",
  mode = "color",
  shutter = false,
}: {
  src: string;
  caption: string;
  strip: number;
  charset?: keyof typeof CHARSETS;
  mode?: "color" | "paper" | "phosphor";
  shutter?: boolean;
}) {
  const { grid } = useAsciiImage(src, 56, {
    charset: CHARSETS[charset],
    mode,
    contrast: 1.3,
  });
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={shutter ? "shutter" : "reveal"}>
      <div className={shutter ? "shutter-inner" : undefined}>
        <AsciiCanvas grid={grid} fontSize={8} ariaLabel={caption} />
      </div>
      <Strip index={strip}>{caption}</Strip>
    </div>
  );
}

function PhotoFrame({
  src,
  caption,
  strip,
  alt,
}: {
  src: string;
  caption: string;
  strip: number;
  alt: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal">
      <img
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="block h-auto w-full"
        loading="lazy"
      />
      <Strip index={strip}>{caption}</Strip>
    </div>
  );
}

/** One full-height column of the sheet, offset vertically. */
function Column({
  offset,
  children,
}: {
  offset: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3" style={{ marginTop: offset }}>
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <header className="relative h-[100svh] overflow-hidden" id="top">
      {/* desktop sheet: six staggered columns behind the panel */}
      <div className="hidden h-[115svh] grid-cols-6 gap-3 px-5 lg:grid">
        <Column offset="-100px">
          <AsciiFrame src="/samples/vaults.jpg" caption="vaults → 56 cols · standard" strip={0} shutter />
          <PhotoFrame src="/samples/bridge.jpg" caption="source · bridge" strip={1} alt="White arched bridge over grey water" />
          <PhotoFrame src="/samples/stairs.jpg" caption="source · stairs" strip={3} alt="Narrow opening in a white wall revealing a staircase" />
          <AsciiFrame src="/samples/building.jpg" caption="building → phosphor" strip={2} mode="phosphor" />
          <AsciiFrame src="/samples/stairs.jpg" caption="stairs → 56 cols · color" strip={0} />
        </Column>
        <Column offset="-90px">
          <PhotoFrame src="/samples/stairs.jpg" caption="source · stairs" strip={2} alt="Narrow opening in a white wall revealing a staircase" />
          <AsciiFrame src="/samples/bridge.jpg" caption="bridge → 56 cols · blocks" strip={3} charset="blocks" />
          <PhotoFrame src="/samples/vaults.jpg" caption="source · vaults" strip={0} alt="Tall pointed vaults and pale columns of a church interior" />
          <AsciiFrame src="/samples/bridge.jpg" caption="bridge → detailed" strip={1} charset="detailed" />
        </Column>
        <Column offset="-40px">
          <AsciiFrame src="/samples/bridge.jpg" caption="bridge → 56 cols · color" strip={1} />
          <PhotoFrame src="/samples/stairs.jpg" caption="source · stairs" strip={3} alt="Narrow opening in a white wall revealing a staircase" />
          <AsciiFrame src="/samples/vaults.jpg" caption="vaults → blocks" strip={2} charset="blocks" />
          <PhotoFrame src="/samples/building.jpg" caption="source · building" strip={0} alt="Stepped white modern building corner against a pale sky" />
        </Column>
        <Column offset="-180px">
          <PhotoFrame src="/samples/bridge.jpg" caption="source · bridge" strip={2} alt="White arched bridge over grey water" />
          <AsciiFrame src="/samples/building.jpg" caption="building → detailed · 70 glyphs" strip={3} charset="detailed" />
          <AsciiFrame src="/samples/stairs.jpg" caption="stairs → 56 cols · color" strip={0} />
          <PhotoFrame src="/samples/vaults.jpg" caption="source · vaults" strip={1} alt="Tall pointed vaults and pale columns of a church interior" />
        </Column>
        <Column offset="-20px">
          <PhotoFrame src="/samples/building.jpg" caption="source · building" strip={1} alt="Stepped white modern building corner against a pale sky" />
          <AsciiFrame src="/samples/vaults.jpg" caption="vaults → paper ink" strip={2} mode="paper" />
          <PhotoFrame src="/samples/stairs.jpg" caption="source · stairs" strip={0} alt="Narrow opening in a white wall revealing a staircase" />
          <AsciiFrame src="/samples/building.jpg" caption="building → 56 cols · color" strip={3} />
        </Column>
        <Column offset="-70px">
          <AsciiFrame src="/samples/stairs.jpg" caption="stairs → minimal" strip={1} charset="minimal" />
          <PhotoFrame src="/samples/vaults.jpg" caption="source · vaults" strip={3} alt="Tall pointed vaults and pale columns of a church interior" />
          <AsciiFrame src="/samples/bridge.jpg" caption="bridge → binary" strip={0} charset="binary" />
          <PhotoFrame src="/samples/bridge.jpg" caption="source · bridge" strip={2} alt="White arched bridge over grey water" />
        </Column>
      </div>

      {/* phone sheet: two columns below the panel (clears panel + caption strip) */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-[calc(42svh+52px)] lg:hidden">
        <Column offset="0px">
          <AsciiFrame src="/samples/vaults.jpg" caption="vaults → 56 cols" strip={0} />
          <PhotoFrame src="/samples/bridge.jpg" caption="source · bridge" strip={1} alt="White arched bridge over grey water" />
          <AsciiFrame src="/samples/stairs.jpg" caption="stairs → blocks" strip={2} charset="blocks" />
        </Column>
        <Column offset="-60px">
          <PhotoFrame src="/samples/building.jpg" caption="source · building" strip={3} alt="Stepped white modern building corner" />
          <AsciiFrame src="/samples/bridge.jpg" caption="bridge → phosphor" strip={2} mode="phosphor" />
          <AsciiFrame src="/samples/building.jpg" caption="building → detailed" strip={0} charset="detailed" />
        </Column>
      </div>

      {/* the one text cell — same instance on every width */}
      <div className="absolute inset-x-4 top-4 lg:inset-x-auto lg:left-[calc(33.3333%+10px)] lg:top-[28svh] lg:w-[calc(33.3333%-18px)]">
        <TextPanel />
      </div>
    </header>
  );
}

function TextPanel() {
  const { grid } = useAsciiImage("/samples/vaults.jpg", 64, {
    mode: "phosphor",
    charset: CHARSETS.standard,
    contrast: 1.2,
  });
  return (
    <div>
      {/* square corners like every tile on the board; controls keep their
          rounding — surfaces square, controls rounded */}
      <div className="relative flex min-h-[42svh] flex-col overflow-hidden bg-[var(--color-panel)] p-6 text-[var(--color-on-panel)] lg:h-[410px] lg:min-h-0">
        {/* the panel is made of the same stuff as the tiles around it:
            a faint phosphor render, dissolving toward the nav row */}
        <div
          className="panel-texture pointer-events-none absolute inset-0 opacity-[0.14]"
          aria-hidden="true"
        >
          <AsciiCanvas grid={grid} fontSize={20} ariaLabel="" />
        </div>
        <div className="relative flex h-full flex-col">
          <h1 className="text-[clamp(2.5rem,3.4vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
            <span className="block">ascii</span>
            <span className="block">conversor</span>
          </h1>
          <p className="mt-4 max-w-[24ch] text-[20px] leading-snug">
            Any image, rebuilt as text. Same shades, same colors.
          </p>
          <a
            href="#demo"
            className="mt-6 inline-flex h-12 w-fit items-center rounded-lg bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-on-accent)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--color-accent-strong)] active:scale-[0.97]"
          >
            Convert an image
          </a>
          <nav className="mt-auto flex items-center gap-5 pt-6 text-[15px] font-semibold">
            <a className="underline-offset-4 hover:underline" href="#how">How it works</a>
            <a className="underline-offset-4 hover:underline" href="#demo">Try it</a>
            <a
              className="underline-offset-4 hover:underline"
              href="https://github.com/Leocanela279"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
      {/* the same caption strip every tile carries — the panel joins the board */}
      <Strip index={0}>ascii conversor · the tool</Strip>
    </div>
  );
}
