type Uniform = {
  layout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
};

/**
 * Defines a camera transform bind group.
 */
export function cameraTransform(
  device: GPUDevice,
  transformUniformBuffer: GPUBuffer,
): Uniform {
  const cameraTransformLayout = device.createBindGroupLayout({
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

  const cameraTransformBindGroup = device.createBindGroup({
    layout: cameraTransformLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: transformUniformBuffer,
        },
      },
    ],
  });

  return {
    layout: cameraTransformLayout,
    bindGroup: cameraTransformBindGroup,
  };
}
