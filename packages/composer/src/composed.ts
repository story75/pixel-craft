/**
 * Convert a Union Type like FOO | Bar to Foo & Bar
 */
type UnionToIntersection<U> = (U extends object ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * A simple function that allows you to compose multiple objects together in a type-safe way.
 *
 * @remarks
 * This is a utility function to save some boilerplate code when composing multiple objects together and automatically merging their types.
 *
 * @example
 * ```typescript
 * const gameObject = composed([
 *   transform(),
 *   physics(),
 *   sprite(),
 *   collider(),
 *   health(),
 * ]);
 * ```
 */
export function composed<T extends object>(components: T[]): UnionToIntersection<T> {
  return components.reduce((acc, component) => {
    return {
      ...acc,
      ...component,
    };
  }, {}) as UnionToIntersection<T>;
}
