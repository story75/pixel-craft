import { storageBufferAllocator } from '../buffer/storage-buffer-allocator';
import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

export type PointLight = {
  /**
   * @default [1, 1, 1]
   */
  color: [r: number, g: number, b: number];

  /**
   * @default 1
   */
  intensity: number;
  position: [x: number, y: number];

  /**
   * @default 40
   */
  radius: number;
};

export type PointLightSystem = {
  storageBuffer: GPUBuffer;
  amountUniformBuffer: GPUBuffer;
  addLight: (
    light: Pick<PointLight, 'position'> & Partial<PointLight>,
  ) => PointLight;
  updateLight: (light: PointLight) => PointLight;
  removeLight: (light: PointLight) => void;
};

const FLOATS_PER_LIGHT = 8; // 3 for color, 1 for intensity, 2 for position, 2 for padding

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
      return light;
    }

    const offset = index * FLOATS_PER_LIGHT * Float32Array.BYTES_PER_ELEMENT;
    storage.set(light.color, offset);
    storage.set([light.intensity], offset + 3);
    storage.set(light.position, offset + 4);
    storage.set([light.radius], offset + 6);

    device.queue.writeBuffer(
      storageBuffer,
      offset,
      storage.subarray(offset, offset + FLOATS_PER_LIGHT),
    );
    return light;
  };

  const setDefaults = (
    light: Pick<PointLight, 'position'> & Partial<PointLight>,
  ): PointLight => {
    light.radius = light.radius ?? 40;
    light.intensity = light.intensity ?? 1;
    light.color = light.color ?? [1, 1, 1];

    return light as PointLight;
  };

  return {
    storageBuffer,
    amountUniformBuffer,
    addLight: (
      inputLight: Pick<PointLight, 'position'> & Partial<PointLight>,
    ): PointLight => {
      if (lights.length >= maxLights) {
        // TODO: Grow the buffer
        throw new Error('Too many lights!');
      }

      const light = setDefaults(inputLight);

      const index = lights.length;
      dict.set(light, index);
      lights.push(light);

      updateLight(light);
      writeLength();
      return light;
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
