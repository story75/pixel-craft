import { Mat4, Vector2, type Vector2Like, Vector3, Vector4 } from '@pixel-craft/math';
import { uniformBufferAllocator } from '../buffer/uniform-buffer-allocator';

export type Camera = {
  projectionViewMatrixUniformBuffer: GPUBuffer;
  transformUniformBuffer: GPUBuffer;
  observe: (position: Vector2Like) => void;
  zoom: (scaling: Vector2Like) => void;
};

/**
 * Creates a projection view matrix uniform buffer with the given width and height.
 *
 * @remarks
 * This is a convenience function for creating an orthographic projection view matrix uniform buffer.
 * The projection view matrix is calculated using the given width and height.
 * The buffer is written to the GPU queue on creation.
 */
export function createCamera(device: GPUDevice, width: number, height: number): Camera {
  const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(
    new Float32Array(16 * Float32Array.BYTES_PER_ELEMENT),
  );
  const transformUniformBuffer = uniformBufferAllocator(device)(new Float32Array(4 * Float32Array.BYTES_PER_ELEMENT));

  const scaling = new Vector3({ x: 1, y: 1, z: 1 });
  const position = new Vector2({ x: 0, y: 0 });
  const projectionMatrix = Mat4.orthographic(0, width, height, 0, -1, 1);
  const viewMatrix = Mat4.lookAt(
    new Vector3({ x: 0, y: 0, z: 1 }),
    new Vector3({ x: 0, y: 0, z: 0 }),
    new Vector3({ x: 0, y: 1, z: 0 }),
  );

  const observe = ({ x, y }: Vector2Like) => {
    position.x = x;
    position.y = y;
    update();
  };

  const zoom = ({ x, y }: Vector2Like) => {
    scaling.x = x;
    scaling.y = y;
    update();
  };

  const update = () => {
    const translation = new Vector4({
      x: -position.x,
      y: -position.y,
      z: 0,
      w: 1,
    }).multiply(projectionMatrix);

    const projectionViewMatrix = new Mat4(viewMatrix).multiply(projectionMatrix).translate(translation).scale(scaling);

    device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);
    device.queue.writeBuffer(
      transformUniformBuffer,
      0,
      new Float32Array([-position.x, -position.y, scaling.x, scaling.y]),
    );
  };

  update();

  return {
    projectionViewMatrixUniformBuffer,
    transformUniformBuffer,
    observe,
    zoom,
  };
}
