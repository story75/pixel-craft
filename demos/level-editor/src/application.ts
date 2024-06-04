import { Sprite, createContext, createTextureLoader, pipeline } from '@pixel-craft/renderer';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const context = await createContext(canvas);

  const _textureLoader = createTextureLoader(context.device);

  const renderPass = pipeline(context);
  const sprites: Sprite[] = [];

  const draw = function (_now: number) {
    renderPass(sprites);
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
