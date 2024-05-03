import { Circle, Vector2 } from '@pixel-craft/math';

/**
 * Checks if a circle is colliding with a circle.
 */
export function circleCircle(a: Circle, b: Circle): boolean {
  const distance = new Vector2({
    x: a.x - b.x,
    y: a.y - b.y,
  }).length();
  return distance <= a.radius + b.radius;
}
