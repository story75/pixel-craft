import { describe, expect, it } from 'bun:test';
import { pointCircle } from './point-circle';

describe('Point-Circle', () => {
  it('should collide', () => {
    expect(pointCircle({ x: 1, y: 0 }, { x: 0, y: 0, radius: 1 })).toBe(true);
  });

  it('should not collide', () => {
    expect(pointCircle({ x: 2, y: 0 }, { x: 0, y: 0, radius: 1 })).toBe(false);
  });
});
