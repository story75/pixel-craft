# Pixel Forge

This is the workspace for Pixel Forge. It is an attempt to create a code focused game engine that is
specifically tailored to 2D pixel art RPGs.

Currently, this is very much a work in progress. It is not recommended to use this in production.
If you're brave enough to try it out, continue ahead and please report any issues you find.

## Why?

TL;DR:

- specifically tailored to 2D pixel art RPGs
- WebGPU
- easy to share games with others
- Rapid prototyping
- code focused
- fun and learning

There are many rendering packages and game engines out there, and every single one has its own pros and cons.
You should always use the right tool for the job, and Pixel Forge is not the right tool for every job.
However, I believe that there is a niche for a game engine that is specifically tailored to 2D pixel art RPGs.

One aspect that makes Pixel Forge unique is that it is built on top of WebGPU. WebGPU is a new web standard that is
currently in development, and it is the successor to WebGL. This means that Pixel Forge can employ new rendering techniques
that are not possible with WebGL, like compute shaders for example. It also squeezes out every bit of performance that is possible on the web.

On the other hand most of the existing game engines are either UI focused like Construct, or still need additional
tooling for game creation like PixiJS. Don't get me wrong, these are great tools, but they are more general purpose tools.
I'm a developer at heart and I want to write code to create my games, not click together a game with a UI.
I want some building blocks that I can use to create my game, think easy to use physics, lighting, pathfinding, Tiled support,
sound, dialog systems, etc., be able to change them with my own to fit my needs,
but I don't want to be forced to jump through multiple interfaces to create my game.

I also believe that developing a game with web technologies has the distinct advantage that you can easily share your
game with others. This is especially true for 2D games, because they are usually not very resource intensive, so you can
instead trade performance for ease of use. This means that you can leverage the existing ecosystem of the web,
to quickly prototype your game and gather feedback from others.

Lastly, I want to mention that I'm doing this project for fun as well. I'm not trying to create the next big thing.
I'm just trying to create something that I would enjoy using myself to create games and ease the development process.

## Getting Started

Small disclaimer: This is not a tutorial on HTML, TypeScript, or JavaScript. If you're not familiar with these technologies
I recommend you to read up on them first. This guide will also expect you to be able to use a package manager.
You should also know how to spin up a local web server. I'd recommend bun, vite, or esbuild for this.

I'm using [bun](https://bun.sh/) for this project, but you can use npm or yarn as well. Adjust the commands accordingly.

With that out of the way, you can either dive straight into the [sample project](packages%2Fsample) or create your own
project from scratch.
To start the sample checkout this repository and run the following commands:

```bash
bun install
bun run build
bun sample
```

If you want to create your own project, continue reading.

### Installation

Use your favorite package manager to install Pixel Forge.

```bash
bun add @story75/pixel-forge
```

### Render a sprite

First you need to create a canvas element in your HTML file.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hello Pixel Forge</title>
  </head>
  <body style="margin: unset; overflow: hidden">
    <canvas></canvas>
  </body>
</html>
```

Then in your TypeScript, or JavaScript, file get a reference to the canvas and create a new `WebGPUContext`.

```ts
import { createContext } from '@story75/pixel-forge';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);
}
```

Once you have a `WebGPUContext` you can create a `projectionViewMatrix`. This is basically your camera.

```ts
import {
  createContext,
  projectionViewMatrix, // Add this line
} from '@story75/pixel-forge';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  // And this line
  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    context.device,
    canvas.width,
    canvas.height,
  );
}
```

After that you can create your render pipeline. This is basically a set of instructions for the GPU on how to render
your sprites. It will return a `RenderPass` that you can use to render your sprites shortly.

```ts
import {
  createContext,
  projectionViewMatrix,
  pipeline, // Add this line
} from '@story75/pixel-forge';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    context.device,
    canvas.width,
    canvas.height,
  );

  // And this line
  const renderPass = pipeline(context, projectionViewMatrixUniformBuffer);
}
```

Now you can create a sprite. A sprite is a 2D image that you can render to the screen. Either look for an image yourself or use the one I provided in the sample project.
A sprite is created with the `sprite` function. It takes a mandatory `texture` parameter. To get the texture you need to load the image with a `TextureLoader`.

```ts
import {
  createContext,
  projectionViewMatrix,
  pipeline,
  createTextureLoader, // Add this line
  Sprite, // Add this line
  sprite, // Add this line
} from '@story75/pixel-forge';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    context.device,
    canvas.width,
    canvas.height,
  );

  const renderPass = pipeline(context, projectionViewMatrixUniformBuffer);

  // this will create a texture loader
  const textureLoader = createTextureLoader(context.device); // Add this line
  // this will load the image and return a texture
  const texture = await textureLoader('assets/pixel-prowlers.png'); // Add this line

  // And these lines
  // this will create a sprite at position 300, 300 with the texture we just loaded
  const sampleSprite = sprite({
    texture,
    x: 300,
    y: 300,
  });
}
```

We're almost there. Now we need to add the sprite to the render pass. For this we need a render loop. A render loop is a function that is called every frame.
This is done via `requestAnimationFrame`. Inside the render loop we need to call the `renderPass` function and pass in the sprites we want to render.

```ts
// everything from the previous code block
// directly after you defined the sprite add the following lines
const draw = function () {
  renderPass([sampleSprite]);
  requestAnimationFrame(draw);
};

draw();
```

And that's it. You should now see a sprite rendered to the screen. You can tinker with the code and see what happens.
You could change the position of the sprite, or add another sprite. You could also change the texture to something else.
Maybe try rotating the sprite inside the render loop via `sampleSprite.rotation += 0.01`.
