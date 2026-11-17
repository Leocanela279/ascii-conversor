import { buttonClass } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { Compare } from "./Compare";

/** The first screen: one sentence, then the photograph split against its ASCII. */
export function Hero() {
  return (
    <>
      <header className="flex h-16 items-center gap-6 border-b border-[var(--color-field)] px-5 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
          <span className="text-[length:var(--step-ui)] font-extrabold tracking-[-0.04em]">
            ascii conversor
          </span>
        </a>
        <nav className="ml-auto flex items-center gap-5 text-[length:var(--step-ui)] font-semibold">
          <a className="link" href="#demo">
            Try it
          </a>
          <a
            className="link hidden sm:inline"
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
          <h1 className="max-w-[16ch] text-[length:var(--step-head)] font-extrabold leading-[0.92] tracking-[-0.05em]">
            Any image, rebuilt as text.
          </h1>
          <p className="mt-4 max-w-[42ch] text-[length:var(--step-body)] leading-snug text-[var(--color-muted)]">
            Drag the divider. Type on the left, the photograph on the right. Same frame, same colors.
          </p>
          <a href="#demo" className={`mt-6 w-fit ${buttonClass("accent", "lg")}`}>
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
    </>
  );
}
