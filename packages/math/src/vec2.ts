/**
 * A simple point in 2D space
 */
export type Point2 = {
  x: number;
  y: number;
};

/**
 * A vector in 2D space
 */
export class Vector2 {
  static Up = new Vector2({ x: 0, y: -1 });
  static Down = new Vector2({ x: 0, y: 1 });
  static Left = new Vector2({ x: -1, y: 0 });
  static Right = new Vector2({ x: 1, y: 0 });

  public x: number;
  public y: number;

  constructor({ x, y }: Point2 | Vector2) {
    this.x = x;
    this.y = y;
  }

  /**
   * Return the length of a vector
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Create a new vector which is the product of the current vector and the factor
   *
   * @param factor - The factor to multiply by
   */
  multiply(factor: number): Vector2 {
    return new Vector2({
      x: this.x * factor,
      y: this.y * factor,
    });
  }

  /**
   * Create a normalized vector from the current vector
   *
   * @remarks
   * A normalized vector has a length of 1.
   *
   * If the current Vector does not have a length,
   * a new vector with the same properties is returned instead.
   */
  normal(): Vector2 {
    const length = this.length();
    if (!length) {
      return new Vector2(this);
    }
    return this.multiply(1 / length);
  }

  /**
   * Add two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
   */
  add(b: Vector2): Vector2 {
    return new Vector2({ x: this.x + b.x, y: this.y + b.y });
  }

  /**
   * Subtract two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
   */
  subtract(b: Vector2): Vector2 {
    return new Vector2({ x: this.x - b.x, y: this.y - b.y });
  }

  /**
   * Cross two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Cross_product
   */
  cross(b: Vector2): Vector2 {
    return new Vector2({
      x: this.y * b.x - this.x * b.y,
      y: this.x * b.y - this.y * b.x,
    });
  }

  /**
   * Dot two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Dot_product
   */
  dot(b: Vector2): number {
    return this.x * b.x + this.y * b.y;
  }

  /**
   * Rotate a vector around an origin.
   *
   * @see https://en.wikipedia.org/wiki/Rotation_matrix
   */
  rotate(origin: Point2, radians: number): Vector2 {
    const x = this.x - origin.x;
    const y = this.y - origin.y;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Vector2({
      x: origin.x + (x * cos - y * sin),
      y: origin.y + (x * sin + y * cos),
    });
  }
}
