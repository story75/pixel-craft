/**
 * Timer object
 *
 * @remarks
 * The timer object is used to keep track of the time between frames and calculate the delta time.
 */
export type Timer = {
  /**
   * The time of the last frame as reported by performance.now()
   */
  lastFrame: number;

  /**
   * How much time has passed in relation to the target frame rate
   *
   * @remarks
   * The value will be between 0 and 1. If the value is 1, then the frame rate is at the target frame rate.
   */
  deltaTime: number;

  /**
   * The time between the last frame and the current frame
   */
  frameTime: number;

  /**
   * The target frame rate
   *
   * @remarks
   * The value is expected to be in milliseconds e.g. 0.06 for 60fps.
   */
  targetFrameRate: number;

  /**
   * Update the timer object
   *
   * @param now - The current time as reported by performance.now()
   */
  update(now: number): void;
};

/**
 * Create a timer object
 *
 * @param targetFrameRate - The target frame rate. Default is 60fps.
 */
export function createTimer(targetFrameRate = 0.06): Timer {
  return {
    lastFrame: performance.now(),
    deltaTime: 0,
    frameTime: 0,
    targetFrameRate,
    update(now: number) {
      this.frameTime = now - this.lastFrame;
      this.deltaTime = this.frameTime * this.targetFrameRate;
      this.lastFrame = now;
    },
  };
}
