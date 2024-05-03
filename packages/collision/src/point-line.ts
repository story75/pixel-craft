import { Line, Point2, Vector2 } from '@pixel-craft/math';

/**
 * Checks if a point is colliding with a line.
 */
export function pointLine(point: Point2, line: Line): boolean {
  const buffer = 0.1;
  const a = new Vector2({
    x: line.from.x - point.x,
    y: line.from.y - point.y,
  }).length();
  const b = new Vector2({
    x: line.to.x - point.x,
    y: line.to.y - point.y,
  }).length();
  const c = new Vector2({
    x: line.to.x - line.from.x,
    y: line.to.y - line.from.y,
  }).length();

  const length = a + b;
  return length >= c - buffer && length <= c + buffer;
}
