import { cross, dot, normalize, subtract, Vec3 } from './vec3';

// prettier-ignore
export type Mat4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
] | Float32Array;

/**
 * Creates an orthographic projection matrix.
 *
 * @remarks
 * Unlike WebGL, which uses -1 to 1 for the z-axis,
 * WebGPU uses 0 to 1 for the z-axis, thus we also adjust the clip space.
 *
 * @see https://en.wikipedia.org/wiki/Orthographic_projection
 * @see https://gpuweb.github.io/gpuweb/#coordinate-systems
 *
 * @param left
 * @param right
 * @param bottom
 * @param top
 * @param near
 * @param far
 */
export function orthographic(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
): Mat4 {
  // prettier-ignore
  return [
   2 / (right - left), 0, 0, 0,
   0, 2 / (top - bottom), 0, 0,
   0, 0, -2 / (far - near), 0,
   -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
 ];
}

/**
 * Create a look at matrix.
 *
 * @see https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL/
 * @see https://developer.apple.com/forums/thread/711797
 *
 * @param camera
 * @param object
 * @param up
 */
export function lookAt(
  camera: Readonly<Vec3>,
  object: Readonly<Vec3>,
  up: Readonly<Vec3>,
): Mat4 {
  const forwardVector = normalize(subtract(camera, object));
  const rightVector = normalize(cross(up, forwardVector));
  const upVector = cross(forwardVector, rightVector);

  const translation = [
    -dot(rightVector, camera),
    -dot(upVector, camera),
    -dot(forwardVector, camera),
  ];

  // prettier-ignore
  return [
    rightVector[0], upVector[0], forwardVector[0], 0,
    rightVector[1], upVector[1], forwardVector[1], 0,
    rightVector[2], upVector[2], forwardVector[2], 0,
    translation[0], translation[1], translation[2], 1,
  ];
}

/**
 * Multiply two matrices.
 *
 * @see https://en.wikipedia.org/wiki/Matrix_multiplication
 * @see https://www.mathsisfun.com/algebra/matrix-multiplying.html
 *
 * @param a
 * @param b
 */
export function multiply(a: Readonly<Mat4>, b: Readonly<Mat4>): Mat4 {
  // prettier-ignore
  const [a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33] = a;
  // prettier-ignore
  const [b00, b01, b02, b03,
        b10, b11, b12, b13,
        b20, b21, b22, b23,
        b30, b31, b32, b33] = b;

  // prettier-ignore
  return [
        a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
        a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
        a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
        a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,

        a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
        a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
        a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
        a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,

        a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
        a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
        a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
        a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,

        a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
        a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
        a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
        a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33,
    ];
}

/**
 * Translate a matrix.
 */
export function translate(
  matrix: Readonly<Mat4>,
  translation: Readonly<Vec3>,
): Mat4 {
  const [x, y, z] = translation;
  // prettier-ignore
  return multiply(matrix, [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]);
}
