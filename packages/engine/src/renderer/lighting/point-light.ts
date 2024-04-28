import { storageBufferAllocator } from '../buffer/storage-buffer-allocator';
import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

export type PointLight = {
  position: [x: number, y: number];
  color: [r: number, g: number, b: number];
  intensity: number;
};

export type PointLightSystem = {
  storageBuffer: GPUBuffer;
  amountUniformBuffer: GPUBuffer;
  addLight: (light: PointLight) => void;
  updateLight: (light: PointLight) => void;
  removeLight: (light: PointLight) => void;
};

const FLOATS_PER_LIGHT = 6;

/**
 * Creates a global light uniform buffer.
 *
 * @remarks
 * This is a convenience function for working with a global light uniform buffer.
 * The buffer is written to the GPU queue on creation.
 */
export function createPointLight(device: GPUDevice): PointLightSystem {
  const maxLights = 1000; // start off with a large number of lights
  const storage = new Float32Array(
    maxLights * FLOATS_PER_LIGHT * Float32Array.BYTES_PER_ELEMENT,
  );

  const storageBuffer = storageBufferAllocator(device)(storage);
  const amountUniformBuffer = uniformBufferAllocator(device)(
    new Uint32Array([0]),
  ); // single uint32

  const lights: PointLight[] = [];
  const dict = new Map<PointLight, number>();

  const writeLength = () =>
    device.queue.writeBuffer(
      amountUniformBuffer,
      0,
      new Uint32Array([lights.length]),
    );
  writeLength();

  const updateLight = (light: PointLight) => {
    const index = dict.get(light);
    if (index === undefined) {
      return;
    }

    const offset = index * FLOATS_PER_LIGHT * Float32Array.BYTES_PER_ELEMENT;
    storage.set(light.position, offset);
    storage.set(light.color, offset + 2);
    storage.set([light.intensity], offset + 5);

    device.queue.writeBuffer(
      storageBuffer,
      offset,
      storage.subarray(offset, offset + 6),
    );
  };

  return {
    storageBuffer,
    amountUniformBuffer,
    addLight: (light: PointLight) => {
      if (lights.length >= maxLights) {
        // TODO: Grow the buffer
        throw new Error('Too many lights!');
      }

      const index = lights.length;
      dict.set(light, index);
      lights.push(light);

      updateLight(light);
      writeLength();
    },
    updateLight,
    removeLight: (light: PointLight) => {
      const index = dict.get(light);
      if (index === undefined) {
        return;
      }

      dict.delete(light);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const last = lights.at(-1)!;
      if (last !== light) {
        lights[index] = last;
        dict.set(last, index);
        updateLight(last);
      }

      writeLength();
    },
  };
}
