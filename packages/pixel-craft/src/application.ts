import {
  createContext,
  pipeline,
  RenderPass,
  WebGPUContext,
} from '@pixel-craft/engine';

export class Application {
  private readonly renderPass: RenderPass;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: WebGPUContext,
  ) {
    this.renderPass = pipeline(context);
  }

  static async create(canvas: HTMLCanvasElement): Promise<Application> {
    const context = await createContext(canvas);

    return new Application(canvas, context);
  }
}
