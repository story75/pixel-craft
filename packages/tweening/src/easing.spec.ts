import { describe, expect, it } from 'bun:test';
import { easeInOutQuad, easeLinear } from './easing';

describe('easing', () => {
  it('should return the same value for linear easing', () => {
    expect(easeLinear(0)).toBe(0);
    expect(easeLinear(1)).toBe(1);
    expect(easeLinear(0.25)).toBe(0.25);
    expect(easeLinear(0.5)).toBe(0.5);
    expect(easeLinear(0.75)).toBe(0.75);
  });

  it('should return the correct value for easeInOutQuad', () => {
    expect(easeInOutQuad(0)).toBe(0);
    expect(easeInOutQuad(1)).toBe(1);
    expect(easeInOutQuad(0.25)).toBe(0.125);
    expect(easeInOutQuad(0.5)).toBe(0.5);
    expect(easeInOutQuad(0.75)).toBe(0.875);
  });
});
