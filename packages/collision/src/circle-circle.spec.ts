import { describe, expect, it } from 'bun:test';
import { circleCircle } from './circle-circle';

describe('Circle-Circle', () => {
  it('should collide', () => {
    expect(circleCircle({ x: 0, y: 0, radius: 1 }, { x: 2, y: 0, radius: 1 })).toBe(true);
  });

  it('should not collide', () => {
    expect(circleCircle({ x: 0, y: 0, radius: 1 }, { x: 3, y: 0, radius: 1 })).toBe(false);
  });
});
