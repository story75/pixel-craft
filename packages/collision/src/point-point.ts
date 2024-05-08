import { Vector2Like } from '@pixel-craft/math';

/**
 * Checks if two points are colliding.
 */
export function pointPoint(a: Vector2Like, b: Vector2Like): boolean {
  return a.x === b.x && a.y === b.y;
}
