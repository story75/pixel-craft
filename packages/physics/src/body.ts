import type { Point2, Vector2 } from '@pixel-craft/math';

export type PhysicsBody = Point2 & {
  /**
   * If true, the body will not be affected by forces.
   */
  static: boolean;

  /**
   * The mass of the body
   *
   * @remarks
   * This is used to scale the force applied to the body.
   * This affects how much force is transferred to the body when it collides with other bodies,
   * as well as how long it takes for the body to move to a new position.
   */
  mass: number;

  /**
   * The velocity of the body
   */
  velocity: Vector2;

  /**
   * The elasticity of the body
   *
   * @remarks
   * This is used to scale the force applied to the body when it collides with other bodies.
   */
  elasticity: number;
};
