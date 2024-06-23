import { Observable } from '@pixel-craft/observable';

/**
 * Store to hold entities of a single type.
 *
 * @remarks
 * This store is iterable and will iterate over the entities in reverse order to ensure,
 * that you may remove entities from the store while iterating over it.
 */
export class Store<T> implements Iterable<T> {
  /**
   * Observable that notifies when an entity is added to the store.
   */
  public onAdd: Observable<[entity: T]> = new Observable<[entity: T]>();

  /**
   * Observable that notifies when an entity is removed from the store.
   */
  public onRemove: Observable<[entity: T]> = new Observable<[entity: T]>();

  /**
   * Observable that notifies when an entity is shuffled in the store.
   *
   * @remarks
   * This happens when an entity is removed and the last entity is moved to the position of the removed entity.
   * The index is the new index of the entity in the store.
   */
  public onShuffle: Observable<[entity: T, index: number]> = new Observable<[entity: T, index: number]>();

  protected data: T[] = [];
  protected indices: Map<T, number> = new Map<T, number>();

  get size(): number {
    return this.data.length;
  }

  // TODO: Re-enable --isolatedDeclarations once the issue is fixed https://github.com/microsoft/TypeScript/issues/58490
  [Symbol.iterator](): Iterator<T> {
    let index = this.data.length;

    const result = {
      value: undefined as T,
      done: false,
    };

    return {
      next: () => {
        result.value = this.data[--index];
        result.done = index < 0;
        return result;
      },
    };
  }

  /**
   * Check if the store contains the given entity.
   */
  has(entity: T): boolean {
    return this.indices.has(entity);
  }

  /**
   * Return the index of the given entity in the store if it exists.
   */
  index(entity: T): number | undefined {
    return this.indices.get(entity);
  }

  /**
   * Add an entity to the store.
   *
   * @remarks
   * If the entity is already in the store, it will not be added again.
   * If the entity was added, the onAdd observable will be notified.
   */
  add<R extends T>(entity: R): R {
    if (!entity || this.has(entity)) {
      return entity;
    }

    this.data.push(entity);
    this.indices.set(entity, this.data.length - 1);
    this.onAdd.notify(entity);

    return entity;
  }

  /**
   * Remove an entity from the store.
   *
   * @remarks
   * If the entity is not in the store, nothing will happen.
   * If the entity was removed, the onRemove observable will be notified.
   *
   * @privateRemarks
   * This method uses pop instead of splice to avoid reindexing the entire array.
   * Instead, the last element is moved to the position of the removed entity.
   */
  remove(entity: T): void {
    const index = this.indices.get(entity);
    if (index === undefined) {
      return;
    }

    this.indices.delete(entity);
    const last = this.data.at(-1) as T; // last is never undefined, because the list can never be empty here
    if (last !== entity) {
      this.data[index] = last;
      this.indices.set(last, index);
      this.onShuffle.notify(last, index);
    }

    this.data.pop();
    this.onRemove.notify(entity);
  }

  /**
   * Clear the store.
   *
   * @remarks
   * This method will remove all entities from the store.
   * Use this method to clean up the store and avoid memory leaks.
   */
  clear(): void {
    for (const entity of this) {
      this.remove(entity);
    }
  }
}
