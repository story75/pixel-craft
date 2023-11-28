import { texture } from '../loader';
import { lookAt, multiply, orthographic } from '../math';
import {uniformBufferAllocator} from "../renderer/buffer/uniform-buffer-allocator";
import {pipeline} from "../renderer/pipeline/2d-pixel/pipeline";
import {Sprite, sprite} from "../sprite";
import Stats from "stats.js";

export async function application(canvas: HTMLCanvasElement) {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

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

  const projectionMatrix = orthographic(
      0,
      canvas.width,
      canvas.height,
      0,
      -1,
      1,
  );
  const viewMatrix = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
  const projectionViewMatrix = multiply(viewMatrix, projectionMatrix);

  const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(new Float32Array(16));

  const textureLoader = texture(device);
  const tex = await textureLoader('assets/pixel-prowlers.png');

  const renderPass = pipeline(device, context, projectionViewMatrixUniformBuffer);

  device.queue.writeBuffer(
      projectionViewMatrixUniformBuffer,
      0,
      new Float32Array(projectionViewMatrix),
  );

  const sprites: Sprite[] = [];

  sprites.push(sprite({
    texture: tex,
    x: 300,
    y: 300,
    origin: [0, 0],
  }));
  sprites.push(sprite({
    texture: tex,
    x: 300,
    y: 300,
    origin: [0, 1],
  }));
  sprites.push(sprite({
    texture: tex,
    x: 300,
    y: 300,
    origin: [1, 0],
  }));
  sprites.push(sprite({
    texture: tex,
    x: 300,
    y: 300,
    origin: [1, 1],
  }));
  sprites.push(sprite({
    texture: tex,
    x: 300,
    y: 300,
    origin: [0.5, 0.5],
  }));

  const draw = function (time: number) {
    stats.begin();

    for (const sprite of sprites) {
      sprite.rotation += 0.01;
    }

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw(0);
}
