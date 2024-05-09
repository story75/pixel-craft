/**
 * Creates a uniform buffer allocator for the given device.
 *
 * @remarks
 * Passed data is not mapped to the GPU buffer, but only used for sizing.
 * The buffer has to be written to manually via device.queue.writeBuffer.
 *
 * @param device
 */
export function uniformBufferAllocator(device: GPUDevice) {
  return (data: Float32Array | Uint32Array): GPUBuffer => {
    return device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  };
}
