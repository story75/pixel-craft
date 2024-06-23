import { Animator, TransitionType } from '@pixel-craft/animator';
import { InputManager } from '@pixel-craft/input';
import { Point2, Vector2 } from '@pixel-craft/math';
import { createContext, createTextureLoader, pipeline, Sprite, sprite } from '@pixel-craft/renderer';
import { spriteParser } from '@pixel-craft/spritesheet';
import { Timer } from '@pixel-craft/timer';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);

  const sprites: Sprite[] = [];

  context.globalLight.intensity(0.2);

  const scaling: Point2 = { x: 4, y: 4 };
  context.camera.zoom(scaling);

  const [atlasFloor, atlasCharacters] = await Promise.all([
    textureLoader('assets/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png'),
    textureLoader('assets/0x72_DungeonTilesetII_v1.7/0x72_DungeonTilesetII_v1.7.png'),
  ]);

  const tileSize = 16;

  const tilesX = Math.ceil(canvas.width / tileSize / scaling.x);
  const tilesY = Math.ceil(canvas.height / tileSize / scaling.y);

  const redLight = context.pointLight.addLight({
    position: [100, 120],
    color: [1.0, 0.2, 0.2],
    intensity: 2,
    radius: 50,
  });
  const greenLight = context.pointLight.addLight({
    position: [125, 120],
    color: [0.2, 1, 0.2],
    intensity: 2,
    radius: 50,
  });
  const blueLight = context.pointLight.addLight({
    position: [120, 100],
    color: [0.2, 0.2, 1],
    intensity: 2,
    radius: 50,
  });
  const playerLight = context.pointLight.addLight({
    position: [120, 120],
    color: [0.5, 0.5, 0.5],
    radius: 30,
    intensity: 2,
  });
  const pulsingLight = context.pointLight.addLight({
    position: [400, 100],
    color: [0.5, 0.5, 0.5],
    radius: 100,
    intensity: 2,
  });

  const groundTileFrame = {
    x: 0,
    y: 0,
    width: tileSize,
    height: tileSize,
  };

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      sprites.push(
        sprite({
          texture: atlasFloor,
          x: x * tileSize,
          y: y * tileSize,
          frame: groundTileFrame,
        }),
      );
    }
  }

  const dino = spriteParser(
    {
      frameWidth: tileSize,
      frameHeight: tileSize * 2,
      x: (tilesX / 2) * tileSize,
      y: (tilesY / 2) * tileSize,
      z: 0.002,
      atlas: atlasCharacters,
      animations: [
        {
          name: 'idle',
          row: 6,
          frames: 4,
          startFrame: 8,
          speed: 5,
          interruptible: false,
          loop: true,
        },
        {
          name: 'run',
          row: 6,
          frames: 4,
          startFrame: 12,
          speed: 5,
          interruptible: false,
          loop: true,
        },
        {
          name: 'hit',
          row: 6,
          frames: 1,
          startFrame: 16,
          speed: 5,
          interruptible: true,
          loop: true,
        },
      ],
      transitions: [
        {
          from: { type: TransitionType.Entry },
          to: 'idle',
          condition: () => true,
        },
        {
          from: { type: TransitionType.Any },
          to: 'idle',
          condition: (state) => state.velocity.length() === 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'run',
          condition: (state) => state.velocity.length() !== 0,
        },
      ],
    },
    {
      velocity: new Vector2({ x: 0, y: 0 }),
      movementSpeed: 1,
    },
  );
  sprites.push(dino);

  const renderPass = pipeline(context);

  const timer = new Timer();
  const input = new InputManager();
  const animator = new Animator();

  const gameLoop = (now: number) => {
    timer.update(now);

    const velocity = input.direction.normal().multiply(dino.movementSpeed * timer.deltaTime);
    dino.velocity = velocity;
    dino.x += velocity.x;
    dino.y += velocity.y;

    playerLight.position = [dino.x + dino.width / 2, dino.y + dino.height / 2 + 5];
    context.pointLight.updateLight(playerLight);

    pulsingLight.intensity = Math.sin(performance.now() / 1000) * 2;
    context.pointLight.updateLight(pulsingLight);

    const anchor = [100, 100] as const;

    redLight.position = [
      anchor[0] + Math.sin(performance.now() / 1000) * 40,
      anchor[1] + Math.cos(performance.now() / 1000) * 40,
    ];
    greenLight.position = [
      anchor[0] + Math.sin(performance.now() / 1000 + Math.PI / 2) * 40,
      anchor[1] + Math.cos(performance.now() / 1000 + Math.PI / 2) * 40,
    ];
    blueLight.position = [
      anchor[0] + Math.sin(performance.now() / 1000 + Math.PI) * 40,
      anchor[1] + Math.cos(performance.now() / 1000 + Math.PI) * 40,
    ];
    context.pointLight.updateLight(redLight);
    context.pointLight.updateLight(greenLight);
    context.pointLight.updateLight(blueLight);

    if (dino.velocity.x !== 0) {
      dino.flip[0] = dino.velocity.x < 0;
    }

    animator.update(dino, dino, dino, timer.deltaTime);

    renderPass(sprites);
    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
