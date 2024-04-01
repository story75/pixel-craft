export type Vec2 = [number, number] | Float32Array;

/**
 * Normalize a vector.
 *
 * @see https://en.wikipedia.org/wiki/Unit_vector
 *
 * @param v
 */
export function normalize(v: Readonly<Vec2>): Vec2 {
  const [x, y] = v;
  const l = length(v);
  return [x / l, y / l];
}

/**
 * Calculate the length of a vector.
 * @see https://en.wikipedia.org/wiki/Euclidean_vector#Length
 *
 * @param v
 */
export function length(v: Readonly<Vec2>): number {
  const [x, y] = v;
  return Math.sqrt(x * x + y * y);
}

/**
 * Subtract two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
 *
 * @param a
 * @param b
 */
export function subtract(a: Readonly<Vec2>, b: Readonly<Vec2>): Vec2 {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [ax - bx, ay - by];
}

/**
 * Cross two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Cross_product
 *
 * @param a
 * @param b
 */
export function cross(a: Readonly<Vec2>, b: Readonly<Vec2>): Vec2 {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [ay * bx - ax * by, ax * by - ay * bx];
}

/**
 * Dot two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Dot_product
 *
 * @param a
 * @param b
 */
export function dot(a: Readonly<Vec2>, b: Readonly<Vec2>): number {
  const [ax, ay] = a;
  const [bx, by] = b;
  return ax * bx + ay * by;
}

/**
 * Rotate a vector around an origin.
 *
 * @see https://en.wikipedia.org/wiki/Rotation_matrix
 *
 * @param v
 * @param origin
 * @param radians
 */
export function rotate(
  v: Readonly<Vec2>,
  origin: Readonly<Vec2>,
  radians: number,
): Vec2 {
  const x = v[0] - origin[0];
  const y = v[1] - origin[1];
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [origin[0] + x * cos - y * sin, origin[1] + x * sin + y * cos];
}
