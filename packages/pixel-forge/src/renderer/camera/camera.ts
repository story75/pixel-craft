import {
  lookAt,
  multiply,
  orthographic,
  scale,
  translate,
} from '../../math/mat4';
import { Vec2 } from '../../math/vec2';
import { Vec3 } from '../../math/vec3';
import { multiply as multiplyVec4 } from '../../math/vec4';
import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

export type Camera = {
  projectionViewMatrixUniformBuffer: GPUBuffer;
  observe: (position: Vec2) => void;
  zoom: (scaling: Vec2) => void;
};

/**
 * Creates a projection view matrix uniform buffer with the given width and height.
 *
 * @remarks
 * This is a convenience function for creating an orthographic projection view matrix uniform buffer.
 * The projection view matrix is calculated using the given width and height.
 * The buffer is written to the GPU queue on creation.
 *
 * @param device
 * @param width
 * @param height
 */
export function createCamera(
  device: GPUDevice,
  width: number,
  height: number,
): Camera {
  const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(
    new Float32Array(16),
  );

  let scaling: Vec3 = [1, 1, 1];
  let position: Vec2 = [0, 0];
  const projectionMatrix = orthographic(0, width, height, 0, -1, 1);
  const viewMatrix = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
  const projectionViewMatrix = multiply(viewMatrix, projectionMatrix);

  const observe = ([x, y]: Vec2) => {
    position = [x, y];
    update();
  };

  const zoom = ([x, y]: Vec2) => {
    scaling = [x, y, 1];
    update();
  };

  const update = () => {
    const [x, y] = position;
    const [t0, t1, t2] = multiplyVec4(projectionMatrix, [-x, -y, 0, 1]);
    const translated = translate(projectionViewMatrix, [t0, t1, t2]);
    const scaled = scale(translated, scaling);

    device.queue.writeBuffer(
      projectionViewMatrixUniformBuffer,
      0,
      new Float32Array(scaled),
    );
  };

  update();

  return {
    projectionViewMatrixUniformBuffer,
    observe,
    zoom,
  };
}
