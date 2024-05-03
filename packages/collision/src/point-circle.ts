import { Circle, Point2, Vector2 } from '@pixel-craft/math';

/**
 * Checks if a point is colliding with a circle.
 */
export function pointCircle(point: Point2, circle: Circle): boolean {
  const distance = new Vector2({
    x: point.x - circle.x,
    y: point.y - circle.y,
  }).length();
  return distance <= circle.radius;
}
