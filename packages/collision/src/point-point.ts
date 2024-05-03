import { Point2 } from '@pixel-craft/math';

/**
 * Checks if two points are colliding.
 */
export function pointPoint(a: Point2, b: Point2): boolean {
  return a.x === b.x && a.y === b.y;
}
