import { Mat4 } from './mat4';

export type Vec4 = [number, number, number, number] | Float32Array;

/**
 * Multiply a matrix and a vector in the form of Mat4 * Vec4.
 */
export function multiply(m: Readonly<Mat4>, v: Readonly<Vec4>): Vec4 {
  const [x, y, z, w] = v;
  return [
    m[0] * x + m[1] * y + m[2] * z + m[3] * w,
    m[4] * x + m[5] * y + m[6] * z + m[7] * w,
    m[8] * x + m[9] * y + m[10] * z + m[11] * w,
    m[12] * x + m[13] * y + m[14] * z + m[15] * w,
  ];
}
