"use client";

import { useRef, useState } from "react";

/** How much of the window must stay on screen so it can always be grabbed back. */
const GRAB = 96;
const BAR = 44;
const CASCADE = 28;

interface Options {
  width: number;
  height: number;
  /** Position in the open stack; used to cascade new windows. */
  index: number;
}

/** Position and title-bar handlers for a window that is dragged by its bar. */
export const useDraggableWindow = ({ width, height, index }: Options) => {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const [pos, setPos] = useState(() => ({
    x: Math.max(0, (window.innerWidth - width) / 2 + index * CASCADE),
    y: Math.max(0, (window.innerHeight - height) / 2 + index * CASCADE),
  }));

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const current = ref.current?.offsetWidth ?? width;
    setPos({
      x: Math.min(
        window.innerWidth - GRAB,
        Math.max(GRAB - current, e.clientX - drag.current.dx)
      ),
      y: Math.min(
        window.innerHeight - BAR,
        Math.max(0, e.clientY - drag.current.dy)
      ),
    });
  };

  const endDrag = () => {
    drag.current = null;
  };

  return {
    ref,
    pos,
    barProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
};
