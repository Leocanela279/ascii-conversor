/**
 * Character ramps, ordered lightest ink -> heaviest ink.
 * A dark pixel maps to a heavy glyph; a light pixel to a light one.
 */
export const CHARSETS = {
  detailed:
    " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  minimal: " .+#",
  binary: " 01", // taste-skill-ignore — a charset of glyphs, not decorative numbering
} as const;

export type CharsetKey = keyof typeof CHARSETS;

export const CHARSET_LABELS: Record<CharsetKey, string> = {
  detailed: "Detailed · 70",
  standard: "Standard · 10",
  blocks: "Blocks",
  minimal: "Minimal",
  binary: "Binary",
};
