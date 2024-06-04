import { describe, expect, it } from 'bun:test';
import { Composer } from './index';

describe('Composer', () => {
  it('should compose functions', () => {
    const add = (a: number) => (b: number) => a + b;
    const multiply = (a: number) => (b: number) => a * b;

    const add3 = add(3);
    const double = multiply(2);
    const triple = multiply(3);

    const result = new Composer(1, add3)
      .next(double)
      .next(triple)
      .next((n) => String(n))
      .execute();

    expect(result).toBe('24');
  });

  it('should compose generic functions', () => {
    type TimeState = {
      now: number;
      frameTime: number;
      deltaTime: number;
      lastFrame: number;
    };
    const timeState: TimeState = {
      now: 0,
      frameTime: 0,
      deltaTime: 0,
      lastFrame: 0,
    };

    type BusyState = { busy: boolean };
    const busyState: BusyState = { busy: false };

    const assertTimeState = <T extends object>(state: T): T & TimeState => ({
      ...state,
      ...timeState,
    });

    const assertBusyState = <T extends object>(state: T): T & BusyState => ({
      ...state,
      ...busyState,
    });

    const initialState = { foo: 'bar' };
    const composed = new Composer(initialState, assertTimeState).next(assertBusyState).execute();

    expect(composed).toEqual({
      ...initialState,
      ...timeState,
      ...busyState,
    });
  });
});
