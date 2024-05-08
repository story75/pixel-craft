export type Point2 = { x: number; y: number };
export type Vector2Like = Vector2 | Point2;

/**
 * A vector in 2D space
 *
 * @remarks
 * For creation object always beats array, but the margin is negligible, and both beat Float32Array by a huge margin (98% slower).
 *
 * For writing values (1m entries) the order is array > Float32Array (4% slower) > object (14% slower).
 * For roughly 100k entries, there is next to no difference between the three.
 *
 * @see https://jsperf.app/jedemi
 * @see https://jsperf.app/hekiqa
 */
export class Vector2 {
  public x: number;
  public y: number;

  constructor(input: Vector2Like) {
    this.x = input.x;
    this.y = input.y;
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
  add(b: Vector2Like): Vector2 {
    return new Vector2({ x: this.x + b.x, y: this.y + b.y });
  }

  /**
   * Subtract two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
   */
  subtract(b: Vector2Like): Vector2 {
    return new Vector2({ x: this.x - b.x, y: this.y - b.y });
  }

  /**
   * Cross two vectors.
   *
   * @remarks
   * This is a fake 2D cross product, as the real cross product is only defined in 3D space.
   *
   * @see https://en.wikipedia.org/wiki/Cross_product
   */
  cross(b: Vector2Like): Vector2 {
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
  dot(b: Vector2Like): number {
    return this.x * b.x + this.y * b.y;
  }

  /**
   * Rotate a vector around an origin.
   *
   * @see https://en.wikipedia.org/wiki/Rotation_matrix
   */
  rotate(origin: Vector2Like, radians: number): Vector2 {
    const x = this.x - origin.x;
    const y = this.y - origin.y;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Vector2({
      x: origin.x + (x * cos - y * sin),
      y: origin.y + (x * sin + y * cos),
    });
  }

  /**
   * Create a new vector with the same properties as the current vector
   *
   * @remarks
   * This is an alias for calling `new Vector2(myVector)`.
   */
  copy(): Vector2 {
    return new Vector2(this);
  }
}
