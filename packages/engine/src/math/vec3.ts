/**
 * A simple point in 3D space
 */
export type Point3 = {
  x: number;
  y: number;
  z: number;
};

/**
 * A vector in 3D space
 */
export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor({ x, y, z }: Point3 | Vector3) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Return the length of a vector
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Create a new vector which is the product of the current vector and the factor
   *
   * @param factor - The factor to multiply by
   */
  multiply(factor: number): Vector3 {
    return new Vector3({
      x: this.x * factor,
      y: this.y * factor,
      z: this.z * factor,
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
  normal(): Vector3 {
    const length = this.length();
    if (!length) {
      return new Vector3(this);
    }
    return this.multiply(1 / length);
  }

  /**
   * Subtract two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
   */
  subtract(b: Vector3): Vector3 {
    return new Vector3({ x: this.x - b.x, y: this.y - b.y, z: this.z - b.z });
  }

  /**
   * Cross two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Cross_product
   */
  cross(b: Vector3): Vector3 {
    return new Vector3({
      x: this.y * b.z - this.z * b.y,
      y: this.z * b.x - this.x * b.z,
      z: this.x * b.y - this.y * b.x,
    });
  }

  /**
   * Dot two vectors.
   *
   * @see https://en.wikipedia.org/wiki/Dot_product
   */
  dot(b: Vector3): number {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  }
}
