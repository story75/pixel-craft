type Uniform = {
  layout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
};

/**
 * Defines a projection view matrix bind group.
 *
 * @param device
 * @param projectionViewMatrixUniformBuffer
 */
export function projectionViewMatrix(
  device: GPUDevice,
  projectionViewMatrixUniformBuffer: GPUBuffer,
): Uniform {
  const projectionViewMatrixLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform',
        },
      },
    ],
  });

  const projectionViewMatrixBindGroup = device.createBindGroup({
    layout: projectionViewMatrixLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: projectionViewMatrixUniformBuffer,
        },
      },
    ],
  });

  return {
    layout: projectionViewMatrixLayout,
    bindGroup: projectionViewMatrixBindGroup,
  };
}
