/**
 * Simple linear easing function
 *
 * @remarks
 * This function returns the same value as the input, because no easing is applied.
 *
 * The value of t should be between 0 and 1.
 */
export function easeLinear(t: number): number {
  return t;
}

/**
 * Quadratic easing function that accelerates and decelerates
 *
 * @remarks
 * This function returns the value of t squared if t is below 0.5, and 1 minus the value of (1 - t) squared if t is above 0.5.
 *
 * The value of t should be between 0 and 1.
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
