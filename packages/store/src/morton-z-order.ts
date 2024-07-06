const SHIFTS = [1, 2, 4, 8];

const MAGIC_BITS = [0x55555555, 0x33333333, 0x0f0f0f0f, 0x00ff00ff];

/**
 * @see https://en.wikipedia.org/wiki/Z-order_curve
 * @see http://graphics.stanford.edu/~seander/bithacks.html#InterleaveBMN
 *
 * @remarks
 * This is about twice as fast as `${x}:${y}`.
 */
export function mortonZOrder(inputX: number, inputY: number): number {
  let x = inputX;
  let y = inputY;
  x = (x | (x << SHIFTS[3])) & MAGIC_BITS[3];
  x = (x | (x << SHIFTS[2])) & MAGIC_BITS[2];
  x = (x | (x << SHIFTS[1])) & MAGIC_BITS[1];
  x = (x | (x << SHIFTS[0])) & MAGIC_BITS[0];

  y = (y | (y << SHIFTS[3])) & MAGIC_BITS[3];
  y = (y | (y << SHIFTS[2])) & MAGIC_BITS[2];
  y = (y | (y << SHIFTS[1])) & MAGIC_BITS[1];
  y = (y | (y << SHIFTS[0])) & MAGIC_BITS[0];

  return x | (y << 1);
}
