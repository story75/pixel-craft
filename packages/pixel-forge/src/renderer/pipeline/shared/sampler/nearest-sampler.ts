/**
 * Create a sampler which uses nearest filtering. This is the most suitable mode for pixel art.
 *
 * @see https://gpuweb.github.io/gpuweb/#dom-gpufiltermode-nearest
 *
 * @param device
 */
export function nearestSampler(device: GPUDevice): GPUSampler {
  return device.createSampler({
    magFilter: 'nearest',
    minFilter: 'nearest',
  });
}
