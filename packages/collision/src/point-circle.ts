import { type Circle, Vector2, type Vector2Like } from '@pixel-craft/math';

/**
 * Checks if a point is colliding with a circle.
 */
export function pointCircle(point: Vector2Like, circle: Circle): boolean {
  const distance = new Vector2(point).subtract(circle).length();
  return distance <= circle.radius;
}
