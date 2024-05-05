import { describe, expect, it } from 'bun:test';
import { EntityStore } from './entity-store';

type Entity = {
  name: string;
  velocity?: number;
  tagged?: boolean;
};

describe('EntityStore', () => {
  // taken from store.spec.ts, because the entity store should adhere to the same base rules
  it('can add and remove entities', () => {
    const store = new EntityStore<Entity>();
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

  // taken from store.spec.ts, because the entity store should adhere to the same base rules
  it('can clear the store', () => {
    const store = new EntityStore<Entity>();
    const removed: Entity[] = [];
    store.onRemove.subscribe((entity) => removed.push(entity));

    const a = store.add({ name: 'a' });
    const b = store.add({ name: 'b' });

    expect(store.size).toBe(2);

    store.clear();
    expect(store.size).toBe(0);
    expect(removed).toEqual([b, a]);
  });

  // taken from store.spec.ts, because the entity store should adhere to the same base rules
  it('can iterate and remove', () => {
    const store = new EntityStore<Entity>();

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

  it('can create queries', () => {
    const store = new EntityStore<Entity>();
    const withVelocity = store.with('velocity');
    const withTag = store.with('tagged');
    const withoutVelocity = store.without('velocity');
    const withoutTag = store.without('tagged');

    const a = store.add({ name: 'a', velocity: 1 });
    const b = store.add({ name: 'b', tagged: true });
    const c = store.add({ name: 'c' });
    const d = store.add({ name: 'd', velocity: 0, tagged: false });

    expect(withVelocity.size).toBe(2);
    expect(Array.from(withVelocity) as Entity[]).toEqual([d, a]);

    expect(withTag.size).toBe(2);
    expect(Array.from(withTag) as Entity[]).toEqual([d, b]);

    expect(withoutVelocity.size).toBe(2);
    expect(Array.from(withoutVelocity) as Entity[]).toEqual([c, b]);

    expect(withoutTag.size).toBe(2);
    expect(Array.from(withoutTag) as Entity[]).toEqual([c, a]);

    // extend query
    const withVelocityAndTag = withVelocity.with('tagged');
    expect(withVelocityAndTag.size).toBe(1);
    expect(Array.from(withVelocityAndTag) as Entity[]).toEqual([d]);

    // should re-use queries
    expect(store.with('velocity')).toBe(withVelocity);
    expect(store.without('velocity')).toBe(withoutVelocity);
    expect(withTag.with('velocity')).toBe(withVelocityAndTag);

    // can add components
    store.addComponent(c, 'velocity', 5);

    // should now contain c
    expect(withVelocity.size).toBe(3);
    expect(Array.from(withVelocity) as Entity[]).toEqual([c, d, a]);

    // should be unchanged
    expect(withVelocityAndTag.size).toBe(1);
    expect(Array.from(withVelocityAndTag) as Entity[]).toEqual([d]);

    // can remove components
    store.removeComponent(d, 'tagged');

    expect(withTag.size).toBe(1);
    expect(Array.from(withTag) as Entity[]).toEqual([b]);

    // should now be empty
    expect(withVelocityAndTag.size).toBe(0);
    expect(Array.from(withVelocityAndTag)).toEqual([]);

    // clear should propagate
    store.clear();

    expect(withVelocity.size).toBe(0);
    expect(withTag.size).toBe(0);
    expect(withoutVelocity.size).toBe(0);
    expect(withoutTag.size).toBe(0);
    expect(withVelocityAndTag.size).toBe(0);
  });

  it('correctly emits changes in queries', () => {
    const store = new EntityStore<Entity>();
    const withVelocity = store.with('velocity');
    const added: Entity[] = [];
    const removed: Entity[] = [];
    withVelocity.onAdd.subscribe((entity) => added.push(entity));
    withVelocity.onRemove.subscribe((entity) => removed.push(entity));

    const a = store.add({ name: 'a', velocity: 1 });
    expect(added).toEqual([a]);
    const b = store.add({ name: 'b', tagged: true });
    expect(added).toEqual([a]);
    const c = store.add({ name: 'c' });
    expect(added).toEqual([a]);
    const d = store.add({ name: 'd', velocity: 0, tagged: false });
    expect(added).toEqual([a, d]);

    store.remove(a);
    expect(removed).toEqual([a]);
    store.remove(b);
    expect(removed).toEqual([a]);
    store.remove(c);
    expect(removed).toEqual([a]);
    store.remove(d);
    expect(removed).toEqual([a, d]);
  });

  it('will not add already existing components', () => {
    const store = new EntityStore<Entity>();
    const a = store.add({ name: 'a', velocity: 1 });
    store.addComponent(a, 'velocity', 2);
    expect(a.velocity).toBe(1);
  });

  it('will not remove non-existing components', () => {
    const store = new EntityStore<Entity>();
    const a = store.add({ name: 'a', velocity: 1 });
    store.removeComponent(a, 'tagged');
    expect(a).toEqual({ name: 'a', velocity: 1 });
  });
});
