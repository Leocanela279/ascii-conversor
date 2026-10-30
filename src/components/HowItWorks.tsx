import { useEffect, useRef } from "react";
import { useAsciiImage } from "../lib/useAsciiImage";
import { useReveal } from "../lib/useReveal";
import { AsciiCanvas } from "./AsciiCanvas";

const SRC = "/samples/bridge.jpg";

/** A canvas that shows the image as a coarse grid of square pixels. */
function PixelGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const img = new Image();
    img.src = SRC;
    img.onload = () => {
      const canvas = ref.current;
      if (!canvas) return;
      const cols = 22;
      const rows = Math.round((cols * img.height) / img.width);
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, cols, rows);
      canvas.style.imageRendering = "pixelated";
    };
  }, []);
  return <canvas ref={ref} className="block w-full rounded-lg" aria-label="The image as a grid of cells" />;
}

function Stage({
  field,
  clause,
  children,
  dark = false,
  heading,
}: {
  field: string;
  clause: string;
  children: React.ReactNode;
  dark?: boolean;
  heading?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal group relative flex h-[64svh] flex-col md:h-[84svh]"
      style={{ background: field, color: dark ? "var(--color-on-panel)" : "var(--color-ink)" }}
    >
      {heading && (
        <h2 className="absolute left-5 top-5 text-[clamp(22px,2vw,32px)] font-extrabold tracking-[-0.03em]">
          {heading}
        </h2>
      )}
      <div className="flex flex-1 items-center justify-center px-6">
        <div
          data-ui
          className="lift-hover w-[min(260px,70%)]"
        >
          {children}
        </div>
      </div>
      <p className="absolute bottom-7 left-5 right-5 max-w-[18ch] text-[clamp(20px,1.8vw,30px)] font-semibold leading-tight tracking-[-0.02em]">
        {clause}
      </p>
    </div>
  );
}

export function HowItWorks() {
  const gray = useAsciiImage(SRC, 40, { mode: "paper", contrast: 1.2 });
  const color = useAsciiImage(SRC, 40, { mode: "color", contrast: 1.2 });

  return (
    <section id="how" aria-label="How it works">
      <div className="grid md:grid-cols-4">
        <Stage field="var(--color-bg)" clause="First, the image arrives." heading="How it works">
          <img
            src={SRC}
            alt="The original photograph of a white arched bridge"
            width={800}
            height={500}
            className="block w-full rounded-lg"
            loading="lazy"
          />
        </Stage>
        <Stage field="var(--color-surface)" clause="Then it becomes a grid of cells.">
          <PixelGrid />
        </Stage>
        <Stage field="var(--color-field)" clause="Then each cell finds its character.">
          <AsciiCanvas grid={gray.grid} fontSize={9} ariaLabel="Grayscale ASCII of the bridge" className="rounded-lg" />
        </Stage>
        <Stage field="var(--color-panel)" clause="Finally, every character takes its color." dark>
          <AsciiCanvas grid={color.grid} fontSize={9} ariaLabel="Color ASCII of the bridge" className="rounded-lg" />
        </Stage>
      </div>
    </section>
  );
}
