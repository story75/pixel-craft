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
  pointLights: { amount: GPUBuffer; lights: GPUBuffer },
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
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: 'read-only-storage',
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
      {
        binding: 2,
        resource: {
          buffer: pointLights.amount,
        },
      },
      {
        binding: 3,
        resource: {
          buffer: pointLights.lights,
        },
      },
    ],
  });

  return {
    layout: globalLightLayout,
    bindGroup: globalLightBindGroup,
  };
}
