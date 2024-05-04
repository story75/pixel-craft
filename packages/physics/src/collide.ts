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

  let overlap = new Vector2({
    x: a.x - b.x,
    y: a.y - b.y,
  }).normal();

  // Calculate the direction of the collision and adjust if necessary
  if (overlap.dot(new Vector2(a)) < overlap.dot(new Vector2(b))) {
    overlap = overlap.multiply(-1);
  }

  // move the bodies apart
  if (!a.static) {
    const massAffected = overlap.multiply(1 / a.mass);
    a.x += massAffected.x;
    a.y += massAffected.y;
  }
  if (!b.static) {
    const massAffected = overlap.multiply(1 / a.mass);
    b.x -= massAffected.x;
    b.y -= massAffected.y;
  }

  // Update the velocity of the bodies
  const velocity = a.velocity.subtract(b.velocity).dot(overlap);
  const elasticity = Math.max(a.elasticity, b.elasticity);
  const impulse = overlap.multiply(
    (velocity * -(1 + elasticity)) / (1 / a.mass + 1 / b.mass),
  );
  if (!a.static) {
    a.velocity = a.velocity.add(impulse.multiply(1 / a.mass));
  }
  if (!b.static) {
    b.velocity = b.velocity.subtract(impulse.multiply(1 / b.mass));
  }
}
