import { Rect } from '@pixel-craft/math';

/**
 * Checks if a rectangle is colliding with a rectangle.
 */
export function rectRect(a: Rect, b: Rect): boolean {
  return (
    a.x + a.width >= b.x &&
    a.x <= b.x + b.width &&
    a.y + a.height >= b.y &&
    a.y <= b.y + b.height
  );
}
