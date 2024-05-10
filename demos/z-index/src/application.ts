import { Application, RenderSystem } from '@pixel-craft/pixel-craft';
import { sprite } from '@pixel-craft/renderer';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const app = await Application.create(canvas);
  const renderer = new RenderSystem();
  await app.addSystems(renderer);

  app.context.camera.zoom({ x: 4, y: 4 });

  const texture = await app.loadTexture('assets/pixel-craft/pixel-prowlers.png');
  const sprites = 10;

  for (let i = 0; i < sprites; i++) {
    app.addGameObjects(
      sprite({
        texture,
        x: i * 15,
        y: i * 15,
        z: 0.01 + i / sprites,
      }),
    );
  }
}
