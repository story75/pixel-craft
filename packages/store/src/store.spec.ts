import { describe, expect, it } from 'bun:test';
import { Store } from './store';

type Entity = {
  name: string;
};

describe('Store', () => {
  it('can add and remove entities', () => {
    const store = new Store<Entity>();
    const added: Entity[] = [];
    const removed: Entity[] = [];
    const shuffled: Entity[] = [];
    store.onAdd.subscribe((entity) => added.push(entity));
    store.onRemove.subscribe((entity) => removed.push(entity));
    store.onShuffle.subscribe((entity) => shuffled.push(entity));

    // add routine
    const a = store.add({ name: 'a' });
    const b = store.add({ name: 'b' });
    const c: Entity = { name: 'c' };

    // will count
    expect(store.size).toBe(2);
    // will index
    expect(store.index(a)).toBe(0);
    expect(store.index(b)).toBe(1);
    expect(store.index(c)).toBe(undefined);
    // will contain
    expect(store.has(a)).toBe(true);
    expect(store.has(b)).toBe(true);
    expect(store.has(c)).toBe(false);
    // will notify
    expect(added).toEqual([a, b]);

    // remove routine
    store.remove(a);
    store.remove(b);
    store.remove(c);

    // will count
    expect(store.size).toBe(0);
    // will not index
    expect(store.index(a)).toBe(undefined);
    expect(store.index(b)).toBe(undefined);
    expect(store.index(c)).toBe(undefined);
    // will not contain
    expect(store.has(a)).toBe(false);
    expect(store.has(b)).toBe(false);
    expect(store.has(c)).toBe(false);
    // will notify
    expect(removed).toEqual([a, b]);
    expect(shuffled).toEqual([b]);
  });

  it('can clear the store', () => {
    const store = new Store<Entity>();
    const removed: Entity[] = [];
    store.onRemove.subscribe((entity) => removed.push(entity));

    const a = store.add({ name: 'a' });
    const b = store.add({ name: 'b' });

    expect(store.size).toBe(2);

    store.clear();
    expect(store.size).toBe(0);
    expect(removed).toEqual([b, a]);
  });

  it('can iterate and remove', () => {
    const store = new Store<Entity>();

    const a = store.add({ name: 'a' });
    const b = store.add({ name: 'b' });
    const c = store.add({ name: 'c' });

    const seen: Entity[] = [];
    for (const entity of store) {
      seen.push(entity);
      store.remove(entity);
    }
    expect(seen).toEqual([c, b, a]);
  });
});
