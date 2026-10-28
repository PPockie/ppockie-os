import { gaussianFalloff, lerp } from "../core/falloff";
import { createPointerTracker, type PointerAt } from "../core/pointer";
import { createProximity, type Axis } from "../core/proximity";
import { createQuickTo } from "../core/quick-to";
import { createDisposer } from "../core/disposer";
import type { Effect } from "../core/types";

export type MagnifyOptions = {
  /** Direction the items are stacked. A vertical nav rail wants "y". */
  axis?: Axis;
  /** Which descendants to drive. Defaults to the container's own children. */
  selector?: string;
  /** Scale of the item directly under the pointer. */
  scale?: number;
  /** How far the bulge spreads, in px from the pointer. */
  radius?: number;
  /**
   * Px to slide items perpendicular to `axis` at full strength — the macOS
   * dock's outward nudge. Sign picks the direction; 0 disables it.
   */
  lift?: number;
  duration?: number;
  ease?: string;
};

/**
 * Proximity-driven scaling: items swell as the pointer nears and settle back
 * as it leaves. Same measuring core as the per-letter stretch, just reading a
 * continuous falloff instead of discrete rungs.
 */
export const magnify: Effect<MagnifyOptions | void> = (container, options) => {
  const {
    axis = "y",
    selector,
    scale: peak = 1.4,
    radius = 120,
    lift = 0,
    duration,
    ease,
  } = options ?? {};

  const items = Array.from(
    selector
      ? container.querySelectorAll<HTMLElement>(selector)
      : (container.children as HTMLCollectionOf<HTMLElement>)
  );
  const disposer = createDisposer();

  if (!items.length) return disposer.dispose;

  const proximity = createProximity(container, items, { axis });
  const crossAxis = axis === "x" ? "y" : "x";
  /**
   * scaleX/scaleY rather than the `scale` shorthand: gsap expands `scale` into
   * the two of them under a single transform PropTween, so quickTo's resetTo
   * can never find a tween named "scale" and re-inits the whole tween every
   * frame instead of writing a number.
   */
  const quick = createQuickTo(items, ["scaleX", "scaleY", crossAxis] as const, {
    duration,
    ease,
  });
  disposer.add(quick.kill);

  const render = (at: PointerAt) => {
    items.forEach((_, i) => {
      const strength =
        at === null ? 0 : gaussianFalloff(proximity.distance(i, at), radius);

      const scale = lerp(1, peak, strength);
      const values: Partial<Record<"scaleX" | "scaleY" | Axis, number>> = {
        scaleX: scale,
        scaleY: scale,
      };
      values[crossAxis] = lift * strength;

      quick.to(i, values);
    });
  };

  const pointer = createPointerTracker(container, {
    onEnter: proximity.measure,
    onChange: (at) => {
      if (!proximity.ready()) proximity.measure();
      render(at);
    },
  });
  disposer.add(pointer.dispose);

  return disposer.dispose;
};
