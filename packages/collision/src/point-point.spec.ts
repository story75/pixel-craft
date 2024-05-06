import { describe, expect, it } from 'bun:test';
import { pointPoint } from './point-point';

describe('Point-Point', () => {
  it('should collide', () => {
    expect(pointPoint({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(true);
  });

  it('should not collide', () => {
    expect(pointPoint({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(false);
  });
});
