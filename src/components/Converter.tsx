import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Download, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { CHARSETS, CHARSET_LABELS, type CharsetKey } from "../engine/charsets";
import type { ColorMode } from "../engine/convert";
import { useAsciiImage } from "../lib/useAsciiImage";
import { useReveal } from "../lib/useReveal";
import { gridToCanvas, gridToText } from "../lib/renderGrid";
import { AsciiCanvas } from "./AsciiCanvas";
import { Button, Chip } from "./Button";

const DEFAULT_SAMPLE = "/samples/bridge.jpg";

interface Controls {
  cols: number;
  contrast: number;
  brightness: number;
  invert: boolean;
  charset: CharsetKey;
  mode: ColorMode;
}

export function Converter() {
  const [source, setSource] = useState<Blob | string>(DEFAULT_SAMPLE);
  const [sourceName, setSourceName] = useState("bridge.jpg · sample");
  const [controls, setControls] = useState<Controls>({
    cols: 120,
    contrast: 1.15,
    brightness: 1,
    invert: false,
    charset: "standard",
    mode: "color",
  });
  const [dragging, setDragging] = useState(false);
  // bumped per accepted file: keys the render wrapper so a new source
  // replays the convert-in dissolve, while control changes never do
  const [sourceTick, setSourceTick] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const sectionRef = useReveal<HTMLDivElement>();

  const { grid, error } = useAsciiImage(source, controls.cols, {
    contrast: controls.contrast,
    brightness: controls.brightness,
    invert: controls.invert,
    charset: CHARSETS[controls.charset],
    mode: controls.mode,
  });

  const acceptFile = useCallback((file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("That file is not an image.");
      return;
    }
    setSource(file);
    setSourceName(file.name);
    setSourceTick((t) => t + 1);
    toast.success(`Loaded ${file.name}`);
  }, []);

  // image arrives from the CTA tile
  useEffect(() => {
    const onOpen = (e: Event) => {
      const file = (e as CustomEvent<File>).detail;
      acceptFile(file);
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("ascii:source", onOpen);
    return () => window.removeEventListener("ascii:source", onOpen);
  }, [acceptFile]);

  // paste from clipboard
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) {
        acceptFile(file);
        document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [acceptFile]);

  const set = <K extends keyof Controls>(key: K, value: Controls[K]) =>
    setControls((c) => ({ ...c, [key]: value }));

  const exportPng = () => {
    if (!grid) return;
    gridToCanvas(grid, 12, 2).toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sourceName.replace(/\.[^.]+$/, "")}-ascii.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PNG saved.");
    }, "image/png");
  };

  const copyText = async () => {
    if (!grid) return;
    await navigator.clipboard.writeText(gridToText(grid));
    toast.success("Copied as plain text.");
  };

  return (
    <section id="demo" aria-label="Try the converter" className="px-4 py-28 md:px-5 md:py-36">
      <div ref={sectionRef} className="reveal mx-auto max-w-[1100px]">
        <h2 className="text-[clamp(24px,2.4vw,32px)] font-extrabold tracking-[-0.03em]">
          Try it on yours
        </h2>
        <p className="mt-2">
          Drop an image below, or paste one. It never leaves your browser.
        </p>

        <div className="mt-8 grid overflow-hidden rounded-lg md:grid-cols-[62fr_38fr]" data-ui>
          {/* render area */}
          <div
            className="relative flex min-h-[320px] flex-col items-center justify-center bg-[var(--color-artbg)] p-5 transition-colors data-[dragging=true]:bg-[var(--color-panel-hover)]"
            data-dragging={dragging}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              acceptFile(e.dataTransfer.files?.[0]);
            }}
          >
            <div className="drop-scale flex w-full flex-col items-center">
              {grid ? (
                <div key={sourceTick} className="convert-in w-full">
                  <AsciiCanvas grid={grid} fontSize={10} ariaLabel={`ASCII rendering of ${sourceName}`} />
                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-[var(--color-on-panel-muted)]">
                    <span>{sourceName}</span>
                    <span className="tabular-nums">
                      {grid.cols} × {grid.rows} characters
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[var(--step-lead)] font-semibold text-[var(--color-on-panel)]">
                    {error ?? "Drop an image here"}
                  </p>
                  <p className="mt-2 text-[15px] text-[var(--color-on-panel-muted)]">or paste from your clipboard</p>
                </div>
              )}
              <Button
                icon={ImagePlus}
                onClick={() => fileInput.current?.click()}
                className="mt-5"
              >
                Browse files
              </Button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </div>

          {/* controls */}
          <div className="flex flex-col bg-[var(--color-panel)] p-5 text-[var(--color-on-panel)]">
            <ControlRow label="Resolution" value={`${controls.cols} cols`}>
              <input
                type="range"
                min={24}
                max={200}
                step={4}
                value={controls.cols}
                onChange={(e) => set("cols", Number(e.target.value))}
                className="w-full"
                aria-label="Resolution in character columns"
              />
            </ControlRow>
            <ControlRow label="Contrast" value={controls.contrast.toFixed(2)}>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={controls.contrast}
                onChange={(e) => set("contrast", Number(e.target.value))}
                className="w-full"
                aria-label="Contrast"
              />
            </ControlRow>
            <ControlRow label="Brightness" value={controls.brightness.toFixed(2)}>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={controls.brightness}
                onChange={(e) => set("brightness", Number(e.target.value))}
                className="w-full"
                aria-label="Brightness"
              />
            </ControlRow>

            <ControlRow label="Charset">
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CHARSETS) as CharsetKey[]).map((key) => (
                  <Chip
                    key={key}
                    pressed={controls.charset === key}
                    onClick={() => set("charset", key)}
                  >
                    {CHARSET_LABELS[key]}
                  </Chip>
                ))}
              </div>
            </ControlRow>

            <ControlRow label="Color">
              <div className="flex gap-1.5">
                {(["color", "paper", "phosphor"] as ColorMode[]).map((m) => (
                  <Chip
                    key={m}
                    pressed={controls.mode === m}
                    onClick={() => set("mode", m)}
                    className="flex-1 capitalize"
                  >
                    {m}
                  </Chip>
                ))}
              </div>
            </ControlRow>

            <ControlRow label="Invert">
              <button
                type="button"
                role="switch"
                aria-checked={controls.invert}
                onClick={() => set("invert", !controls.invert)}
                className={`relative h-7 w-12 rounded-full transition-colors duration-150 ${
                  controls.invert ? "bg-[var(--color-accent)]" : "bg-[var(--color-panel-2)]"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform duration-150 ${
                    controls.invert ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </ControlRow>

            <div className="mt-auto flex gap-2 pt-6">
              <Button
                variant="onPanel"
                icon={Download}
                onClick={exportPng}
                disabled={!grid}
                className="flex-1"
              >
                Save PNG
              </Button>
              <Button
                variant="ghost"
                icon={Copy}
                onClick={copyText}
                disabled={!grid}
                className="flex-1"
              >
                Copy text
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[15px] text-[var(--color-muted)]">
          Tip: the Resolution slider re-renders live. Watch the image dissolve into type.
        </p>
      </div>
    </section>
  );
}

function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-none py-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">{label}</span>
        {value && <span className="text-[13px] tabular-nums text-[var(--color-on-panel-muted)]">{value}</span>}
      </div>
      {children}
    </div>
  );
}
