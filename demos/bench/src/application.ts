import {
  Sprite,
  createContext,
  createTextureLoader,
  pipeline,
  sprite,
} from '@story75/pixel-forge';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const context = await createContext(canvas);

  const textureLoader = createTextureLoader(context.device);
  const texture = await textureLoader('assets/pixel-prowlers.png');

  const renderPass = pipeline(context);

  const sprites: Sprite[] = [];
  const amount = 200_000;

  for (let i = 0; i < amount; i++) {
    sprites.push(
      sprite({
        texture,
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
      }),
    );
  }

  // sprites.push(sprite({
  //   texture,
  //   x: 300,
  //   y: 300,
  // }));

  const draw = function () {
    stats.begin();

    for (let i = 0; i < amount; i++) {
      sprites[i].x = canvas.width * Math.random();
      sprites[i].y = canvas.height * Math.random();
    }

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw();
}
