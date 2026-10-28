import gsap from "gsap";

export const DEFAULT_DURATION = 0.5;
export const DEFAULT_EASE = "power2.out";

type QuickToOptions = {
  duration?: number;
  ease?: string;
  /**
   * Runs on every frame of the *first* prop only. Attaching it to each prop
   * would fire the same work N times per frame for no extra information.
   */
  onUpdate?: (index: number) => void;
};

export type QuickTo<P extends string> = {
  /** Animate one target. Props left out of `values` are not touched. */
  to: (index: number, values: Partial<Record<P, number>>) => void;
  /** Same values for every target. */
  toAll: (values: Partial<Record<P, number>>) => void;
  kill: () => void;
};

/**
 * A batch of gsap.quickTo setters — one per target per prop. quickTo reuses a
 * single tween instead of allocating one per call, which is what makes
 * per-frame pointer updates cheap.
 */
export const createQuickTo = <P extends string>(
  targets: HTMLElement[],
  props: readonly P[],
  { duration = DEFAULT_DURATION, ease = DEFAULT_EASE, onUpdate }: QuickToOptions = {}
): QuickTo<P> => {
  const setters = {} as Record<P, ((value: number) => void)[]>;

  props.forEach((prop, propIndex) => {
    setters[prop] = targets.map((target, i) =>
      gsap.quickTo(target, prop, {
        duration,
        ease,
        onUpdate: onUpdate && propIndex === 0 ? () => onUpdate(i) : undefined,
      })
    );
  });

  const to: QuickTo<P>["to"] = (index, values) => {
    (Object.keys(values) as P[]).forEach((prop) => {
      const value = values[prop];
      if (value !== undefined) setters[prop]?.[index]?.(value);
    });
  };

  return {
    to,
    toAll: (values) => targets.forEach((_, i) => to(i, values)),
    kill: () => gsap.killTweensOf(targets),
  };
};

export type QuickSet<P extends string> = {
  set: (index: number, values: Partial<Record<P, number>>) => void;
};

/**
 * Like {@link createQuickTo} but writes immediately instead of tweening.
 *
 * Use this when something else already owns the timing — a sweep, a scroll
 * position, a physics step. Tweening a value that is recomputed every frame
 * only makes it lag a frame behind its own driver.
 */
export const createQuickSet = <P extends string>(
  targets: HTMLElement[],
  props: readonly P[],
  units: Partial<Record<P, string>> = {}
): QuickSet<P> => {
  const setters = {} as Record<P, ((value: number) => void)[]>;

  props.forEach((prop) => {
    setters[prop] = targets.map(
      (target) => gsap.quickSetter(target, prop, units[prop]) as (v: number) => void
    );
  });

  return {
    set: (index, values) => {
      (Object.keys(values) as P[]).forEach((prop) => {
        const value = values[prop];
        if (value !== undefined) setters[prop]?.[index]?.(value);
      });
    },
  };
};
