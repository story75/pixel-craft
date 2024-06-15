import { describe, expect, it } from 'bun:test';
import { randomInRange } from './random-in-range';

describe('randomInRange', () => {
  it('should return a random integer in the range [min, max]', () => {
    const rng = () => 0.5;
    const result = randomInRange(rng, 1, 3);
    expect(result).toBe(2);
  });

  it('should return the minimum value when the random number is 0', () => {
    const rng = () => 0;
    const result = randomInRange(rng, 1, 3);
    expect(result).toBe(1);
  });

  it('should return the maximum value when the random number is 1', () => {
    const rng = () => 1;
    const result = randomInRange(rng, 1, 3);
    expect(result).toBe(3);
  });
});
