import { describe, expect, it } from 'bun:test';
import { rectRect } from './rect-rect';

describe('Rect-Rect', () => {
  it('should collide', () => {
    expect(
      rectRect(
        { x: 1, y: 0, width: 1, height: 1 },
        { x: 0, y: 0, width: 1, height: 1 },
      ),
    ).toBe(true);
  });

  it('should not collide', () => {
    expect(
      rectRect(
        { x: 2, y: 0, width: 1, height: 1 },
        { x: 0, y: 0, width: 1, height: 1 },
      ),
    ).toBe(false);
  });
});
