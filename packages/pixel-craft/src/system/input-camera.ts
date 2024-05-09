import { Camera } from '@pixel-craft/renderer';
import { InputSystem } from './input';
import { CreateHookContext, System } from './system';
import { TimerSystem } from './timer';

/**
 * An input camera system is responsible to move the camera based on the input.
 */
export class InputCameraSystem implements System {
  private x = 0;
  private y = 0;
  private camera!: Camera;

  constructor(
    private readonly input: InputSystem,
    private readonly timer: TimerSystem,
    private readonly speed = 10,
  ) {}

  createSystem({ context }: CreateHookContext): Promise<void> {
    this.camera = context.camera;
    return Promise.resolve();
  }

  update(): void {
    const adjustedSpeed = this.speed * this.timer.deltaTime;
    this.x += this.input.x * adjustedSpeed;
    this.y += this.input.y * adjustedSpeed;

    this.camera.observe({ x: this.x, y: this.y });
  }
}
