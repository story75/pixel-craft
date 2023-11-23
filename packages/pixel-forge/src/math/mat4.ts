import {cross, dot, normalize, subtract, Vec3} from "./vec3";

export type Mat4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
] | Float32Array;

export function orthographic(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Mat4 {
    return [
        2 / (x1 - x0), 0, 0, 0,
        0, 2 / (y1 - y0), 0, 0,
        0, 0, -2 / (z1 - z0), 0,
        -(x1 + x0) / (x1 - x0), -(y1 + y0) / (y1 - y0), -(z1 + z0) / (z1 - z0), 1
    ];
}

export function lookAt(camera: Readonly<Vec3>, object: Readonly<Vec3>, up: Readonly<Vec3>): Mat4 {
    const distance = subtract(object, camera);

    const rightVector = normalize(cross(up, distance));
    const upVector = normalize(cross(distance, rightVector));
    const forwardVector = normalize(distance);

    const translation = [
        dot(camera, rightVector), dot(camera, upVector), dot(camera, forwardVector),
    ];

    return [
        rightVector[0], rightVector[1], rightVector[2], translation[0],
        upVector[0], upVector[1], upVector[2], translation[1],
        forwardVector[0], forwardVector[1], forwardVector[2], translation[2],
        0, 0, 0, 1,
    ];
}

export function multiply(a: Readonly<Mat4>, b: Readonly<Mat4>): Mat4 {
    const [a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33] = a;
    const [b00, b01, b02, b03,
        b10, b11, b12, b13,
        b20, b21, b22, b23,
        b30, b31, b32, b33] = b;

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