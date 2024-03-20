import { Vec2 } from '../../../math/vec2';
import { Vec4 } from '../../../math/vec4';
import { indexBufferAllocator } from '../../buffer/index-buffer-allocator';
import { uniformBufferAllocator } from '../../buffer/uniform-buffer-allocator';
import { WebGPUContext } from '../../context/create-context';
import { createIndices } from '../shared/create-indices';
import { RenderPass } from '../shared/render-pass';
import { linearSampler } from '../shared/sampler/linear-sampler';
import { nearestSampler } from '../shared/sampler/nearest-sampler';
import { projectionViewMatrix } from '../shared/uniforms/projection-view-matrix';
import { texture } from '../shared/uniforms/texture';
import shader from './shader.wgsl';

/**
 * A batch of sprites that share the same texture.
 */
type Batch = {
  pipeline: GPURenderPipeline;
  instances: number;
  instanceData: Float32Array;
  texture: GPUTexture;
};

/**
 * The maximum number of sprites that can be rendered in a single batch.
 * The limit is currently set to 10,000 sprites, but can be increased if needed. It is a tradeoff between memory usage and performance.
 */
const MAX_SPRITES_PER_BATCH = 1_000;

/**
 * Instance data struct for the shader.
 */
type InstanceData = {
  /**
   * The transform of the sprite.
   *
   * @remarks
   * The transform consists of the x and y position of the sprite, and the width and height of the sprite.
   */
  transform: Vec4;

  /**
   * The frame of the sprite.
   *
   * @remarks
   * The frame consists of the x and y position of the frame, and the width and height of the frame.
   */
  frame: Vec4;

  /**
   * The rotation of the sprite in radians.
   */
  rotation: number;

  /**
   * Flip the sprite in the x and y direction.
   *
   * @remarks
   * The flip value is a number between 0 and 3, with 0 being no flip, 1 being flip in the x direction, 2 being flip in the y direction, and 3 being flip in both the x and y direction.
   */
  flip: 0 | 1 | 2 | 3;

  /**
   * The offset of the texture.
   *
   * @remarks
   * The offset indicates how much to offset the texture in the x and y direction.
   * The value is a percentage value, with 0 being no offset, and 1 being the full width or height of the texture.
   */
  offset: Vec2;

  /**
   * The color of the sprite.
   *
   * @remarks
   * The color is a vec4, with the first 3 values being the red, green, and blue color channels, and the last value being the alpha channel.
   */
  color: Vec4;
};

/**
 * The number of floats per sprite.
 *
 * @remarks
 * Each sprite has an instance of InstanceData, which has 16 floats.
 */
const FLOATS_PER_SPRITE = 16;

/**
 * Create a render pipeline that returns a render pass, which can be used to render a list of sprites.
 *
 * @remarks
 * This is a very simple forward render pipeline that renders unlit sprites. It's intended to be used as a starting point and
 * can be replaced with a more advanced render pipeline later on.
 *
 * @param pipelineContext - The WebGPU context.
 */
