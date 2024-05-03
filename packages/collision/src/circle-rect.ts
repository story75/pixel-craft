import { Circle, Point2, Rect, clamp } from '@pixel-craft/math';
import { pointCircle } from './point-circle';

/**
 * Checks if a circle is colliding with a rectangle.
 */
export function circleRect(circle: Circle, rect: Rect): boolean {
  const edge: Point2 = {
    x: clamp(circle.x, rect.x, rect.x + rect.width),
    y: clamp(circle.y, rect.y, rect.y + rect.height),
  };

  return pointCircle(edge, circle);
}
