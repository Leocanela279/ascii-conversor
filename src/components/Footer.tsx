import { ArrowUp } from "lucide-react";
import { useReveal } from "../lib/useReveal";

const WORD = "ASCIICONVERSOR".split("");
const HEIGHTS = [100, 72, 88, 64, 95, 70, 84, 60, 92, 76, 86, 66, 90, 80];

export function Footer() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <footer ref={ref} className="reveal mt-16 bg-[var(--color-surface)] px-5 pb-5 pt-8 md:px-8">
      {/* the mark, built from blocks — one line, letters knocked out */}
      <div
        className="flex h-[14svh] items-end gap-1 whitespace-nowrap md:h-[20svh]"
        role="img"
        aria-label="ascii conversor wordmark built from blocks"
      >
        {WORD.map((letter, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="flex min-w-0 flex-1 items-center justify-center rounded-[4px] font-extrabold leading-none"
            style={{
              height: `${HEIGHTS[i % HEIGHTS.length]}%`,
              background:
                letter === "C" ? "var(--color-accent)" : "var(--color-block)",
              color: "var(--color-surface)",
              fontSize: "clamp(0.8rem, 3.2vw, 3rem)",
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 text-[16px] md:grid-cols-3">
        <nav aria-label="Footer" className="flex flex-col gap-2 font-semibold">
          <a className="underline-offset-4 hover:underline" href="#features">Features</a>
          <a className="underline-offset-4 hover:underline" href="#demo">Try it</a>
          <a
            className="underline-offset-4 hover:underline"
            href="https://github.com/Leocanela279"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div>
          <p className="font-semibold">Sample photos</p>
          <p className="mt-1 text-[var(--color-faint)]">
            Jeff Sheldon, Matthew Wiebe, Todd Quackenbush and Julien Moreau — Unsplash license, via Picsum.
          </p>
        </div>
        <div>
          <p className="font-semibold">Built with</p>
          <p className="mt-1">React, a Web Worker and one canvas per render.</p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between text-[13px] text-[var(--color-faint)]">
        <span>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/Leocanela279"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--color-muted)] underline-offset-4 hover:underline"
          >
            Leandro Canela
          </a>{" "}
          · ascii conversor
        </span>
        <a
          href="#top"
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold text-[var(--color-ink)] underline-offset-4 hover:underline"
        >
          Back to top
          <ArrowUp size={14} strokeWidth={2} className="link-arrow" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
