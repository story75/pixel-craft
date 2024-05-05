import { Vector2 } from '@pixel-craft/math';
import { describe, expect, it } from 'bun:test';
import { PhysicsBody } from './body';
import { collide } from './collide';

describe('collide', () => {
  const setup = (
    aOverwrite: Partial<PhysicsBody> = {},
    bOverwrite: Partial<PhysicsBody> = {},
  ) => {
    const a: PhysicsBody = {
      x: 0,
      y: 0,
      mass: 1,
      elasticity: 1,
      velocity: new Vector2({ x: 2, y: 2 }),
      static: false,
      ...aOverwrite,
    };
    const b: PhysicsBody = {
      x: 50,
      y: 50,
      mass: 1,
      elasticity: 1,
      velocity: new Vector2({ x: 2, y: 2 }),
      static: false,
      ...bOverwrite,
    };
    const cloneA = { ...a, velocity: new Vector2(a.velocity) };
    const cloneB = { ...b, velocity: new Vector2(b.velocity) };

    const overlap = new Vector2({
      x: a.x - b.x,
      y: a.y - b.y,
    }).normal();

    return { a, b, cloneA, cloneB, overlap };
  };

  it('will do nothing if both bodies are static', () => {
    const { a, b, cloneA, cloneB } = setup({ static: true }, { static: true });

    collide(cloneA, cloneB);

    expect(cloneA).toEqual(a);
    expect(cloneB).toEqual(b);
  });

  it('will move the bodies apart', () => {
    const { a, b, cloneA, cloneB, overlap } = setup(
      { static: false },
      { static: false },
    );

    const impulse = overlap.multiply(
      (a.velocity.subtract(b.velocity).dot(overlap) * -2) / 2,
    );

    collide(cloneA, cloneB);

    expect(cloneA).toEqual({
      ...a,
      velocity: a.velocity.add(impulse),
      x: a.x + overlap.x,
      y: a.y + overlap.y,
    });
    expect(cloneB).toEqual({
      ...b,
      velocity: b.velocity.subtract(impulse),
      x: b.x - overlap.x,
      y: b.y - overlap.y,
    });
  });

  it('will only move body a if b is static', () => {
    const { a, b, cloneA, cloneB, overlap } = setup(
      { static: false },
      { static: true },
    );

    const impulse = overlap.multiply(
      (a.velocity.subtract(b.velocity).dot(overlap) * -2) / 2,
    );

    collide(cloneA, cloneB);

    expect(cloneA).toEqual({
      ...a,
      velocity: a.velocity.add(impulse),
      x: a.x + overlap.x,
      y: a.y + overlap.y,
    });
    expect(cloneB).toEqual(b);
  });

  it('will only move body b if a is static', () => {
    const { a, b, cloneA, cloneB, overlap } = setup(
      { static: true },
      { static: false },
    );

    const impulse = overlap.multiply(
      (a.velocity.subtract(b.velocity).dot(overlap) * -2) / 2,
    );

    collide(cloneA, cloneB);

    expect(cloneA).toEqual(a);
    expect(cloneB).toEqual({
      ...b,
      velocity: b.velocity.subtract(impulse),
      x: b.x - overlap.x,
      y: b.y - overlap.y,
    });
  });

  it('will move the bodies apart (with mass)', () => {
    const { a, b, cloneA, cloneB, overlap } = setup(
      { static: false, mass: 2 },
      { static: false, mass: 4 },
    );

    const impulse = overlap.multiply(
      (a.velocity.subtract(b.velocity).dot(overlap) * -2) / 0.75,
    );

    collide(cloneA, cloneB);

    expect(cloneA).toEqual({
      ...a,
      velocity: a.velocity.add(impulse.multiply(0.5)),
      x: a.x + overlap.x * 0.5,
      y: a.y + overlap.y * 0.5,
    });
    expect(cloneB).toEqual({
      ...b,
      velocity: b.velocity.subtract(impulse.multiply(0.25)),
      x: b.x - overlap.x * 0.25,
      y: b.y - overlap.y * 0.25,
    });
  });

  it('will move the bodies apart (with elasticity)', () => {
    const { a, b, cloneA, cloneB, overlap } = setup(
      { static: false, elasticity: 2 },
      { static: false, elasticity: 4 },
    );

    const impulse = overlap.multiply(
      (a.velocity.subtract(b.velocity).dot(overlap) * -5) / 2,
    );

    collide(cloneA, cloneB);

    expect(cloneA).toEqual({
      ...a,
      velocity: a.velocity.add(impulse),
      x: a.x + overlap.x,
      y: a.y + overlap.y,
    });
    expect(cloneB).toEqual({
      ...b,
      velocity: b.velocity.subtract(impulse),
      x: b.x - overlap.x,
      y: b.y - overlap.y,
    });
  });

  it('will move the bodies apart (with mass & elasticity)', () => {
    const { a, b, cloneA, cloneB, overlap } = setup(
      { static: false, mass: 2, elasticity: 2 },
      { static: false, mass: 4, elasticity: 4 },
    );

    const impulse = overlap.multiply(
      (a.velocity.subtract(b.velocity).dot(overlap) * -5) / 0.75,
    );

    collide(cloneA, cloneB);

    expect(cloneA).toEqual({
      ...a,
      velocity: a.velocity.add(impulse.multiply(0.5)),
      x: a.x + overlap.x * 0.5,
      y: a.y + overlap.y * 0.5,
    });
    expect(cloneB).toEqual({
      ...b,
      velocity: b.velocity.subtract(impulse.multiply(0.25)),
      x: b.x - overlap.x * 0.25,
      y: b.y - overlap.y * 0.25,
    });
  });
});
