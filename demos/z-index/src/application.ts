import { createContext, createTextureLoader, pipeline, Sprite, sprite } from '@pixel-craft/renderer';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);

  context.camera.zoom({ x: 4, y: 4 });

  const texture = await textureLoader('assets/pixel-craft/pixel-prowlers.png');
  const spriteAmount = 10;

  const sprites: Sprite[] = [];

  for (let i = 0; i < spriteAmount; i++) {
    sprites.push(
      sprite({
        texture,
        x: i * 15,
        y: i * 15,
        z: 0.01 + i / spriteAmount,
      }),
    );
  }

  const renderPass = pipeline(context);

  const gameLoop = (now: number) => {
    renderPass(sprites);
    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
