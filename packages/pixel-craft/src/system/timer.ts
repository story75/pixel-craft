import { System } from './system';

/**
 * A timer system is responsible for tracking frame time and calculating delta time.
 *
 * @param targetFrameRate - The target frame rate. The value is expected to be in milliseconds e.g. 0.06 for 60fps.
 */
export class TimerSystem implements System {
  /**
   * How much time has passed in relation to the target frame rate
   *
   * @remarks
   * The value will be between 0 and 1. If the value is 1, then the frame rate is at the target frame rate.
   */
  public deltaTime = 0;
  private lastFrame = performance.now();
  private frameTime = 0;

  createSystem(): Promise<void> {
    this.lastFrame = performance.now();
    return Promise.resolve();
  }

  update(now: number): void {
    this.frameTime = now - this.lastFrame;
    this.deltaTime = this.frameTime * 0.06;
    this.lastFrame = now;
  }
}
