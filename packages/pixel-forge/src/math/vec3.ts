export type Vec3 = [number, number, number] | Float32Array;

/**
 * Normalize a vector.
 *
 * @see https://en.wikipedia.org/wiki/Unit_vector
 *
 * @param v
 */
export function normalize(v: Readonly<Vec3>): Vec3 {
  const [x, y, z] = v;
  const l = length(v);
  return [x / l, y / l, z / l];
}

/**
 * Calculate the length of a vector.
 * @see https://en.wikipedia.org/wiki/Euclidean_vector#Length
 *
 * @param v
 */
export function length(v: Readonly<Vec3>): number {
  const [x, y, z] = v;
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Subtract two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
 *
 * @param a
 * @param b
 */
export function subtract(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return [ax - bx, ay - by, az - bz];
}

/**
 * Cross two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Cross_product
 *
 * @param a
 * @param b
 */
export function cross(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

/**
 * Dot two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Dot_product
 *
 * @param a
 * @param b
 */
export function dot(a: Readonly<Vec3>, b: Readonly<Vec3>): number {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return ax * bx + ay * by + az * bz;
}
