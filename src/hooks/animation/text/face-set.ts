import gsap from "gsap";

/**
 * A face is one rung of a text effect: the family to swap in, how close the
 * focus has to be to reach it, and how far the glyph stretches at that rung.
 *
 * Rung 0 is the resting state, so its reach is Infinity — it always matches.
 * `reach` only means something to proximity-driven effects; effects that pick
 * a rung some other way (ring depth, scroll position) ignore it.
 */
export type Face = { family: string; reach: number; scale: number };

export const FACE_SETS = {
  title: [
    { family: "var(--font-grapixoso-condensada)", reach: Infinity, scale: 1 },
    { family: "var(--font-grapixoso)", reach: 2, scale: 1.08 },
    { family: "var(--font-righteous)", reach: 1, scale: 1.18 },
  ],
} as const satisfies Record<string, readonly Face[]>;

export type FaceSetName = keyof typeof FACE_SETS;

export const facesOf = (name: FaceSetName = "title"): readonly Face[] =>
  FACE_SETS[name];

export type FaceSwitcher = {
  /** Swap an item to a rung. Skips the DOM write when nothing changed. */
  apply: (index: number, level: number) => void;
  /**
   * Picks the rung from the element's *animated* scaleX rather than from a
   * target level, so the glyph changes shape partway through a tween instead
   * of snapping the moment the target moves.
   */
  syncFromScale: (index: number) => void;
  /** Forget what is applied — call after something else rewrote the styles. */
  reset: () => void;
  families: string[];
  reaches: number[];
  scales: number[];
};

export const createFaceSwitcher = (
  items: HTMLElement[],
  faces: readonly Face[]
): FaceSwitcher => {
  const applied = new Array<number>(items.length).fill(0);
  const scales = faces.map((face) => face.scale);

  const apply = (index: number, level: number) => {
    if (applied[index] === level || !items[index]) return;
    applied[index] = level;
    items[index].style.fontFamily = faces[level].family;
  };

  const syncFromScale = (index: number) => {
    const scale = gsap.getProperty(items[index], "scaleX") as number;

    for (let level = scales.length - 1; level > 0; level--) {
      if (scale >= (scales[level] + scales[level - 1]) / 2) {
        return apply(index, level);
      }
    }
    apply(index, 0);
  };

  return {
    apply,
    syncFromScale,
    reset: () => applied.fill(0),
    families: faces.map((face) => face.family),
    reaches: faces.map((face) => face.reach),
    scales,
  };
};
