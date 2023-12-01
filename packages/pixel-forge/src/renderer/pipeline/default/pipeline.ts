import { rotate, Vec2 } from '../../../math/vec2';
import { indexBufferAllocator } from '../../buffer/index-buffer-allocator';
import { vertexBufferAllocator } from '../../buffer/vertex-buffer-allocator';
import { WebGPUContext } from '../../context/create-context';
import { floatsPerSprite } from '../shared/constants';
import { createIndices } from '../shared/create-indices';
import { RenderPass } from '../shared/render-pass';
import { projectionViewMatrix } from '../shared/uniforms/projection-view-matrix';
import { texture } from '../shared/uniforms/texture';
import shader from './shader.wgsl';

/**
 * A batch of sprites that share the same texture.
 */
type Batch = {
  pipeline: GPURenderPipeline;
  instances: number;
  vertices: Float32Array;
  texture: GPUTexture;
};

/**
 * The maximum number of sprites that can be rendered in a single batch.
 * The limit is currently set to 10,000 sprites, but can be increased if needed. It is a tradeoff between memory usage and performance.
 */
const MAX_SPRITES_PER_BATCH = 10_000;

/**
 * The number of floats per vertex.
 * Each vertex has a position (x, y), a texture coordinate (u, v), a color (r, g, b) and an alpha (a).
 */
const FLOATS_PER_VERTEX = 8;

/**
 * The number of floats per sprite.
 * Each sprite is a quad, which has 4 unique vertices.
 */
const FLOATS_PER_SPRITE = floatsPerSprite(FLOATS_PER_VERTEX);

/**
 * Create a render pipeline that returns a render pass, which can be used to render a list of sprites.
 *
 * @remarks
 * This is a very simple forward render pipeline that renders unlit sprites. It's intended to be used as a starting point and
 * can be replaced with a more advanced render pipeline later on.
 *
 * @param pipelineContext - The WebGPU context.
 * @param projectionViewMatrixUniformBuffer - The projection view matrix uniform buffer.
 */
