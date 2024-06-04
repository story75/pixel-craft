import { clamp } from '@pixel-craft/math';

enum Direction {
  Forward = 0,
  Backward = 1,
}

/**
 * Tween class that can animate properties of an object
 *
 * @remarks
 * This class will take a snapshot of the properties of the target object and tween them to the specified values.
 * You can optionally specify an easing function, duration, repeat and pingPong.
 *
 * The easing function should take a value between 0 and 1 and return a value between 0 and 1.
 * The duration is in milliseconds.
 * The repeat flag will make the tween repeat indefinitely.
 * The pingPong flag will make the tween go back and forth in conjunction with the repeat flag.
 *
 * Only number properties of the target object will be tweened.
 *
 * If the tween is paused, it will not update the target object.
 *
 * The tween has to be manually updated by calling the update method.
 * The reason is that you will very likely want to update all tweens at the same time and have a single update loop.
 */
export class Tween<T extends Record<string, unknown>> {
  private paused = true;
  private direction: Direction = Direction.Forward;
  private progress = 0;
  private readonly startProperties: Record<string, number> = {};
  private readonly endProperties: Record<string, number> = {};

  constructor(
    private readonly target: T,
    properties: Partial<T>,
    private readonly easing: (t: number) => number,
    private readonly duration = 1000,
    private readonly repeat = false,
    private readonly pingPong = false,
  ) {
    const keys = Object.keys(properties);
    for (const key of keys) {
      if (key in this.target && typeof this.target[key] === 'number') {
        this.startProperties[key] = this.target[key] as number;
        this.endProperties[key] = properties[key] as number;
      }
    }

    this.play();
  }

  pause(): void {
    this.paused = true;
  }

  play(): void {
    this.paused = false;
  }

  isPaused(): boolean {
    return this.paused;
  }

  update(dt: number): void {
    if (this.paused) {
      return;
    }

    this.progress = this.direction === Direction.Forward ? this.progress + dt : this.progress - dt;
    const progressPercentage = clamp(this.progress / this.duration, 0, 1);
    const t = this.easing(progressPercentage);

    for (const key in this.endProperties) {
      const start = this.startProperties[key];
      const end = this.endProperties[key];
      this.target[key as keyof T] = (start + (end - start) * t) as T[keyof T];
    }

    if (this.reachedEnd()) {
      if (!this.repeat) {
        this.paused = true;
        return;
      }

      if (this.pingPong) {
        this.direction = this.direction === Direction.Forward ? Direction.Backward : Direction.Forward;
      }

      this.progress = this.direction === Direction.Forward ? 0 : this.duration;
    }
  }

  private reachedEnd(): boolean {
    if (this.direction === Direction.Forward) {
      return this.progress >= this.duration;
    }

    return this.progress <= 0;
  }
}
