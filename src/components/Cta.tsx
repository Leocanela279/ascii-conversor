import { CHARSETS, type CharsetKey } from "../engine/charsets";
import type { ColorMode } from "../engine/convert";
import { useAsciiImage } from "../lib/useAsciiImage";
import { AsciiCanvas } from "./AsciiCanvas";

/** One tile in the stream: a source photo or a live conversion of one. */
type StreamTile =
  | { kind: "img"; src: string }
  | {
      kind: "ascii";
      src: string;
      cols: number;
      mode: ColorMode;
      charset: CharsetKey;
      fontSize: number;
    };

/* Mixed subjects, charsets and modes — the stream demonstrates range. */
const STREAM: StreamTile[] = [
  { kind: "img", src: "/samples/vaults.jpg" },
  { kind: "ascii", src: "/samples/vaults.jpg", cols: 48, mode: "color", charset: "standard", fontSize: 9 },
  { kind: "img", src: "/samples/stairs.jpg" },
  { kind: "ascii", src: "/samples/bridge.jpg", cols: 56, mode: "phosphor", charset: "blocks", fontSize: 9 },
  { kind: "img", src: "/samples/bridge.jpg" },
  { kind: "ascii", src: "/samples/stairs.jpg", cols: 48, mode: "paper", charset: "detailed", fontSize: 8 },
  { kind: "img", src: "/samples/building.jpg" },
  { kind: "ascii", src: "/samples/building.jpg", cols: 56, mode: "color", charset: "minimal", fontSize: 9 },
  { kind: "ascii", src: "/samples/vaults.jpg", cols: 40, mode: "phosphor", charset: "binary", fontSize: 10 },
];

function StreamTileView({ tile }: { tile: StreamTile }) {
  const ascii = tile.kind === "ascii" ? tile : null;
  const { grid } = useAsciiImage(ascii?.src ?? null, ascii?.cols ?? 48, {
    mode: ascii?.mode ?? "color",
    charset: ascii ? CHARSETS[ascii.charset] : CHARSETS.standard,
  });

  if (tile.kind === "img") {
    return (
      <div className="h-full w-[240px] overflow-hidden rounded-lg">
        <img
          src={tile.src}
          alt=""
          width={800}
          height={600}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex h-full w-[280px] items-center overflow-hidden rounded-lg bg-[var(--color-artbg)]">
      {grid && <AsciiCanvas grid={grid} fontSize={tile.kind === "ascii" ? tile.fontSize : 9} ariaLabel="" />}
    </div>
  );
}

/**
 * The closing stream: an infinite drift of sources and their conversions.
 * Pure showcase at every width — the converter above owns the action.
 */
export function Cta() {
  return (
    <section aria-label="Sample conversions" className="overflow-x-clip py-4">
      <div className="marquee h-[220px] md:h-[320px]" aria-hidden="true">
        <div className="marquee-track flex h-full w-max">
          {[...STREAM, ...STREAM].map((tile, i) => (
            <div key={i} className="h-full shrink-0 pr-3">
              <StreamTileView tile={tile} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
