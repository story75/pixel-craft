import { describe, expect, it } from 'bun:test';
import { mortonZOrder } from './morton-z-order';

describe('mortonZOrder', () => {
  it('can hash 2D coordinates', () => {
    expect(mortonZOrder(0, 0)).toBe(0);
    expect(mortonZOrder(1, 0)).toBe(1);
    expect(mortonZOrder(0, 1)).toBe(2);
    expect(mortonZOrder(1, 1)).toBe(3);
    expect(mortonZOrder(2, 0)).toBe(4);
    expect(mortonZOrder(0, 2)).toBe(8);
    expect(mortonZOrder(2, 2)).toBe(12);
  });
});
