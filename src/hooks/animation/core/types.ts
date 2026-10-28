/**
 * Every effect in this folder has the same shape: attach to an element,
 * return the teardown. That is exactly what useGSAP/useEffect want back, and
 * it lets `useAnimation` drive any of them without special cases.
 */
export type Effect<Options = void> = (
  container: HTMLElement,
  options: Options
) => () => void;