export function pipeline({
  device,
  context,
  presentationFormat,
  projectionViewMatrixUniformBuffer,
}: WebGPUContext): RenderPass {
  const projectionViewMatrixUniform = projectionViewMatrix(
    device,
    projectionViewMatrixUniformBuffer,
  );
  const textureUniform = texture(device);
  const instanceDataUniformLayout = device.createBindGroupLayout({
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

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [
      projectionViewMatrixUniform.layout,
      textureUniform.layout,
      instanceDataUniformLayout,
    ],
  });

  const shaderModule = device.createShaderModule({
    // ESLint doesn't recognize the `wgsl` extension as a string, even though we defined the module as string in `wgsl.d.ts`.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    code: shader,
  });

  const pipeline = (vertex = 'vs_main', fragment = 'fs_main') =>
    device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: vertex,
      },
      fragment: {
        module: shaderModule,
        entryPoint: fragment,
        targets: [
          {
            format: presentationFormat,
            blend: {
              color: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
            },
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

  const spritePipeline = pipeline('vs_main', 'fs_main');
  const parallaxPipeline = pipeline('vs_main', 'fs_repeating');

  const indices = createIndices(1);

  const instanceDataBufferAlloc = uniformBufferAllocator(device);
  const indexBuffer = indexBufferAllocator(device)(indices);

  const textureBindGroups = new Map<GPUTexture, GPUBindGroup>();
  const defaultSampler = nearestSampler(device);
  const textSampler = linearSampler(device);

  const instanceDataBuffer = instanceDataBufferAlloc(
      new Float32Array(MAX_SPRITES_PER_BATCH * FLOATS_PER_SPRITE),
  );

  const instanceDataBindGroup = device.createBindGroup({
    layout: instanceDataUniformLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: instanceDataBuffer,
        },
      },
    ],
  });

  return (sprites) => {
    const batchMap = new Map<GPUTexture, Batch[]>();

    for (const sprite of sprites) {
      const texture = sprite.texture;

      let textureBindGroup = textureBindGroups.get(texture);
      if (!textureBindGroup) {
        textureBindGroup = textureUniform.bindGroup(
          sprite.texture,
          sprite.sampler === 'nearest' ? defaultSampler : textSampler,
        );
        textureBindGroups.set(texture, textureBindGroup);
      }

      let batches = batchMap.get(texture);
      if (!batches) {
        batches = [];
        batchMap.set(texture, batches);
      }

      let batch = batches.at(-1);
      if (!batch || batch.instances === MAX_SPRITES_PER_BATCH) {
        batch = {
          pipeline: 'mode' in sprite ? parallaxPipeline : spritePipeline,
          instances: 0,
          instanceData: new Float32Array(
            MAX_SPRITES_PER_BATCH * FLOATS_PER_SPRITE,
          ),
          texture: sprite.texture,
        };
        batches.push(batch);
      }

      const i = batch.instances * FLOATS_PER_SPRITE;

      batch.instanceData[0 + i] = sprite.x;
      batch.instanceData[1 + i] = sprite.y;
      batch.instanceData[2 + i] = sprite.width;
      batch.instanceData[3 + i] = sprite.height;
      batch.instanceData[4 + i] = sprite.frame.x;
      batch.instanceData[5 + i] = sprite.frame.y;
      batch.instanceData[6 + i] = sprite.frame.width;
      batch.instanceData[7 + i] = sprite.frame.height;
      batch.instanceData[8 + i] = sprite.rotation;
      batch.instanceData[9 + i] =
        Number(sprite.flip[0]) + Number(sprite.flip[1]) * 2;
      batch.instanceData[10 + i] = 'offset' in sprite ? Number(sprite.offset[0]) : 0;
      batch.instanceData[11 + i] = 'offset' in sprite ? Number(sprite.offset[1]) : 0;
      batch.instanceData[12 + i] = sprite.color[0];
      batch.instanceData[13 + i] = sprite.color[1];
      batch.instanceData[14 + i] = sprite.color[2];
      batch.instanceData[15 + i] = sprite.alpha;

      batch.instances++;
    }

    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    for (const batches of batchMap.values()) {
      for (const batch of batches) {
        device.queue.writeBuffer(instanceDataBuffer, 0, batch.instanceData);

        const textureBindGroup = textureBindGroups.get(batch.texture);
        if (!textureBindGroup) {
          throw new Error('Texture bind group not found!');
        }

        passEncoder.setPipeline(batch.pipeline);
        passEncoder.setIndexBuffer(indexBuffer, 'uint16');
        passEncoder.setBindGroup(0, projectionViewMatrixUniform.bindGroup);
        passEncoder.setBindGroup(1, textureBindGroup);
        passEncoder.setBindGroup(2, instanceDataBindGroup);
        passEncoder.drawIndexed(6, batch.instances);
      }
    }

    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  };
}
