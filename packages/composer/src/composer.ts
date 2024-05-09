/**
 * A simple class that allows you to compose functions together in a type-safe way.
 *
 * @remarks
 * This is a workaround because there is no native |> operator in JavaScript and writing a sensible type-safe version is hard.
 * This class only allows single-argument functions, which take some initial state and return some new state.
 *
 * @example
 * ```typescript
 * const add = (a: number) => (b: number) => a + b;
 * const multiply = (a: number) => (b: number) => a * b;
 *
 * const add3 = add(3);
 * const double = multiply(2);
 * const triple = multiply(3);
 *
 * const result = new Composer(1, add3)
 *     .next(double)
 *     .next(triple)
 *     .next(n => String(n))
 *     .execute();
 *
 * expect(result).toBe('24');
 * ```
 */
export class Composer<InitialState, NextState> {
  constructor(
    public readonly s: InitialState,
    public readonly fn: (s: InitialState) => NextState,
  ) {}

  public next<NewState>(
    fn: (s: NextState) => NewState,
  ): Composer<InitialState, NewState> {
    return new Composer(this.s, (s) => fn(this.fn(s)));
  }

  public execute(): NextState {
    return this.fn(this.s);
  }
}
