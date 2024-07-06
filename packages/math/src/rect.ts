import type { Point2 } from './vector2';

export type Rect = Point2 & {
  width: number;
  height: number;
};
