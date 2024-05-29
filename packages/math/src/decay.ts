/**
 * Exponential decay function.
 *
 * @remarks
 * This isa lerp variant which accounts for delta time.
 *
 * @see https://www.youtube.com/watch?v=LSNQuFEDOyQ - Talk by Freya Holmér
 */
export function decay(
  a: number,
  b: number,
  decay: number,
  deltaTime: number,
): number {
  return b + (a - b) * Math.exp(-decay * deltaTime);
}
