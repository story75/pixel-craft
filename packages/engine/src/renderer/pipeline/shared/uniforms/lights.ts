type Uniform = {
  layout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
};

/**
 * Defines a lights bind group.
 */
export function lights(
  device: GPUDevice,
  globalLightUniformBuffer: GPUBuffer,
  gBuffer: GPUTexture,
): Uniform {
  const globalLightLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'unfilterable-float',
        },
      },
    ],
  });

  const globalLightBindGroup = device.createBindGroup({
    layout: globalLightLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: globalLightUniformBuffer,
        },
      },
      {
        binding: 1,
        resource: gBuffer.createView(),
      },
    ],
  });

  return {
    layout: globalLightLayout,
    bindGroup: globalLightBindGroup,
  };
}
