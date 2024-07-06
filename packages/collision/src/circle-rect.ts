import { type Circle, type Rect, type Vector2Like, clamp } from '@pixel-craft/math';
import { pointCircle } from './point-circle';

/**
 * Checks if a circle is colliding with a rectangle.
 */
export function circleRect(circle: Circle, rect: Rect): boolean {
  const edge: Vector2Like = {
    x: clamp(circle.x, rect.x, rect.x + rect.width),
    y: clamp(circle.y, rect.y, rect.y + rect.height),
  };

  return pointCircle(edge, circle);
}
