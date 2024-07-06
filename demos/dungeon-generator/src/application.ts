import { type Room, connectRooms, getRegions, randomGrid, smoothGrid } from '@pixel-craft/grid';
import { InputManager } from '@pixel-craft/input';
import { Vector2, random } from '@pixel-craft/math';
import { type Sprite, createContext, createTextureLoader, pipeline, sprite } from '@pixel-craft/renderer';
import { stringToFile } from '@pixel-craft/state';
import { Timer } from '@pixel-craft/timer';
import { generatorState } from './generator-state';

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
      cameraZoom = Math.min(Math.max(cameraZoom + scaled, 1), 4);
      context.camera.zoom({ x: cameraZoom, y: cameraZoom });
    },
    { passive: true },
  );

  const state = generatorState;

  const tileSize = 16;

  const whitePixel =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=';
  const textureFile = await stringToFile(whitePixel);
  const texture = await textureLoader(textureFile);

  let sprites: Sprite[] = [];

  const generateMap = () => {
    const rng = random(state.seed);
    const map = randomGrid({
      width: state.width,
      height: state.height,
      fillOptions: {
        fillEdges: true,
        threshold: 0.5,
        rng,
      },
    });

    for (let i = 0; i < state.smoothIterations; i++) {
      smoothGrid(map, 6, 3, 1);
    }

    const connect = () => {
      const regions = getRegions(map, 0);
      const rooms: Room[] = [];

      for (const region of regions) {
        if (region.length < state.cullSize) {
          for (const cell of region) {
            map[cell.x][cell.y] = 1;
          }
          continue;
        }

        rooms.push({
          cells: region,
          size: region.length,
          connections: new Set(),
        });
      }

      connectRooms(map, rooms);
    };

    connect();
    connect();

    sprites = [];

    for (let x = 0; x < state.width; x++) {
      for (let y = 0; y < state.height; y++) {
        sprites.push(
          sprite({
            texture,
            x: x * tileSize,
            y: y * tileSize,
            width: tileSize,
            height: tileSize,
            color: map[x][y] ? [0, 0, 0] : [1, 1, 1],
          }),
        );
      }
    }
  };

  generateMap();
  state.addEventListener('change', generateMap);

  const draw = (now: number) => {
    timer.update(now);

    const cameraBounds = {
      x: state.width * tileSize * cameraZoom,
      y: state.height * tileSize * cameraZoom,
    };

    cameraAnchor = cameraAnchor.add(input.direction.multiply(cameraSpeed * timer.deltaTime));
    cameraAnchor.x = Math.min(Math.max(cameraAnchor.x, 0), cameraBounds.x);
    cameraAnchor.y = Math.min(Math.max(cameraAnchor.y, 0), cameraBounds.y);
    context.camera.observe(cameraAnchor);

    renderPass(sprites.reverse());
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
