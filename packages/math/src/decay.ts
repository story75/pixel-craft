/**
 * Exponential decay function.
 *
 * @remarks
 * This is a lerp variant which accounts for delta time.
 *
 * @see https://www.youtube.com/watch?v=LSNQuFEDOyQ - Talk by Freya Holmér
 * @see https://www.youtube.com/watch?v=YJB1QnEmlTs - "An In-Depth look at Lerp, Smoothstep, and Shaping Functions" by SimonDev
 */
export function decay(a: number, b: number, decay: number, deltaTime: number): number {
  return b + (a - b) * Math.exp(-decay * deltaTime);
}
