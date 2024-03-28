import { Input } from '../input/input';
import { WebGPUContext } from '../renderer/context/create-context';
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
  context: WebGPUContext,
): InputControlledCamera {
  return {
    x: 0,
    y: 0,
    speed: 10,

    update() {
      this.x += input.x * this.speed * timer.deltaTime;
      this.y += input.y * this.speed * timer.deltaTime;

      context.observe([this.x, this.y]);
    },
  };
}
