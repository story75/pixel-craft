import { Mat4 } from './mat4';

/**
 * A point in 4D space
 */
export type Point4 = {
  x: number;
  y: number;
  z: number;
  w: number;
};

/**
 * A vector in 4D space
 */
export class Vector4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor({ x, y, z, w }: Point4 | Vector4) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Multiply a matrix and a vector in the form of Mat4 * Vec4.
   */
  multiply(m: Mat4): Vector4 {
    return new Vector4({
      x: m[0] * this.x + m[1] * this.y + m[2] * this.z + m[3] * this.w,
      y: m[4] * this.x + m[5] * this.y + m[6] * this.z + m[7] * this.w,
      z: m[8] * this.x + m[9] * this.y + m[10] * this.z + m[11] * this.w,
      w: m[12] * this.x + m[13] * this.y + m[14] * this.z + m[15] * this.w,
    });
  }
}
