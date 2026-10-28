import type { CSSProperties, ReactNode } from "react";

export type SplitBy = "char" | "word";

type SplitTextProps = {
  text: string;
  /** "char" gives one span per letter; "word" keeps words whole. */
  by?: SplitBy;
  className?: string;
  /** Merged into every piece — use it for per-effect styling. */
  style?: CSSProperties;
  /** Horizontal breathing room per piece, in px. Split evenly on both sides. */
  gap?: number;
};

const NBSP = " ";

const split = (text: string, by: SplitBy) =>
  by === "word" ? text.split(/(\s+)/).filter(Boolean) : [...text];

/**
 * Renders text as individually addressable spans so an effect can drive each
 * piece on its own. Effects find them with `container.querySelectorAll("span")`.
 *
 * Whitespace becomes a non-breaking space: a plain space in an inline-block
 * span collapses, which would knock the measured letter positions out of sync.
 */
const SplitText = ({
  text,
  by = "char",
  className,
  style,
  gap = 0,
}: SplitTextProps): ReactNode => (
  <>
    {split(text, by).map((piece, i) => (
      <span
        key={i}
        className={className}
        style={{
          display: "inline-block",
          textAlign: "center",
          verticalAlign: "top",
          marginInline: gap / 2,
          ...style,
        }}
      >
        {piece.trim() === "" ? NBSP : piece}
      </span>
    ))}
  </>
);

export default SplitText;
