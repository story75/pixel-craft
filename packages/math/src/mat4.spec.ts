import { describe, expect, it } from 'bun:test';
import { Mat4, lookAt, multiply, orthographic, translate } from './mat4';
import { Vector3 } from './vec3';

describe('orthographic', () => {
  it('should project matrix', () => {
    // prettier-ignore
    expect(orthographic(-1, 1, -1, 1, -1, 1)).toEqual([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, -1, 0,
            -0, -0, -0, 1,
        ]);
  });
});

describe('look at', () => {
  it('should project matrix', () => {
    // prettier-ignore
    expect(lookAt(new Vector3({x: 0, y: 0, z: 1}), new Vector3({x: 0, y: 0, z: -1}), new Vector3({
            x: 0,
            y: 1,
            z: 0
        }))).toEqual([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -0, -0, -1, 1,
        ]);
  });
});

describe('multiply', () => {
  it('should multiply A and B', () => {
    // prettier-ignore
    const a: Mat4 = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            1, 2, 3, 4,
            5, 6, 7, 8
        ];

    // prettier-ignore
    const b: Mat4 = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            4, 5, 6, 0,
            0, 0, 0, 1
        ];

    // prettier-ignore
    expect(multiply(a, b)).toEqual([
            13, 17, 18, 4,
            33, 41, 42, 8,
            13, 17, 18, 4,
            33, 41, 42, 8,
        ]);
  });
});

describe('translate', () => {
  it('should translate matrix by vector', () => {
    // prettier-ignore
    const matrix: Mat4 = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            1, 2, 3, 4,
            5, 6, 7, 8
        ];

    // prettier-ignore
    const vector = new Vector3({x: 1, y: 2, z: 3});

    // prettier-ignore
    expect(translate(matrix, vector)).toEqual([
            5, 10, 15, 4,
            13, 22, 31, 8,
            5, 10, 15, 4,
            13, 22, 31, 8,
        ]);
  });
});
