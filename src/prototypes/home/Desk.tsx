import { useState } from "react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Converter } from "../../components/Converter";
import { Credit } from "./Field";

const SAMPLES = [
  { src: "/samples/bridge.jpg", name: "Bridge" },
  { src: "/samples/vaults.jpg", name: "Vaults" },
  { src: "/samples/stairs.jpg", name: "Stairs" },
  { src: "/samples/building.jpg", name: "Building" },
];

async function loadSample(src: string) {
  const res = await fetch(src);
  const blob = await res.blob();
  const file = new File([blob], src.split("/").pop() ?? "sample.jpg", {
    type: blob.type || "image/jpeg",
  });
  window.dispatchEvent(new CustomEvent("ascii:source", { detail: file }));
}

/**
 * Desk — the tool is the first screen.
 * No poster. Drop, paste, or pick a sample; the render is already open.
 */
export function Desk() {
  const [active, setActive] = useState("Bridge");

  return (
    <div className="desk-frame min-h-[100svh]">
      <header className="flex h-14 items-center gap-3 border-b border-[var(--color-field)] px-4 md:px-6">
        <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
        <h1 className="text-[16px] font-extrabold tracking-[-0.04em]">ascii conversor</h1>
        <p className="hidden text-[14px] text-[var(--color-muted)] md:block">
          Drop an image, or paste one. It stays on this machine.
        </p>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-4 md:px-5">
        <div className="flex flex-wrap gap-2" role="list" aria-label="Sample images">
          {SAMPLES.map((sample) => {
            const pressed = active === sample.name;
            return (
              <button
                key={sample.name}
                type="button"
                aria-pressed={pressed}
                onClick={() => {
                  setActive(sample.name);
                  void loadSample(sample.src);
                }}
                className={`h-9 rounded-full px-3.5 text-[13px] font-semibold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] ${
                  pressed
                    ? "bg-[var(--color-accent)] text-[var(--color-on-accent)]"
                    : "bg-[var(--color-field)] text-[var(--color-ink)]"
                }`}
              >
                {sample.name}
              </button>
            );
          })}
        </div>
      </div>
      <Converter />
      <Credit />
    </div>
  );
}
