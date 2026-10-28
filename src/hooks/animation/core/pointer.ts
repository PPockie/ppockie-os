import { createDisposer, listen, type Disposer } from "./disposer";

/** Pointer position relative to the container's top-left, or null when outside. */
export type PointerAt = { x: number; y: number } | null;

type PointerOptions = {
  /** Fires on enter/move/leave. Leave and enter both pass through here. */
  onChange: (at: PointerAt) => void;
  /** Called on enter, before the first onChange — a hook for re-measuring. */
  onEnter?: () => void;
};

export type PointerTracker = {
  read: () => PointerAt;
  dispose: () => void;
};

/**
 * Tracks the pointer in container-local coordinates. Every hover effect needs
 * the same clientX-minus-boundingRect dance, so it lives here once.
 */
export const createPointerTracker = (
  container: HTMLElement,
  { onChange, onEnter }: PointerOptions
): PointerTracker => {
  const disposer: Disposer = createDisposer();
  let at: PointerAt = null;

  const toLocal = (event: MouseEvent): PointerAt => {
    const { left, top } = container.getBoundingClientRect();
    return { x: event.clientX - left, y: event.clientY - top };
  };

  disposer.add(
    listen(container, "mouseenter", (event) => {
      onEnter?.();
      at = toLocal(event);
      onChange(at);
    })
  );

  disposer.add(
    listen(container, "mousemove", (event) => {
      at = toLocal(event);
      onChange(at);
    })
  );

  disposer.add(
    listen(container, "mouseleave", () => {
      at = null;
      onChange(at);
    })
  );

  return { read: () => at, dispose: disposer.dispose };
};
