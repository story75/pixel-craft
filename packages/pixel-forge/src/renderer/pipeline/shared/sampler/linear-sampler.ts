/**
 * Create a sampler which uses linear filtering. This is the most suitable mode for text.
 *
 * @see https://gpuweb.github.io/gpuweb/#dom-gpufiltermode-linear
 *
 * @param device
 */
export function linearSampler(device: GPUDevice): GPUSampler {
  return device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  });
}
