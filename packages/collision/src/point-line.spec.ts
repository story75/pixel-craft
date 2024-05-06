import { describe, expect, it } from 'bun:test';
import { pointLine } from './point-line';

describe('Point-Line', () => {
  it('should collide', () => {
    expect(
      pointLine({ x: 0, y: 0 }, { from: { x: -1, y: -1 }, to: { x: 1, y: 1 } }),
    ).toBe(true);
  });

  it('should not collide', () => {
    expect(
      pointLine({ x: 1, y: 0 }, { from: { x: -1, y: -1 }, to: { x: 1, y: 1 } }),
    ).toBe(false);
  });
});
