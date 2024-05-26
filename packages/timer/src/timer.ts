/**
 * A timer is responsible for tracking frame time and calculating delta time.
 *
 * @param targetFrameRate - The target frame rate. The value is expected to be in milliseconds e.g. 0.06 for 60fps.
 */
export class Timer {
  /**
   * The singleton instance of the Timer
   *
   * @remarks
   * This property is set when the Timer is instantiated the first time.
   * New instances of the Timer will overwrite the existing instance.
   */
  static Instance: Timer | undefined;

  /**
   * How much time has passed in relation to the target frame rate
   *
   * @remarks
   * The value will be between 0 and 1. If the value is 1, then the frame rate is at the target frame rate.
   */
  private _deltaTime = 0;

  /**
   * The time between the current frame and the last frame
   *
   * @remarks
   * The value is in milliseconds.
   */
  private _frameTime = 0;

  /**
   * The time of the last frame
   *
   * @remarks
   * The value is in milliseconds.
   */
  private lastFrame = performance.now();

  constructor(private readonly targetFrameRate = 0.06) {
    Timer.Instance = this;
  }

  get deltaTime(): number {
    return this._deltaTime;
  }

  get frameTime(): number {
    return this._frameTime;
  }

  /**
   * Call this for each frame of your game loop to update the timer.
   *
   * @param now - The time reported by performance.now() or the value from requestAnimationFrame.
   */
  update(now: number): void {
    this._frameTime = now - this.lastFrame;
    this._deltaTime = this._frameTime * this.targetFrameRate;
    this.lastFrame = now;
  }
}
