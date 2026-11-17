export function Footer() {
  return (
    <footer className="px-6 pb-16 text-[13px] text-[var(--color-faint)] md:px-10">
      <p>
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
      <p className="mt-1 max-w-[62ch]">
        Sample photos: Jeff Sheldon, Matthew Wiebe, Todd Quackenbush and Julien Moreau — Unsplash
        license, via Picsum.
      </p>
    </footer>
  );
}
