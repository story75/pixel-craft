import type { Rect, Vector2Like } from '@pixel-craft/math';

/**
 * Checks if a point is colliding with a rectangle.
 */
export function pointRect(point: Vector2Like, rect: Rect): boolean {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}
