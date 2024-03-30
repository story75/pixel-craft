import { Input } from '../input/input';
import { Camera } from '../renderer/camera/camera';
import { Timer } from '../timer/timer';

export type InputControlledCamera = {
  x: number;
  y: number;
  speed: number;

  update(): void;
};

export function inputControlledCamera(
  input: Input,
  timer: Timer,
  camera: Camera,
): InputControlledCamera {
  return {
    x: 0,
    y: 0,
    speed: 10,

    update() {
      this.x += input.x * this.speed * timer.deltaTime;
      this.y += input.y * this.speed * timer.deltaTime;

      camera.observe([this.x, this.y]);
    },
  };
}
