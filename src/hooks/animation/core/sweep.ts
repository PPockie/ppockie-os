import gsap from "gsap";

type SweepOptions = {
  from: number;
  to: number;
  /** Seconds spent per unit travelled — duration is derived from the span. */
  step: number;
  /** Seconds to wait at the end of a pass before the next one starts. */
  delay?: number;
  /** -1 loops forever (the default); 0 runs a single pass. */
  repeat?: number;
  ease?: string;
  onTick: (at: number) => void;
};

export type Sweep = {
  /** Where the sweep currently sits. Starts at `from`. */
  read: () => number;
  pause: () => void;
  play: () => void;
  kill: () => void;
};

/**
 * Drives a single number from `from` to `to` on a loop. Nothing here knows
 * what the number means — it can be a letter index for an idle wave or an
 * x-offset in px for a marquee.
 */
export const createSweep = ({
  from,
  to,
  step,
  delay = 0,
  repeat = -1,
  ease = "none",
  onTick,
}: SweepOptions): Sweep => {
  const at = { value: from };

  const tween = gsap.to(at, {
    value: to,
    duration: Math.abs(to - from) * step,
    ease,
    repeat,
    repeatDelay: delay,
    onUpdate: () => onTick(at.value),
  });

  return {
    read: () => at.value,
    pause: () => void tween.pause(),
    play: () => void tween.play(),
    kill: () => void tween.kill(),
  };
};
