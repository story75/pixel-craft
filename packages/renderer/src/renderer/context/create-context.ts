import { Camera, createCamera } from '../camera/camera';
import { GlobalLight, createGlobalLight } from '../lighting/global-light';
import { PointLightSystem, createPointLight } from '../lighting/point-light';

/**
 * Defines a WebGPU context.
 */
export type WebGPUContext = {
  device: GPUDevice;
  context: GPUCanvasContext;
  presentationFormat: GPUTextureFormat;
  camera: Camera;
  globalLight: GlobalLight;
  pointLight: PointLightSystem;
};

export type CreateContextOptions = {
  width?: number;
  height?: number;
};

/**
 * Creates a WebGPU context for a given canvas.
 *
 * @remarks
 * This function will request a WebGPU adapter and device, and create a WebGPU context for the given canvas.
 * The canvas will be resized to the window size, and the device pixel ratio will be taken into account.
 *
 * @throws Error if the WebGPU adapter or context could not be requested.
 */
export async function createContext(
  canvas: HTMLCanvasElement,
  options: CreateContextOptions = {},
): Promise<WebGPUContext> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('Could not request WebGPU adapter!');
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('Could not request WebGPU context!');
  }

  if (options.width && options.height) {
    canvas.width = options.width;
    canvas.height = options.height;
  } else {
    const devicePixelRatio = window.devicePixelRatio;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'premultiplied',
  });

  const camera = createCamera(device, canvas.width, canvas.height);
  const globalLight = createGlobalLight(device);
  const pointLight = createPointLight(device);

  return {
    device,
    context,
    presentationFormat,
    camera,
    globalLight,
    pointLight,
  };
}
