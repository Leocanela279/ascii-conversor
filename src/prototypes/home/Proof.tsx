import { ThemeToggle } from "../../components/ThemeToggle";
import { Converter } from "../../components/Converter";
import { Compare } from "./Compare";
import { Credit } from "./Field";

/**
 * Proof — one comparison does the explaining.
 * A drag rule splits the photograph and its ASCII. Type stays quiet
 * above the frame; the picture is the argument.
 */
export function Proof() {
  return (
    <>
      <header className="flex h-16 items-center gap-6 border-b border-[var(--color-field)] px-5 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
          <span className="text-[15px] font-extrabold tracking-[-0.04em]">ascii conversor</span>
        </a>
        <nav className="ml-auto flex items-center gap-5 text-[15px] font-semibold">
          <a className="underline-offset-4 hover:underline" href="#demo">
            Try it
          </a>
          <a
            className="hidden underline-offset-4 hover:underline sm:inline"
            href="https://github.com/Leocanela279"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </header>
      <section id="top" className="px-5 pt-10 md:px-8 md:pt-14">
        <div className="proof-enter mx-auto max-w-[1120px]">
          <h1 className="max-w-[16ch] text-[clamp(2.6rem,5vw,4.25rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
            Any image, rebuilt as text.
          </h1>
          <p className="mt-4 max-w-[42ch] text-[18px] leading-snug text-[var(--color-muted)]">
            Drag the divider. Type on the left, the photograph on the right. Same frame, same colors.
          </p>
          <a
            href="#demo"
            className="mt-6 inline-flex h-12 w-fit items-center rounded-lg bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-on-accent)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--color-accent-strong)] active:scale-[0.97]"
          >
            Convert an image
          </a>
          <div className="mt-8">
            <Compare
              src="/samples/bridge.jpg"
              alt="White arched bridge over grey water, shown beside its ASCII rendering"
            />
          </div>
        </div>
      </section>
      <Converter />
      <Credit />
    </>
  );
}
