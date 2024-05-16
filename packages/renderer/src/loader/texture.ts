import { textureAllocator } from '../renderer/buffer/texture-allocator';

/**
 * Load a texture by path.
 *
 * @remarks
 * The loader will cache textures to avoid loading the same texture multiple times.
 * The cache key is the path.
 *
 * @param path:string - The path to load the asset from. Can either be relative from the host or a full url.
 * @param path:File - A file to convert to a texture. This will not be cached.
 */
export type TextureLoader = (path: string | File) => Promise<GPUTexture>;

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
  const allocator = textureAllocator(device);

  return async (path) => {
    if (path instanceof File) {
      const imageBitmap = await createImageBitmap(path);
      return allocator(imageBitmap);
    }

    const cached = cache.get(path);
    if (cached) {
      return cached;
    }

    const response = await fetch(path);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    const texture = allocator(imageBitmap);

    cache.set(path, texture);
    return texture;
  };
}