export function pipeline(
  pipelineContext: WebGPUContext,
  projectionViewMatrixUniformBuffer: GPUBuffer,
): RenderPass {
  const { device, context, presentationFormat } = pipelineContext;

  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: FLOATS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT, // x: f32, y: f32, u: f32, v: f32, r: f32, g: f32, b: f32, a: f32
    attributes: [
      {
        shaderLocation: 0,
        offset: 0,
        format: 'float32x2', // x: f32, y: f32
      },
      {
        shaderLocation: 1,
        offset: 2 * Float32Array.BYTES_PER_ELEMENT,
        format: 'float32x2', // u: f32, v: f32
      },
      {
        shaderLocation: 2,
        offset: 4 * Float32Array.BYTES_PER_ELEMENT,
        format: 'float32x4', // r: f32, g: f32, b: f32, a: f32
      },
    ],
    stepMode: 'vertex',
  };

  const projectionViewMatrixUniform = projectionViewMatrix(
    device,
    projectionViewMatrixUniformBuffer,
  );
  const textureUniform = texture(device);

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [
      projectionViewMatrixUniform.layout,
      textureUniform.layout,
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
        buffers: [vertexBufferLayout],
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

  const indices = createIndices(MAX_SPRITES_PER_BATCH);

  const vertexBufferAlloc = vertexBufferAllocator(device);
  const indexBuffer = indexBufferAllocator(device)(indices);

  const vertexBuffers = [
    vertexBufferAlloc(
      new Float32Array(MAX_SPRITES_PER_BATCH * FLOATS_PER_SPRITE),
    ),
  ];

  const textureBindGroups = new Map<GPUTexture, GPUBindGroup>();

  return (sprites) => {
    const batchMap = new Map<GPUTexture, Batch[]>();

    for (const sprite of sprites) {
      const texture = sprite.texture;

      let textureBindGroup = textureBindGroups.get(texture);
      if (!textureBindGroup) {
        textureBindGroup = textureUniform.bindGroup(sprite.texture);
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
          vertices: new Float32Array(MAX_SPRITES_PER_BATCH * FLOATS_PER_SPRITE),
          texture: sprite.texture,
        };
        batches.push(batch);
      }

      let topLeft: Vec2 = [sprite.x, sprite.y];
      let topRight: Vec2 = [sprite.x + sprite.width, sprite.y];
      let bottomRight: Vec2 = [
        sprite.x + sprite.width,
        sprite.y + sprite.height,
      ];
      let bottomLeft: Vec2 = [sprite.x, sprite.y + sprite.height];

      if (sprite.rotation) {
        const origin: Vec2 = [
          sprite.x + sprite.origin[0] * sprite.width,
          sprite.y + sprite.origin[1] * sprite.height,
        ];

        topLeft = rotate(topLeft, origin, sprite.rotation);
        topRight = rotate(topRight, origin, sprite.rotation);
        bottomRight = rotate(bottomRight, origin, sprite.rotation);
        bottomLeft = rotate(bottomLeft, origin, sprite.rotation);
      }

      const u: Vec2 = [
        sprite.frame.x / sprite.texture.width,
        (sprite.frame.x + sprite.frame.width) / sprite.texture.width,
      ];
      const v: Vec2 = [
        sprite.frame.y / sprite.texture.height,
        (sprite.frame.y + sprite.frame.height) / sprite.texture.height,
      ];

      if (sprite.flip[0]) {
        u[0] = 1 - u[0];
        u[1] = 1 - u[1];
      }

      if (sprite.flip[1]) {
        v[0] = 1 - v[0];
        v[1] = 1 - v[1];
      }

      if ('offset' in sprite) {
        u[0] += sprite.offset[0];
        u[1] += sprite.offset[0];
        v[0] += sprite.offset[1];
        v[1] += sprite.offset[1];
      }

      const i = batch.instances * FLOATS_PER_SPRITE;
      // top left
      batch.vertices[0 + i] = topLeft[0];
      batch.vertices[1 + i] = topLeft[1];
      batch.vertices[2 + i] = u[0];
      batch.vertices[3 + i] = v[0];
      batch.vertices[4 + i] = sprite.color[0];
      batch.vertices[5 + i] = sprite.color[1];
      batch.vertices[6 + i] = sprite.color[2];
      batch.vertices[7 + i] = sprite.alpha;

      // top right
      batch.vertices[8 + i] = topRight[0];
      batch.vertices[9 + i] = topRight[1];
      batch.vertices[10 + i] = u[1];
      batch.vertices[11 + i] = v[0];
      batch.vertices[12 + i] = sprite.color[0];
      batch.vertices[13 + i] = sprite.color[1];
      batch.vertices[14 + i] = sprite.color[2];
      batch.vertices[15 + i] = sprite.alpha;

      // bottom right
      batch.vertices[16 + i] = bottomRight[0];
      batch.vertices[17 + i] = bottomRight[1];
      batch.vertices[18 + i] = u[1];
      batch.vertices[19 + i] = v[1];
      batch.vertices[20 + i] = sprite.color[0];
      batch.vertices[21 + i] = sprite.color[1];
      batch.vertices[22 + i] = sprite.color[2];
      batch.vertices[23 + i] = sprite.alpha;

      // bottom left
      batch.vertices[24 + i] = bottomLeft[0];
      batch.vertices[25 + i] = bottomLeft[1];
      batch.vertices[26 + i] = u[0];
      batch.vertices[27 + i] = v[1];
      batch.vertices[28 + i] = sprite.color[0];
      batch.vertices[29 + i] = sprite.color[1];
      batch.vertices[30 + i] = sprite.color[2];
      batch.vertices[31 + i] = sprite.alpha;

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

    const usedVertexBuffers: GPUBuffer[] = [];

    for (const batches of batchMap.values()) {
      for (const batch of batches) {
        let vertexBuffer = vertexBuffers.pop();
        if (!vertexBuffer) {
          vertexBuffer = vertexBufferAlloc(
            new Float32Array(MAX_SPRITES_PER_BATCH * FLOATS_PER_SPRITE),
          );
        }
        device.queue.writeBuffer(vertexBuffer, 0, batch.vertices);
        usedVertexBuffers.push(vertexBuffer);

        const textureBindGroup = textureBindGroups.get(batch.texture);
        if (!textureBindGroup) {
          throw new Error('Texture bind group not found!');
        }

        passEncoder.setPipeline(batch.pipeline);
        passEncoder.setIndexBuffer(indexBuffer, 'uint16');
        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.setBindGroup(0, projectionViewMatrixUniform.bindGroup);
        passEncoder.setBindGroup(1, textureBindGroup);
        passEncoder.drawIndexed(6 * batch.instances);
      }
    }

    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    for (const vertexBuffer of usedVertexBuffers) {
      vertexBuffers.push(vertexBuffer);
    }
  };
}
