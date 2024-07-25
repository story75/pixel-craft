import { sprite } from '@pixel-craft/renderer';

export async function battle() {
  const { root, audioMixer, store, textureLoader, context, canvas } = window.pixelCraft;

  const bgm = await audioMixer.load(
    'assets/interstellar-edm-metal-music-pack/DavidKBD - InterstellarPack - 07 - Electric Firework.ogg',
  );
  bgm.loop = true;
  audioMixer.play(bgm, 'bgm');

  const backgroundTexture = await textureLoader('assets/pixel-craft/tower-defense/W1.jpg');

  console.log(backgroundTexture.width, backgroundTexture.height);
  console.log(canvas.width, canvas.height);

  const scaleX = canvas.width / backgroundTexture.width;
  const scaleY = canvas.height / backgroundTexture.height;
  let width = scaleX < scaleY ? backgroundTexture.width * scaleX : backgroundTexture.width * scaleY;
  let height = scaleX < scaleY ? backgroundTexture.height * scaleX : backgroundTexture.height * scaleY;

  const tileSize = 28;
  const tilesX = Math.floor(width / tileSize);
  const tilesY = Math.floor(height / tileSize);

  width = tilesX * tileSize;
  height = tilesY * tileSize;

  const background = store.add(
    sprite({
      texture: backgroundTexture,
      width,
      height,
    }),
  );

  const tempCanvas = new OffscreenCanvas(tileSize, tileSize);
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context');
  }
  ctx.strokeStyle = '#0D1B2A';
  ctx.rect(0, 0, tileSize, tileSize);
  ctx.stroke();
  const gridCell = await textureLoader(tempCanvas);

  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      store.add(
        sprite({
          texture: gridCell,
          x: x * tileSize,
          y: y * tileSize,
          width: tileSize,
          height: tileSize,
        }),
      );
    }
  }

  ctx.clearRect(0, 0, tileSize, tileSize);
  ctx.fillStyle = 'white';
  ctx.rect(0, 0, tileSize, tileSize);
  ctx.fill();
  const highlightTexture = await textureLoader(tempCanvas);
  const highlight = store.add(
    sprite({
      texture: highlightTexture,
      x: 0,
      y: 0,
      width: tileSize,
      height: tileSize,
      alpha: 0.02,
    }),
  );

  document.addEventListener('mousemove', (event) => {
    const x = Math.floor((event.clientX - canvas.offsetLeft) / tileSize) * tileSize;
    const y = Math.floor((event.clientY - canvas.offsetTop) / tileSize) * tileSize;
    highlight.x = x;
    highlight.y = y;
  });

  return (now: number) => {};
}
