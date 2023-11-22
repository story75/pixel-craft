import * as buffer from "buffer";
import {texture} from "../loader";

export async function application(canvas: HTMLCanvasElement) {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error('Could not request WebGPU adapter!');
    }

    const device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu');
    if (!context) {
        throw new Error('Could not request WebGPU context!');
    }

    const devicePixelRatio = window.devicePixelRatio;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
    });

    const sampler = device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest',
    });

    const createVertexBuffer = (data: Float32Array) => {
        const vertexBuffer = device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        new Float32Array(vertexBuffer.getMappedRange()).set(data);
        vertexBuffer.unmap();
        return vertexBuffer;
    };

    const positionVertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT, // x: f32, y: f32
        attributes: [{
            shaderLocation: 0,
            offset: 0,
            format: 'float32x2',
        }],
        stepMode: 'vertex',
    };

    const colorVertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 3 * Float32Array.BYTES_PER_ELEMENT, // r: f32, g: f32, b: f32
        attributes: [{
            shaderLocation: 1,
            offset: 0,
            format: 'float32x3',
        }],
        stepMode: 'vertex',
    };

    const uvVertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT, // u: f32, v: f32
        attributes: [{
            shaderLocation: 2,
            offset: 0,
            format: 'float32x2',
        }],
        stepMode: 'vertex',
    };

    const position = createVertexBuffer(new Float32Array([
        -0.5, -0.5, // x: f32, y: f32
        0.5, -0.5,
        -0.5, 0.5,

        -0.5, 0.5,
        0.5, 0.5,
        0.5, -0.5,
    ]));

    const color = createVertexBuffer(new Float32Array([
        1.0, 1.0, 1.0, // r: f32, g: f32, b: f32
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,

        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
    ]));

    const uv = createVertexBuffer(new Float32Array([
        0.0, 1.0, // x: f32, y: f32
        1.0, 1.0,
        0.0, 0.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
    ]));

    const textureLoader = texture(device);
    const tex = await textureLoader('assets/pixel-prowlers.png');

    const shader = `struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
    @location(1) uv: vec2f,
}

@group(0) @binding(0)
var texture_sampler: sampler;

@group(0) @binding(1)
var texture: texture_2d<f32>;

@vertex
fn vs_main(
  @location(0) position: vec2f, // x: f32, y: f32,
  @location(1) color: vec3f, // r: f32, g: f32, b: f32
  @location(2) uv: vec2f, // u: f32, v: f32
) -> VertexOutput {
  var output: VertexOutput;
  
  output.position = vec4f(position, 0.0, 1.0);
  output.color = vec4f(color, 1.0);
  output.uv = uv;

  return output;
}

@fragment
fn fs_main(output: VertexOutput) -> @location(0) vec4f {
  var texture_color = textureSample(texture, texture_sampler, output.uv);
  return texture_color * output.color;
}`;

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

    const textureBindGroup = device.createBindGroup({
        layout: textureBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: sampler,
            },
            {
                binding: 1,
                resource: tex.createView(),
            },
        ],
    });

    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [textureBindGroupLayout],
    });

    const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module: device.createShaderModule({
                code: shader,
            }),
            entryPoint: 'vs_main',
            buffers: [
                positionVertexBufferLayout,
                colorVertexBufferLayout,
                uvVertexBufferLayout,
            ],
        },
        fragment: {
            module: device.createShaderModule({
                code: shader,
            }),
            entryPoint: 'fs_main',
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
                    }
                },
            ],
        },
        primitive: {
            topology: 'triangle-list',
        },
    });


    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: textureView,
                clearValue: {r: 0.8, g: 0.8, b: 0.8, a: 1.0},
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, position);
    passEncoder.setVertexBuffer(1, color);
    passEncoder.setVertexBuffer(2, uv);
    passEncoder.setBindGroup(0, textureBindGroup);
    passEncoder.draw(6);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
}