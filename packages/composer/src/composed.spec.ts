import { describe, expect, it } from 'bun:test';
import { composed } from './composed';

describe('composed', () => {
  it('should compose objects', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const obj3 = { c: 3 };
    const obj4 = { d: 4 };
    const obj5 = { e: 5 };

    const result = composed([obj1, obj2, obj3, obj4, obj5]);

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    });
  });
});
