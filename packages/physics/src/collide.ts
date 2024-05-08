import { Vector2 } from '@pixel-craft/math';
import { PhysicsBody } from './body';

/**
 * Simulate a collision between two bodies.
 *
 * @remarks
 * This function will modify the velocity of the bodies to simulate the collision.
 * It will also modify the position of the bodies to prevent them from overlapping.
 * This function assumes that the bodies are overlapping.
 */
export function collide(a: PhysicsBody, b: PhysicsBody): void {
  if (a.static && b.static) {
    return;
  }

  const overlap = new Vector2(a).subtract(b).normal();

  // Calculate the direction of the collision and adjust if necessary
  if (overlap.dot(a) < overlap.dot(b)) {
    overlap.multiply(-1);
  }

  // move the bodies apart
  if (!a.static) {
    const position = new Vector2(a).add(overlap.multiply(1 / a.mass));
    a.x = position.x;
    a.y = position.y;
  }
  if (!b.static) {
    const position = new Vector2(b).subtract(overlap.multiply(1 / b.mass));
    b.x = position.x;
    b.y = position.y;
  }

  // Update the velocity of the bodies
  const elasticity = Math.max(a.elasticity, b.elasticity);
  const velocityDot = a.velocity.subtract(b.velocity).dot(overlap);
  const impulse = overlap.multiply(
    (velocityDot * -(1 + elasticity)) / (1 / a.mass + 1 / b.mass),
  );
  if (!a.static) {
    const velocity = a.velocity.add(impulse.multiply(1 / a.mass));
    a.velocity.x = velocity.x;
    a.velocity.y = velocity.y;
  }
  if (!b.static) {
    const velocity = b.velocity.subtract(impulse.multiply(1 / b.mass));
    b.velocity.x = velocity.x;
    b.velocity.y = velocity.y;
  }
}
