/**
 * Creates a texture allocator for the given device.
 *
 * @remarks
 * Passed data is automatically mapped to the GPU texture.
 *
 * @param device
 */
export function textureAllocator(device: GPUDevice) {
  return (data: ImageBitmap | HTMLCanvasElement): GPUTexture => {
    // createTexture just creates an empty buffer which has to be filled
    const texture = device.createTexture({
      size: [data.width, data.height, 1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture({ source: data }, { texture }, [data.width, data.height]);

    return texture;
  };
}
