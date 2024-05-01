/**
 * Constraint a type to force the defined properties to be required.
 */
export type With<T, P extends keyof T> = T & Required<Pick<T, P>>;

/**
 * Constraint a type to force the defined properties to be removed.
 */
export type Without<T, P extends keyof T> = Omit<T, P>;

export type IndexType = string | number | symbol;

/**
 * Query configuration to specify which properties to include or exclude.
 */
export type QueryConfiguration = {
  with: IndexType[];
  without: IndexType[];
};

/**
 * Query a store for entities.
 */
export type Query<T> = Iterable<T> & {
  /**
   * Get the entities that include the specified properties.
   */
  with: <P extends keyof T>(...properties: P[]) => Query<With<T, P>>;

  /**
   * Get the entities that exclude the specified properties.
   */
  without: <P extends keyof T>(...properties: P[]) => Query<Without<T, P>>;
};
