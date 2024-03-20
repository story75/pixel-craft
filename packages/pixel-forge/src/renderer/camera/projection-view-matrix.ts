import { lookAt, multiply, orthographic, translate } from '../../math/mat4';
import { Vec2 } from '../../math/vec2';
import { multiply as multiplyVec4 } from '../../math/vec4';
import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

export type Camera = {
  projectionViewMatrixUniformBuffer: GPUBuffer;
  observe: (position: Vec2) => void;
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
export function projectionViewMatrix(
  device: GPUDevice,
  width: number,
  height: number,
): Camera {
  const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(
    new Float32Array(16),
  );

  const projectionMatrix = orthographic(0, width, height, 0, -1, 1);
  const viewMatrix = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
  const projectionViewMatrix = multiply(viewMatrix, projectionMatrix);

  const observe = ([x, y]: Vec2) => {
    const [t0, t1, t2] = multiplyVec4(projectionMatrix, [-x, -y, 0, 1]);
    const translated = translate(projectionViewMatrix, [t0, t1, t2]);

    device.queue.writeBuffer(
      projectionViewMatrixUniformBuffer,
      0,
      new Float32Array(translated),
    );
  };

  observe([0, 0]);

  return {
    projectionViewMatrixUniformBuffer,
    observe,
  };
}
