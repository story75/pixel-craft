import { describe, expect, it } from 'bun:test';
import { random } from './random';

describe('random', () => {
  it('should return a random number between 0 and 1', () => {
    const rng = random('mySeed');

    for (let i = 0; i < 1000; i++) {
      const result = rng();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    }
  });

  it('should return a different number for different seeds', () => {
    const result1 = random('seed1')();
    const result2 = random('seed2')();
    expect(result1).not.toBe(result2);
  });

  it('should return the same number for the same seed', () => {
    const result1 = random('seed')();
    const result2 = random('seed')();
    expect(result1).toBe(result2);
  });
});
