import { type Line, Vector2, type Vector2Like } from '@pixel-craft/math';

/**
 * Checks if a point is colliding with a line.
 */
export function pointLine(point: Vector2Like, line: Line): boolean {
  const buffer = 0.1;
  const a = new Vector2(line.from).subtract(point).length();
  const b = new Vector2(line.to).subtract(point).length();
  const c = new Vector2(line.to).subtract(line.from).length();
  const length = a + b;
  return length >= c - buffer && length <= c + buffer;
}
