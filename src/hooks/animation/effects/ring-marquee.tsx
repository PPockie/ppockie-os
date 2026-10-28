import gsap from "gsap";

import { createDisposer } from "../core/disposer";
import { clamp01, lerp, levelByProgress, smoothstep } from "../core/falloff";
import { createQuickSet } from "../core/quick-to";
import { createSweep } from "../core/sweep";
import type { Effect } from "../core/types";
import { createFaceSwitcher, facesOf, type FaceSetName } from "../text/face-set";
import { lockWidthsAcrossFonts } from "../text/lock-widths";
import SplitText from "../text/split-text";

const DEG = Math.PI / 180;

/** Steps used to approximate the ellipse's perimeter. Built once per mount. */
const ARC_SAMPLES = 720;

/**
 * The ellipse itself. Split out because the orbiting text and the drawn ring
 * have to agree on it exactly — spread the same object into both so tuning one
 * can never leave the other behind.
 */
export type RingGeometry = {
  /** Half-width of the ellipse in px — how wide the ring reaches. */
  radiusX?: number;
  /** Half-height in px. Much smaller than radiusX is what reads as a tilt. */
  radiusY?: number;
  /** Degrees to rotate the whole ellipse, so the ring can sit on a slant. */
  tilt?: number;
};

const RING_DEFAULTS = {
  radiusX: 380,
  radiusY: 110,
  tilt: 0,
} satisfies Required<RingGeometry>;

export type RingMarqueeOptions = RingGeometry & {
  period?: number;
  direction?: 1 | -1;
  arc?: number;
  frontScale?: number;
  backScale?: number;
  backOpacity?: number;
  faces?: FaceSetName;
  frontZ?: number;
  backZ?: number;
};

export const ringMarquee: Effect<RingMarqueeOptions | void> = (
  container,
  options
) => {
  const {
    radiusX = RING_DEFAULTS.radiusX,
    radiusY = RING_DEFAULTS.radiusY,
    tilt = RING_DEFAULTS.tilt,
    period = 20,
    direction = 1,
    arc = 360,
    frontScale = 1,
    backScale = 0.55,
    backOpacity = 0,
    faces: faceSet,
    frontZ = 40,
    backZ = 10,
  } = options ?? {};

  const letters = Array.from(container.querySelectorAll<HTMLElement>("span"));
  const disposer = createDisposer();

  if (!letters.length) return disposer.dispose;

  const faces = facesOf(faceSet);
  const face = createFaceSwitcher(letters, faces);

  gsap.set(letters, { xPercent: -50, yPercent: -50 });
  disposer.add(() => gsap.killTweensOf(letters));

  const quick = createQuickSet(
    letters,
    ["x", "y", "scale", "opacity"] as const,
    { x: "px", y: "px" }
  );

  const tiltCos = Math.cos(tilt * DEG);
  const tiltSin = Math.sin(tilt * DEG);
  const stacked = new Array<number>(letters.length).fill(NaN);

  /**
   * Where each letter sits on the ring, in degrees. Seeded with an even
   * split so the first frame is sane, then replaced by a width-aware layout
   * once the glyphs have been measured.
   */
  const angles = letters.map((_, i) => (i * arc) / letters.length);

  const arcTable = (() => {
    const cumulative = new Float64Array(ARC_SAMPLES + 1);
    let prevX = radiusX;
    let prevY = 0;

    for (let step = 1; step <= ARC_SAMPLES; step++) {
      const radians = (step / ARC_SAMPLES) * 360 * DEG;
      const x = Math.cos(radians) * radiusX;
      const y = Math.sin(radians) * radiusY;

      cumulative[step] = cumulative[step - 1] + Math.hypot(x - prevX, y - prevY);
      prevX = x;
      prevY = y;
    }
    return cumulative;
  })();

  const perimeter = arcTable[ARC_SAMPLES];

  /** Inverts the table: distance travelled along the ring -> angle, in degrees. */
  const angleAtDistance = (distance: number) => {
    const wrapped = ((distance % perimeter) + perimeter) % perimeter;

    let low = 0;
    let high = ARC_SAMPLES;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (arcTable[mid] < wrapped) low = mid + 1;
      else high = mid;
    }

    const upper = Math.max(1, low);
    const span = arcTable[upper] - arcTable[upper - 1] || 1;
    const within = (wrapped - arcTable[upper - 1]) / span;

    return ((upper - 1 + within) / ARC_SAMPLES) * 360;
  };

  /**
   * Gives every pair of letters the *same* gap, then walks the perimeter
   * letter by letter.
   *
   * Scaling each letter's slot in proportion to its width instead would hand a
   * wide "W" a wide gap and a narrow "I" almost none, which is what makes the
   * text look bunched in places and holed in others.
   *
   * The whole leftover space is divided evenly, so the advances add up to the
   * span exactly and the ring closes on itself with no seam. The trade is that
   * the gap is a budget, not a setting: it is whatever the ring has left over
   * after the glyphs, and it goes negative once the text outgrows the ring.
   */
  const layout = () => {
    // offsetWidth is the untransformed layout width. getBoundingClientRect
    // would report the scaled box and feed this frame's scale back into the
    // next frame's spacing.
    const widths = letters.map((letter) => letter.offsetWidth);
    const inked = widths.reduce((sum, width) => sum + width, 0);
    if (!inked) return;

    const span = perimeter * (arc / 360);
    const gap = (span - inked) / letters.length;
    let run = 0;

    widths.forEach((width, i) => {
      angles[i] = angleAtDistance(run + width / 2);
      run += width + gap;
    });
  };

  const render = (rotation: number) => {
    letters.forEach((letter, i) => {
      const radians = (angles[i] + rotation * direction) * DEG;

      // Screen y points down, so a rising angle sweeps right -> bottom -> left
      // and the text would run backwards across the front of the ring, where
      // it is most readable. Mirroring the horizontal component turns the
      // sweep around so the letters land in reading order.
      const flat = -Math.cos(radians) * radiusX;
      const rise = Math.sin(radians) * radiusY;

      const depth = smoothstep((Math.sin(radians) + 1) / 2);

      quick.set(i, {
        x: flat * tiltCos - rise * tiltSin,
        y: flat * tiltSin + rise * tiltCos,
        scale: lerp(backScale, frontScale, depth),
        opacity: clamp01(lerp(backOpacity, 1, depth)),
      });

      face.apply(i, levelByProgress(depth, faces.length));

      const z = depth >= 0.5 ? frontZ : backZ;
      if (stacked[i] !== z) {
        stacked[i] = z;
        letter.style.zIndex = `${z}`;
      }
    });
  };

  const sweep = createSweep({
    from: 0,
    to: 360,
    step: period / 360,
    onTick: render,
  });
  disposer.add(sweep.kill);

  render(0);

  // Widths have to be locked before the layout is measured: the letters swap
  // families as they come forward, and spacing built from one face would drift
  // the moment another one loaded.
  lockWidthsAcrossFonts(letters, face.families, () => disposer.disposed).then(
    () => {
      if (disposer.disposed) return;
      face.reset();
      layout();
      render(sweep.read());
    }
  );

  return disposer.dispose;
};

