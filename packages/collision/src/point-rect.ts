import { Point2, Rect } from '@pixel-craft/math';

/**
 * Checks if a point is colliding with a rectangle.
 */
export function pointRect(point: Point2, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
