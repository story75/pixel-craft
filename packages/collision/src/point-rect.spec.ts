import { describe, expect, it } from 'bun:test';
import { pointRect } from './point-rect';

describe('Point-Rect', () => {
  it('should collide', () => {
    expect(pointRect({ x: 1, y: 0 }, { x: 0, y: 0, width: 1, height: 1 })).toBe(
      true,
    );
  });

  it('should not collide', () => {
    expect(pointRect({ x: 2, y: 0 }, { x: 0, y: 0, width: 1, height: 1 })).toBe(
      false,
    );
  });
});
