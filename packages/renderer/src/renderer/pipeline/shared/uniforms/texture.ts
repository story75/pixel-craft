type Uniform = {
  layout: GPUBindGroupLayout;
  bindGroup: (texture: GPUTexture, sampler: GPUSampler) => GPUBindGroup;
};

/**
 * Defines a texture bind group.
 *
 * @remarks
 * This bind group is used to bind a texture to a shader. Bind groups are created per texture.
 * The bind group layout is shared between all bind groups.
 */
export function texture(device: GPUDevice): Uniform {
  const textureBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {},
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {},
      },
    ],
  });

  return {
    layout: textureBindGroupLayout,
    bindGroup: (texture: GPUTexture, sampler: GPUSampler) =>
      device.createBindGroup({
        layout: textureBindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: sampler,
          },
          {
            binding: 1,
            resource: texture.createView(),
          },
        ],
      }),
  };
}
