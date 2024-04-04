import {
  createContext,
  pipeline,
  RenderPass,
  Sprite,
  WebGPUContext,
} from '@pixel-craft/engine';

type Scene = () => Promise<void>;

export class Application {
  private currentScene?: Scene;
  private readonly sprites = new Set<Sprite>();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: WebGPUContext,
    private readonly renderPass: RenderPass,
  ) {
    const draw = (_now: number) => {
      renderPass(this.sprites.values());
      requestAnimationFrame(draw);
    };

    draw(performance.now());
  }

  static async create(canvas: HTMLCanvasElement): Promise<Application> {
    const context = await createContext(canvas);
    const renderPass = pipeline(context);

    return new Application(canvas, context, renderPass);
  }

  add(...sprites: Sprite[]): void {
    for (const sprite of sprites) {
      this.sprites.add(sprite);
    }
  }

  remove(...sprites: Sprite[]): void {
    for (const sprite of sprites) {
      this.sprites.delete(sprite);
    }
  }

  async load(scene: Scene): Promise<void> {
    this.remove(...this.sprites.values());
    this.currentScene = scene;
    await scene();
  }
}
