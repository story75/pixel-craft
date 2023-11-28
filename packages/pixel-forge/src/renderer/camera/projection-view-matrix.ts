import { lookAt, multiply, orthographic } from '../../math/mat4';
import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

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
): GPUBuffer {
  const projectionMatrix = orthographic(0, width, height, 0, -1, 1);
  const viewMatrix = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
  const projectionViewMatrix = multiply(viewMatrix, projectionMatrix);

  const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(
    new Float32Array(16),
  );

  device.queue.writeBuffer(
    projectionViewMatrixUniformBuffer,
    0,
    new Float32Array(projectionViewMatrix),
  );

  return projectionViewMatrixUniformBuffer;
}
