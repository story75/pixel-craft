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
  public onAdd = new Observable<[entity: T]>();

  /**
   * Observable that notifies when an entity is removed from the store.
   */
  public onRemove = new Observable<[entity: T]>();

  protected data: T[] = [];
  protected indices = new Map<T, number>();

  get size(): number {
    return this.data.length;
  }

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
   * Add an entity to the store.
   *
   * @remarks
   * If the entity is already in the store, it will not be added again.
   * If the entity was added, the onAdd observable will be notified.
   */
  add(entity: T): T {
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
    if (!index) {
      return;
    }

    this.indices.delete(entity);
    const last = this.data.at(-1);
    if (last !== entity) {
      this.data[index] = last as T; // last is never undefined, because the list can never be empty here
      this.indices.set(last as T, index);
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
