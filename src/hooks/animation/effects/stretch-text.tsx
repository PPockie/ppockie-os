import { createDisposer } from "../core/disposer";
import { stepFalloff } from "../core/falloff";
import { createPointerTracker, type PointerAt } from "../core/pointer";
import { createProximity } from "../core/proximity";
import { createQuickTo } from "../core/quick-to";
import { createSweep } from "../core/sweep";
import type { Effect } from "../core/types";
import {
  createFaceSwitcher,
  FACE_SETS,
  facesOf,
  type FaceSetName,
} from "../text/face-set";
import { lockWidthsAcrossFonts } from "../text/lock-widths";
import SplitText from "../text/split-text";

const LINE_HEIGHT = 1.5;
const LETTER_GAP = 24;

/** Seconds the idle wave spends crossing one letter. */
const SWEEP_STEP = 0.2;
/** Seconds to wait at the end of a sweep before starting the next one. */
const SWEEP_DELAY = 5;

export type StretchTextOptions = { faces?: FaceSetName };

export const stretchText: Effect<StretchTextOptions | void> = (
  container,
  options
) => {
  const faces = facesOf(options?.faces);
  const letters = Array.from(container.querySelectorAll<HTMLElement>("span"));
  const disposer = createDisposer();

  if (!letters.length) return disposer.dispose;

  const face = createFaceSwitcher(letters, faces);
  const proximity = createProximity(container, letters, {
    axis: "x",
    reachPadding: LETTER_GAP / 2,
  });

  /** Index the idle wave is currently over. Off-screen until it starts. */
  let wave = -Infinity;
  /** Index the pointer is over, or null while it is away. */
  let focus: number | null = null;

  const scale = createQuickTo(letters, ["scaleX", "scaleY"] as const, {
    onUpdate: face.syncFromScale,
  });
  disposer.add(scale.kill);

  const render = () => {
    letters.forEach((_, i) => {
      const fromWave = stepFalloff(i - wave, face.reaches);
      const fromFocus = focus === null ? 0 : stepFalloff(i - focus, face.reaches);
      const level = Math.max(fromWave, fromFocus);

      scale.to(i, { scaleX: face.scales[level], scaleY: face.scales[level] });
    });
  };

  const widest = Math.max(...face.reaches.filter(Number.isFinite));
  const sweep = createSweep({
    from: -1 - widest,
    to: letters.length + widest,
    step: SWEEP_STEP,
    delay: SWEEP_DELAY,
    onTick: (at) => {
      wave = at;
      render();
    },
  });
  wave = sweep.read();
  disposer.add(sweep.kill);

  const onPointer = (at: PointerAt) => {
    if (!proximity.ready()) proximity.measure();
    focus = proximity.nearest(at);
    render();
  };

  const pointer = createPointerTracker(container, {
    onEnter: proximity.measure,
    onChange: onPointer,
  });
  disposer.add(pointer.dispose);

  lockWidthsAcrossFonts(letters, face.families, () => disposer.disposed).then(
    () => {
      if (disposer.disposed) return;
      face.reset();
      proximity.measure();
    }
  );

  return disposer.dispose;
};

type StretchTextsProps = { text: string; className?: string };

/**
 * Markup counterpart to {@link stretchText} — the effect measures these spans,
 * so the gap and resting family have to be declared in the same place.
 */
export const StretchTexts = ({ text, className }: StretchTextsProps) => (
  <SplitText
    text={text}
    className={className}
    gap={LETTER_GAP}
    style={{ fontFamily: FACE_SETS.title[0].family, lineHeight: LINE_HEIGHT }}
  />
);
