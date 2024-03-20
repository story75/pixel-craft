import { describe, expect, it } from 'bun:test';
import { Mat4, lookAt, multiply, orthographic, translate } from './mat4';
import { Vec3 } from './vec3';

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
    expect(lookAt([0, 0, 1], [0, 0, -1], [0, 1, 0])).toEqual([
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
    const vector: Vec3 = [1, 2, 3];

    // prettier-ignore
    expect(translate(matrix, vector)).toEqual([
      5, 10, 15, 4,
      13, 22, 31, 8,
      5, 10, 15, 4,
      13, 22, 31, 8,
    ]);
  });
});
