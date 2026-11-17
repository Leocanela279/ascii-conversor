import { CHARSETS } from "../../engine/charsets";
import { useAsciiImage } from "../../lib/useAsciiImage";
import { AsciiCanvas } from "../../components/AsciiCanvas";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Converter } from "../../components/Converter";

/**
 * Field — the character grid is the page.
 * A phosphor render fills the right of the first screen; the words sit
 * in a solid column, not a card floating on the sheet.
 */
export function Field() {
  const { grid } = useAsciiImage("/samples/vaults.jpg", 56, {
    mode: "color",
    charset: CHARSETS.standard,
    contrast: 1.4,
  });

  return (
    <>
      <section className="grid min-h-[100svh] lg:grid-cols-[minmax(320px,42%)_1fr]">
        <div className="field-copy flex flex-col bg-[var(--color-panel)] px-6 py-8 text-[var(--color-on-panel)] sm:px-10 lg:px-12 lg:py-10">
          <img src="/logo.svg" alt="" width={56} height={56} className="h-12 w-12" />
          <h1 className="mt-8 text-[clamp(3.25rem,5.2vw,4.75rem)] font-extrabold leading-[0.88] tracking-[-0.055em]">
            ascii
            <br />
            conversor
          </h1>
          <p className="mt-5 max-w-[28ch] text-[18px] leading-snug text-[var(--color-on-panel-muted)]">
            Any image, rebuilt as text. Same shades, same colors. The file never leaves this device.
          </p>
          <a
            href="#demo"
            className="mt-7 inline-flex h-12 w-fit items-center rounded-lg bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-on-accent)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--color-accent-strong)] active:scale-[0.97]"
          >
            Convert an image
          </a>
          <nav className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-semibold">
            <a className="underline-offset-4 hover:underline" href="#demo">
              Try it
            </a>
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
          <ul className="mt-auto grid gap-3 pt-12 text-[14px] leading-snug text-[var(--color-on-panel-muted)]">
            <li>
              <span className="font-semibold text-[var(--color-on-panel)]">Live.</span> Resolution,
              contrast, and charset re-render as you drag.
            </li>
            <li>
              <span className="font-semibold text-[var(--color-on-panel)]">Local.</span> The math
              runs in a worker on this machine. Nothing is uploaded.
            </li>
            <li>
              <span className="font-semibold text-[var(--color-on-panel)]">Yours.</span> Save a PNG
              or copy the characters. No account.
            </li>
          </ul>
        </div>
        <div className="relative min-h-[48svh] overflow-hidden bg-[var(--color-artbg)] lg:min-h-0">
          <div className="field-shutter absolute inset-0">
            <div className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2">
              {grid && (
                <AsciiCanvas
                  grid={grid}
                  fontSize={14}
                  ariaLabel="Color ASCII of a vaulted interior"
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <Converter />
      <Credit />
    </>
  );
}

export function Credit() {
  return (
    <p className="px-6 pb-28 text-[13px] text-[var(--color-faint)] md:px-10">
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
    </p>
  );
}
