import { describe, expect, it } from 'bun:test';
import { Vector4 } from './vector4';

describe('Vector4', () => {
  it('should create a new vector', () => {
    const v = new Vector4({ x: 1, y: 2, z: 3, w: 4 });
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
    expect(v.w).toBe(4);
  });

  it('should multiply a vector by a matrix', () => {
    const v = new Vector4({ x: 1, y: 2, z: 3, w: 4 });
    const m = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const result = v.multiply(m);
    expect(result.x).toBe(30);
    expect(result.y).toBe(70);
    expect(result.z).toBe(110);
    expect(result.w).toBe(150);
  });
});
