/**
 * Load a texture by path.
 *
 * @remarks
 * The loader will cache textures to avoid loading the same texture multiple times.
 * The cache key is the path.
 *
 * @param path - The path to load the asset from. Can either be relative from the host or a full url.
 */
export type TextureLoader = (path: string) => Promise<GPUTexture>;

/**
 * Create a texture loader with a given GPUDevice.
 *
 * @remarks
 * Textures are bound to the device they're created with.
 *
 * @param device - The GPUDevice to use
 */
export function createTextureLoader(device: GPUDevice): TextureLoader {
  const cache = new Map<string, GPUTexture>();

  return async (path) => {
    const cached = cache.get(path);
    if (cached) {
      return cached;
    }

    const response = await fetch(path);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    // createTexture just creates an empty buffer which has to be filled
    const texture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture },
      [imageBitmap.width, imageBitmap.height],
    );

    cache.set(path, texture);
    return texture;
  };
}
