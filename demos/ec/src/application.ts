import { EntityStore } from '@pixel-craft/store';

type Entity = Partial<{
  x: number;
  y: number;
  z: number;
  velocity: number;
  width: number;
  height: number;
}>;

export function application(_canvas: HTMLCanvasElement): Promise<void> {
  const store = new EntityStore<Entity>();

  const a = store.add({
    x: 0,
    y: 0,
    z: 0,
    velocity: 1,
    width: 32,
    height: 32,
  });

  const _b = store.add({
    x: 0,
    y: 0,
    z: 0,
    velocity: 1,
    width: 32,
    height: 32,
  });

  const c = store.add({
    x: 0,
    y: 0,
    z: 0,
    width: 32,
    height: 32,
  });

  const withVelocity = store.with('velocity');
  console.log([...withVelocity]);

  store.addComponent(c, 'velocity', 2);
  console.log([...withVelocity]);

  a.velocity = 69;
  console.log([...withVelocity]);

  store.removeComponent(a, 'velocity');
  console.log([...withVelocity]);

  return Promise.resolve();
}