type RingPathProps = RingGeometry & {

  half: "front" | "back";

  thickness?: number;
  edge?: number;
  edgeClassName?: string;
  className?: string;
};

/**
 * Draws the path the letters travel. Sits on the same zero-size anchor as
 * {@link RingMarqueeText}, so pass it the same geometry.
 */
export const RingPath = ({
  radiusX = RING_DEFAULTS.radiusX,
  radiusY = RING_DEFAULTS.radiusY,
  tilt = RING_DEFAULTS.tilt,
  half,
  thickness = 2,
  edge = 0,
  edgeClassName,
  className,
}: RingPathProps) => {

  const reach = Math.max(radiusX, radiusY) + thickness;
  const size = reach * 2;

  const sweep = half === "front" ? 0 : 1;
  const arc = `M ${-radiusX} 0 A ${radiusX} ${radiusY} 0 0 ${sweep} ${radiusX} 0`;
  const body = Math.max(0, thickness - edge * 2);

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`${-reach} ${-reach} ${size} ${size}`}
      className={className}
      style={{
        position: "absolute",
        left: -reach,
        top: -reach,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <g transform={`rotate(${tilt})`} fill="none" stroke="currentColor">
        {edge > 0 && (
          <path d={arc} strokeWidth={thickness} className={edgeClassName} />
        )}
        <path d={arc} strokeWidth={body} strokeLinecap="butt" />
      </g>
    </svg>
  );
};

type RingMarqueeTextProps = {
  items: string[];
  separator?: string;
  repeat?: number;
  className?: string;
};

export const RingMarqueeText = ({
  items,
  separator = " ✦ ",
  repeat = 1,
  className,
}: RingMarqueeTextProps) => (
  <SplitText
    text={Array.from(
      { length: Math.max(1, repeat) },
      () => items.join(separator) + separator
    ).join("")}
    className={className}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      whiteSpace: "pre",
      willChange: "transform, opacity",
    }}
  />
);
