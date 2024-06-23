import { IndexType, Query, QueryConfiguration, With, Without } from './query';
import { Store } from './store';

/**
 * Create a cache key for a query configuration.
 */
const cacheKey = (config: QueryConfiguration) => `${config.with.join()}-${config.without.join()}`;

/**
 * Normalize the properties in a query configuration.
 */
const normalize = (config: QueryConfiguration) => {
  const filter = (properties: IndexType[]) => Array.from(new Set(properties.filter((p) => Boolean(p)).sort()));

  return {
    with: filter(config.with),
    without: filter(config.without),
  };
};

class EntityQuery<T extends Record<IndexType, unknown>> extends Store<T> implements Query<T> {
  constructor(
    public readonly key: string,
    private readonly store: EntityStore<Record<IndexType, unknown>>,
    private readonly config: QueryConfiguration,
  ) {
    super();

    for (const entity of store) {
      this.evaluate(entity as T);
    }
  }

  /**
   * Get the entities that include the specified properties.
   */
  with<P extends keyof T>(...properties: P[]): EntityQuery<With<T, P>> {
    return this.store.query<With<T, P>>({
      ...this.config,
      with: [...this.config.with, ...properties],
    });
  }

  /**
   * Get the entities that exclude the specified properties.
   */
  without<P extends keyof T>(...properties: P[]): EntityQuery<Without<T, P>> {
    return this.store.query<Without<T, P>>({
      ...this.config,
      without: [...this.config.without, ...properties],
    });
  }

  /**
   * Evaluate an entity for the query.
   *
   * @remarks
   * If the entity matches the query, it will be added to the query.
   * If the entity no longer matches the query, it will be removed from the query.
   *
   * This method is used internally and should not be called directly.
   *
   * @internal
   */
  evaluate(entity: T, next: T = entity): void {
    const contains = this.has(entity);
    const matches = this.match(next);

    if (!contains && matches) {
      this.add(entity);
    } else if (contains && !matches) {
      this.remove(entity);
    }
  }

  private match(entity: T): boolean {
    return (
      this.config.with.every((property) => entity[property] !== undefined) &&
      this.config.without.every((property) => entity[property] === undefined)
    );
  }
}

export class EntityStore<T extends Record<IndexType, unknown>> extends Store<T> implements Query<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly queries = new Set<EntityQuery<any>>();

  constructor() {
    super();

    this.onAdd.subscribe((entity) => this.evaluate(entity));
    this.onRemove.subscribe((entity) => this.queries.forEach((query) => query.remove(entity)));
  }

  /**
   * Add a component to an entity in the store.
   *
   * @remarks
   * If the entity already has the component, it will not be added again.
   * If the entity is not in the store, it will not be updated.
   * This will update the entity and the queries.
   */
  addComponent<P extends keyof T>(entity: T, property: P, value: T[P]): void {
    if (entity[property] !== undefined) {
      return;
    }

    this.update(entity, property, value);
  }

  /**
   * Remove a component from an entity in the store.
   *
   * @remarks
   * If the entity does not have the component, nothing will happen.
   * If the entity is not in the store, it will not be updated.
   * This will update the entity and the queries.
   */
  removeComponent<P extends keyof T>(entity: T, property: P): void {
    if (entity[property] === undefined) {
      return;
    }

    if (!this.has(entity)) {
      return;
    }

    this.evaluate(entity, { ...entity, [property]: undefined });

    // we cheat here by using delete to avoid wrestling with typescript
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete entity[property];
  }

  /**
   * Create or retrieve a query for the store.
   *
   * @remarks
   * If a query with the same configuration already exists, it will be reused.
   * Otherwise, a new query will be created.
   *
   * This method is used internally and should not be called directly.
   *
   * @internal
   */
  query<N extends Record<IndexType, unknown>>(config: QueryConfiguration): EntityQuery<N> {
    const normalized = normalize(config);
    const key = cacheKey(normalized);

    for (const query of this.queries) {
      if (query.key === key) {
        return query as EntityQuery<N>;
      }
    }

    const query = new EntityQuery<N>(key, this as EntityStore<Record<IndexType, unknown>>, normalized);
    this.queries.add(query);
    return query;
  }

  /**
   * Get the entities that include the specified properties.
   */
  with<P extends keyof T>(...properties: P[]): EntityQuery<With<T, P>> {
    return this.query({ with: properties, without: [] });
  }

  /**
   * Get the entities that exclude the specified properties.
   */
  without<P extends keyof T>(...properties: P[]): EntityQuery<Without<T, P>> {
    return this.query({ with: [], without: properties });
  }

  private evaluate(entity: T, next = entity): void {
    for (const query of this.queries) {
      query.evaluate(entity, next);
    }
  }

  /**
   * Update an entity in the store.
   *
   * @remarks
   * If the entity is not in the store, it will not be updated.
   * If the entity was updated, the queries will be updated.
   */
  private update<P extends keyof T>(entity: T, property: P, value: T[P]): void {
    if (!this.has(entity)) {
      return;
    }

    entity[property] = value;
    this.evaluate(entity);
  }
}
