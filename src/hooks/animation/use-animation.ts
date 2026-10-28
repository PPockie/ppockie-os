"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

import type { Effect } from "./core/types";

/**
 * Runs an effect against a ref once it has an element, and tears it down on
 * unmount. Every effect null-checking its own container was the same four
 * lines repeated, so the check lives here instead.
 *
 * `options` is read on each run — pass a stable object (or a constant) unless
 * you actually want the effect rebuilt.
 */
export const useAnimation = <Options>(
  ref: RefObject<HTMLElement | null>,
  effect: Effect<Options>,
  options: Options,
  deps: unknown[] = []
) => {
  useGSAP(() => {
    const container = ref.current;
    if (!container) return;

    return effect(container, options);
  }, deps);
};
