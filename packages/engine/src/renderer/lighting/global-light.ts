import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

export type GlobalLight = {
  globalLightUniformBuffer: GPUBuffer;
  color: (color: [number, number, number]) => void;
  intensity: (intensity: number) => void;
};

/**
 * Creates a global light uniform buffer.
 *
 * @remarks
 * This is a convenience function for working with a global light uniform buffer.
 * The buffer is written to the GPU queue on creation.
 */
export function createGlobalLight(device: GPUDevice): GlobalLight {
  const state = new Float32Array(16);
  state[0] = 1;
  state[1] = 1;
  state[2] = 1;
  state[3] = 1;

  const globalLightUniformBuffer = uniformBufferAllocator(device)(state);

  const color = ([r, g, b]: [number, number, number]) => {
    state[0] = r;
    state[1] = g;
    state[2] = b;
    update();
  };

  const intensity = (i: number) => {
    state[3] = i;
    update();
  };

  const update = () => {
    device.queue.writeBuffer(globalLightUniformBuffer, 0, state);
  };

  update();

  return {
    globalLightUniformBuffer,
    color,
    intensity,
  };
}
