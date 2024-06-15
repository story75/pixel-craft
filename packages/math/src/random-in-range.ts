/**
 * Returns a random integer in the range [min, max].
 *
 * @remarks
 * This function is inclusive of the minimum and maximum values.
 *
 * @param rng - A function that returns a random number in the range [0, 1].
 * @param min - The minimum value.
 * @param max - The maximum value.
 */
export function randomInRange(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min)) + min;
}
