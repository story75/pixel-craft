import { Vector3, type Vector3Like } from './vector3';

export type Mat4Like =
  | Mat4
  | [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ]
  | Float32Array;

export class Mat4 extends Float32Array {
  /**
   * Creates an orthographic projection matrix.
   *
   * @remarks
   * Unlike WebGL, which uses -1 to 1 for the z-axis,
   * WebGPU uses 0 to 1 for the z-axis, thus we also adjust the clip space.
   *
   * @see https://en.wikipedia.org/wiki/Orthographic_projection
   * @see https://gpuweb.github.io/gpuweb/#coordinate-systems
   */
  static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    // prettier-ignore
    return new Mat4([
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      -2 / (far - near),
      0,
      -(right + left) / (right - left),
      -(top + bottom) / (top - bottom),
      -(far + near) / (far - near),
      1,
    ]);
  }

  /**
   * Create a look at matrix.
   *
   * @see https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL/
   * @see https://developer.apple.com/forums/thread/711797
   */
  static lookAt(camera: Vector3Like, object: Vector3Like, up: Vector3Like): Mat4 {
    const forwardVector = new Vector3(camera).subtract(object).normal();
    const rightVector = new Vector3(up).cross(forwardVector).normal();
    const upVector = forwardVector.cross(rightVector);

    const translation = [-rightVector.dot(camera), -upVector.dot(camera), -forwardVector.dot(camera)] as const;

    // prettier-ignore
    return new Mat4([
      rightVector.x,
      upVector.x,
      forwardVector.x,
      0,
      rightVector.y,
      upVector.y,
      forwardVector.y,
      0,
      rightVector.z,
      upVector.z,
      forwardVector.z,
      0,
      translation[0],
      translation[1],
      translation[2],
      1,
    ]);
  }

  /**
   * Multiply this matrix with another matrix.
   *
   * @see https://en.wikipedia.org/wiki/Matrix_multiplication
   * @see https://www.mathsisfun.com/algebra/matrix-multiplying.html
   */
  multiply(other: Mat4Like): this {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];

    this[0] = a00 * other[0] + a01 * other[4] + a02 * other[8] + a03 * other[12];
    this[1] = a00 * other[1] + a01 * other[5] + a02 * other[9] + a03 * other[13];
    this[2] = a00 * other[2] + a01 * other[6] + a02 * other[10] + a03 * other[14];
    this[3] = a00 * other[3] + a01 * other[7] + a02 * other[11] + a03 * other[15];

    this[4] = a10 * other[0] + a11 * other[4] + a12 * other[8] + a13 * other[12];
    this[5] = a10 * other[1] + a11 * other[5] + a12 * other[9] + a13 * other[13];
    this[6] = a10 * other[2] + a11 * other[6] + a12 * other[10] + a13 * other[14];
    this[7] = a10 * other[3] + a11 * other[7] + a12 * other[11] + a13 * other[15];

    this[8] = a20 * other[0] + a21 * other[4] + a22 * other[8] + a23 * other[12];
    this[9] = a20 * other[1] + a21 * other[5] + a22 * other[9] + a23 * other[13];
    this[10] = a20 * other[2] + a21 * other[6] + a22 * other[10] + a23 * other[14];
    this[11] = a20 * other[3] + a21 * other[7] + a22 * other[11] + a23 * other[15];

    this[12] = a30 * other[0] + a31 * other[4] + a32 * other[8] + a33 * other[12];
    this[13] = a30 * other[1] + a31 * other[5] + a32 * other[9] + a33 * other[13];
    this[14] = a30 * other[2] + a31 * other[6] + a32 * other[10] + a33 * other[14];
    this[15] = a30 * other[3] + a31 * other[7] + a32 * other[11] + a33 * other[15];
    return this;
  }

  translate(translation: Vector3Like): this {
    // prettier-ignore
    return this.multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, translation.x, translation.y, translation.z, 1]);
  }

  /**
   * Scale a matrix.
   */
  scale(scaling: Vector3Like): this {
    this[0] = this[0] * scaling.x;
    this[1] = this[1] * scaling.x;
    this[2] = this[2] * scaling.x;
    this[3] = this[3] * scaling.x;

    this[4] = this[4] * scaling.y;
    this[5] = this[5] * scaling.y;
    this[6] = this[6] * scaling.y;
    this[7] = this[7] * scaling.y;

    this[8] = this[8] * scaling.z;
    this[9] = this[9] * scaling.z;
    this[10] = this[10] * scaling.z;
    this[11] = this[11] * scaling.z;

    return this;
  }
}
