/**
 * Linearly interpolates between two values.
 */
export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}
