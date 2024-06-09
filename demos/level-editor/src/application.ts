import { InputManager } from '@pixel-craft/input';
import { Vector2 } from '@pixel-craft/math';
import { Sprite, createContext, createTextureLoader, pipeline, sprite } from '@pixel-craft/renderer';
import { Timer } from '@pixel-craft/timer';
import { editorState } from './editor-state';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);
  const renderPass = pipeline(context);
  const timer = new Timer();
  const input = new InputManager();

  let cameraAnchor = new Vector2({ x: 0, y: 0 });
  const cameraSpeed = 10;
  let cameraZoom = 1;

  canvas.addEventListener(
    'wheel',
    (event) => {
      const scaled = event.deltaY / 100;
      cameraZoom = Math.min(Math.max(cameraZoom + scaled, 1), 8);
      context.camera.zoom({ x: cameraZoom, y: cameraZoom });
    },
    { passive: true },
  );

  const state = editorState;
  let texture: GPUTexture | undefined;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  state.addEventListener('change', async (event) => {
    if (event.detail.property === 'tilesetFile' && event.detail.value instanceof File) {
      texture = await textureLoader(event.detail.value);
    }
  });

  const draw = function (now: number) {
    timer.update(now);

    const cameraBounds = {
      x: state.width * state.tileSize,
      y: (state.height * state.tileSize) / 4,
    };

    cameraAnchor = cameraAnchor.add(input.direction.multiply(cameraSpeed * timer.deltaTime));
    cameraAnchor.x = Math.min(Math.max(cameraAnchor.x, -cameraBounds.x), cameraBounds.x);
    cameraAnchor.y = Math.min(Math.max(cameraAnchor.y, -cameraBounds.y), cameraBounds.y);
    context.camera.observe(cameraAnchor);

    if (!texture) {
      requestAnimationFrame(draw);
      return;
    }

    const sprites: Sprite[] = [];
    for (let layer = 0; layer < state.map.length; layer++) {
      for (let y = 0; y < state.height; y++) {
        for (let x = 0; x < state.width; x++) {
          const tileIndex = state.map[layer][x][y];
          if (!tileIndex && tileIndex !== 0) {
            continue;
          }

          const layerCorrectedX = x - layer;
          const layerCorrectedY = y - layer;

          const mapOffsetX = state.tileSize * (state.width / 2);

          const tileX = (layerCorrectedX * state.tileSize) / 2 + (layerCorrectedY * -state.tileSize) / 2;
          const tileY = (layerCorrectedX * state.tileSize) / 4 + (layerCorrectedY * state.tileSize) / 4;

          sprites.push(
            sprite({
              texture,
              x: mapOffsetX + tileX,
              y: tileY,
              frame: state.palette[tileIndex],
            }),
          );
        }
      }
    }

    renderPass(sprites.reverse());
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
