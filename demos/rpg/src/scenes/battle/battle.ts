import { sprite } from '@pixel-craft/renderer';
import { BattleHUD } from './ui/hud';

export async function battle() {
  const { root, audioMixer, store, textureLoader, context } = window.pixelCraft;

  const bgm = await audioMixer.load(
    'assets/interstellar-edm-metal-music-pack/DavidKBD - InterstellarPack - 07 - Electric Firework.ogg',
  );
  bgm.loop = true;
  audioMixer.play(bgm, 'bgm');

  const battleHUD = new BattleHUD();
  root.appendChild(battleHUD);

  context.camera.zoom({ x: 3, y: 3 });

  const width = 20;
  const height = 20;
  const tileSize = 32;
  const mapOffsetX = (tileSize * (width - 1)) / 2;
  // const texture = await textureLoader('assets/pixel-craft/Isometric-SpriteSheet.png');
  // const character = await textureLoader('assets/pixel-craft/story75-Recovered.png');

  const position = (x: number, y: number) => ({
    x: mapOffsetX + (x * tileSize) / 2 + (y * -tileSize) / 2,
    y: (x * tileSize) / 4 + (y * tileSize) / 4,
  });

  // store.add(
  //   sprite({
  //     texture: character,
  //     color: [1, 0, 0],
  //     alpha: 0.5,
  //     ...position(3, 0),
  //     z: 0.99,
  //   }),
  // );

  // store.add(
  //   sprite({
  //     texture: character,
  //     color: [1, 0, 0],
  //     alpha: 0.5,
  //     ...position(6, 0),
  //     z: 0.99,
  //   }),
  // );

  // store.add(
  //   sprite({
  //     texture: character,
  //     color: [1, 0, 0],
  //     alpha: 0.5,
  //     ...position(9, 0),
  //     z: 0.99,
  //   }),
  // );

  // store.add(
  //   sprite({
  //     texture: character,
  //     color: [0, 1, 1],
  //     flip: [true, false],
  //     ...position(3, 9),
  //     z: 0.99,
  //   }),
  // );

  // store.add(
  //   sprite({
  //     texture: character,
  //     color: [0, 1, 1],
  //     alpha: 0.5,
  //     flip: [true, false],
  //     ...position(6, 12),
  //     z: 0.99,
  //   }),
  // );

  // store.add(
  //   sprite({
  //     texture: character,
  //     color: [0, 1, 1],
  //     alpha: 0.5,
  //     flip: [true, false],
  //     ...position(9, 12),
  //     z: 0.99,
  //   }),
  // );

  // for (let y = 0; y < height; y++) {
  //   for (let x = 0; x < width; x++) {
  //     store.add(
  //       sprite({
  //         texture,
  //         ...position(x, y),
  //         frame: {
  //           x: 0,
  //           y: 0,
  //           width: tileSize,
  //           height: tileSize,
  //         },
  //       }),
  //     );
  //   }
  // }

  return (now: number) => {};
}
