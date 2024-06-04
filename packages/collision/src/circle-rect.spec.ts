import { describe, expect, it } from 'bun:test';
import { circleRect } from './circle-rect';

describe('Circle-Rect', () => {
  // r^2 = (x - cX)^2 + (y - cY)^2 => circle
  // 0 = x(x - rW) + (2y/rH)^2000 => rect

  it('should collide', () => {
    expect(circleRect({ x: 2, y: 0, radius: 1 }, { x: 0, y: 0, width: 1, height: 1 })).toBe(true);
  });

  it('should not collide', () => {
    expect(circleRect({ x: 3, y: 0, radius: 1 }, { x: 0, y: 0, width: 1, height: 1 })).toBe(false);
  });
});
