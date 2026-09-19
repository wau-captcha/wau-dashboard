/** Rounds a step up to 1, 2 or 5 times a power of ten, never below 1 (charts count whole events). */
export function niceStep(raw: number): number {
  if (!(raw > 1)) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  const fraction = raw / power;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * power;
}

/** Ticks from 0 in clean steps, about `intervals` of them, the last one at or above max. */
export function valueTicks(max: number, intervals = 4): number[] {
  const step = niceStep(max / intervals);
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  return ticks;
}

/**
 * Whether band i of count gets an x-axis label, so labels at least labelWidth apart never
 * collide. Counted back from the last band, which is always labelled (it is "today").
 */
export function isLabeledBand(i: number, count: number, bandWidth: number, labelWidth: number): boolean {
  const every = bandWidth > 0 ? Math.max(1, Math.ceil(labelWidth / bandWidth)) : count;
  return (count - 1 - i) % every === 0;
}

/** SVG path of a bar with its top corners rounded and a square base. */
export function roundedTopBar(x: number, top: number, width: number, height: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, width / 2, height));
  const bottom = top + height;
  return (
    `M${x},${bottom}V${top + r}Q${x},${top} ${x + r},${top}` +
    `H${x + width - r}Q${x + width},${top} ${x + width},${top + r}V${bottom}Z`
  );
}
