import type { PointerAt } from "./pointer";

export type Axis = "x" | "y";

type ProximityOptions = {
  /** Which way the items are laid out. A vertical nav rail wants "y". */
  axis?: Axis;
  /** Extra px added to an item's half-size when deciding if it is "hit". */
  reachPadding?: number;
};

export type Proximity = {
  /** Re-read the DOM. Call after layout changes — fonts, resize, reflow. */
  measure: () => void;
  /** Has measure() produced anything yet? */
  ready: () => boolean;
  /** Index of the item under the pointer, or null if the pointer misses. */
  nearest: (at: PointerAt) => number | null;
  /** Signed px from an item's center to the pointer. Infinity when outside. */
  distance: (index: number, at: PointerAt) => number;
};

/**
 * Measures where a set of elements sit inside their container and answers
 * "how close is the pointer to item i". Shared by any proximity-driven
 * effect — per-letter stretching, dock magnification, and so on.
 */
export const createProximity = (
  container: HTMLElement,
  items: HTMLElement[],
  { axis = "x", reachPadding = 0 }: ProximityOptions = {}
): Proximity => {
  let centers: number[] = [];
  let halfSizes: number[] = [];

  const measure = () => {
    const box = container.getBoundingClientRect();
    const origin = axis === "x" ? box.left : box.top;

    const boxes = items.map((item) => item.getBoundingClientRect());
    const start = (b: DOMRect) => (axis === "x" ? b.left : b.top);
    const size = (b: DOMRect) => (axis === "x" ? b.width : b.height);

    centers = boxes.map((b) => start(b) - origin + size(b) / 2);
    halfSizes = boxes.map((b) => size(b) / 2);
  };

  const along = (at: PointerAt) => (at === null ? null : axis === "x" ? at.x : at.y);

  const distance = (index: number, at: PointerAt) => {
    const position = along(at);
    if (position === null || centers[index] === undefined) return Infinity;
    return position - centers[index];
  };

  const nearest = (at: PointerAt) => {
    const position = along(at);
    if (position === null) return null;

    let index = -1;
    let best = Infinity;

    centers.forEach((center, i) => {
      const gap = Math.abs(position - center);
      if (gap < best) {
        best = gap;
        index = i;
      }
    });

    if (index < 0) return null;
    return best <= halfSizes[index] + reachPadding ? index : null;
  };

  return { measure, ready: () => centers.length > 0, nearest, distance };
};
