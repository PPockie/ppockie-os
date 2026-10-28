/**
 * Pins each element to the widest it gets across every font family it might
 * swap to, so switching family mid-animation restyles the glyph without
 * reflowing its neighbours.
 *
 * Waits for `document.fonts.ready` first — measuring against a fallback font
 * produces widths that are wrong the moment the real face lands.
 */
export const lockWidthsAcrossFonts = async (
  items: HTMLElement[],
  families: readonly string[],
  isAborted: () => boolean = () => false
) => {
  await document.fonts?.ready;
  if (isAborted() || !items.length) return;

  const widest = new Array<number>(items.length).fill(0);

  families.forEach((family) => {
    items.forEach((item) => (item.style.fontFamily = family));
    items.forEach((item, i) => {
      widest[i] = Math.max(widest[i], item.getBoundingClientRect().width);
    });
  });

  items.forEach((item, i) => {
    item.style.fontFamily = families[0];
    item.style.width = `${widest[i]}px`;
  });
};
