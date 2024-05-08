import { describe, expect, it } from 'bun:test';
import { clamp } from './clamp';

describe('clamp', () => {
  it('should clamp a value between a minimum and maximum value', () => {
    const value = 5;
    const min = 0;
    const max = 10;

    expect(clamp(value, min, max)).toBe(5);
  });

  it('should clamp a value to the minimum value', () => {
    const value = -5;
    const min = 0;
    const max = 10;

    expect(clamp(value, min, max)).toBe(0);
  });

  it('should clamp a value to the maximum value', () => {
    const value = 15;
    const min = 0;
    const max = 10;

    expect(clamp(value, min, max)).toBe(10);
  });
});
