export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Eases both ends of a 0..1 ramp so it starts and stops without a corner. */
export const smoothstep = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

/** Buckets a 0..1 progress into `levels` evenly sized rungs. */
export const levelByProgress = (t: number, levels: number) =>
  Math.min(levels - 1, Math.floor(clamp01(t) * levels));

/**
 * Discrete falloff: picks the highest level whose reach still covers
 * `distance`. `reaches` is indexed by level and runs widest-to-tightest, so
 * level 0 is normally Infinity (the resting state that always matches).
 */
export const stepFalloff = (distance: number, reaches: readonly number[]) => {
  const gap = Math.abs(distance);
  for (let level = reaches.length - 1; level > 0; level--) {
    if (gap <= reaches[level]) return level;
  }
  return 0;
};

/** Continuous falloff: 1 at the center, easing to 0 at `radius`. */
export const linearFalloff = (distance: number, radius: number) =>
  radius <= 0 ? 0 : clamp01(1 - Math.abs(distance) / radius);

/**
 * Continuous falloff with a soft shoulder — the dock-magnification look,
 * where neighbours lift gently instead of dropping off in a straight line.
 */
export const gaussianFalloff = (distance: number, radius: number) => {
  if (radius <= 0) return 0;
  const t = Math.abs(distance) / radius;
  return t >= 1 ? 0 : Math.exp(-(t * t) * 3);
};
