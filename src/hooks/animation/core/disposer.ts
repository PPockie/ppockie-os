/**
 * Collects teardown callbacks so an effect can return a single cleanup.
 * Disposing twice is a no-op, and `disposed` lets async work bail out after
 * the element is gone (font loading, rAF callbacks, and so on).
 */
export type Disposer = {
  add: (teardown: () => void) => void;
  dispose: () => void;
  readonly disposed: boolean;
};

export const createDisposer = (): Disposer => {
  const teardowns: (() => void)[] = [];
  let disposed = false;

  return {
    add: (teardown) => {
      if (disposed) return teardown();
      teardowns.push(teardown);
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      while (teardowns.length) teardowns.pop()?.();
    },
    get disposed() {
      return disposed;
    },
  };
};

/** addEventListener that hands back its own remover. */
export const listen = <K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
) => {
  target.addEventListener(type, handler as EventListener, options);
  return () => target.removeEventListener(type, handler as EventListener, options);
};
