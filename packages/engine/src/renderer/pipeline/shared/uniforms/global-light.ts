type Uniform = {
  layout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
};

/**
 * Defines a global light bind group.
 */
export function globalLight(
  device: GPUDevice,
  globalLightUniformBuffer: GPUBuffer,
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
    ],
  });

  return {
    layout: globalLightLayout,
    bindGroup: globalLightBindGroup,
  };
}
