/**
 * Creates a vertex buffer allocator for the given device.
 *
 * @remarks
 * Passed data is automatically mapped to the GPU buffer.
 *
 * @param device
 */
export function vertexBufferAllocator(device: GPUDevice) {
  return (data: Float32Array): GPUBuffer => {
    const buffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  };
}
