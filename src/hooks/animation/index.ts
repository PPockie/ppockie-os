export { useAnimation } from "./use-animation";

export type { Effect } from "./core/types";
export type { Axis } from "./core/proximity";
export type { PointerAt } from "./core/pointer";

export { createDisposer, listen } from "./core/disposer";
export { createPointerTracker } from "./core/pointer";
export { createProximity } from "./core/proximity";
export {
  createQuickTo,
  createQuickSet,
  DEFAULT_DURATION,
  DEFAULT_EASE,
} from "./core/quick-to";
export { createSweep } from "./core/sweep";
export {
  clamp01,
  lerp,
  smoothstep,
  levelByProgress,
  stepFalloff,
  linearFalloff,
  gaussianFalloff,
} from "./core/falloff";

export { default as SplitText } from "./text/split-text";
export { lockWidthsAcrossFonts } from "./text/lock-widths";
export { createFaceSwitcher, facesOf, FACE_SETS } from "./text/face-set";
export type { Face, FaceSetName, FaceSwitcher } from "./text/face-set";

export { stretchText, StretchTexts } from "./effects/stretch-text";
export type { StretchTextOptions } from "./effects/stretch-text";
export { magnify } from "./effects/magnify";
export type { MagnifyOptions } from "./effects/magnify";
// export { ringMarquee, RingMarqueeText } from "./effects/ring-marquee";
export { ringMarquee, RingMarqueeText, RingPath } from "./effects/ring-marquee";
export type { RingMarqueeOptions, RingGeometry } from "./effects/ring-marquee";
