---
title: Getting started
description: A guide to help you get started with Pixel Forge
---

## Before we start

:::caution
This is not a tutorial on HTML, TypeScript, or JavaScript. If you're not familiar with these technologies
I recommend you to read up on them first. This guide will also expect you to be able to use a package manager.

You should also know how to spin up a local web server. I'd recommend bun, vite, or esbuild for this.
This will later be a part of the CLI, but for now you should be comfortable to do it manually.
:::

I'm using [Bun](https://bun.sh/) for this project, but you can use npm or yarn as well. Adjust the commands accordingly.

With that out of the way, you can either dive straight into the [Sample project](https://github.com/story75/pixel-forge/tree/main/demos/sample) or create your own
project from scratch.

To start the sample checkout this repository and run the following commands:

```bash
bun install
bun run build
bun sample
```

If you want to create your own project, continue reading.

## Installation

Use your favorite package manager to install Pixel Forge.

```bash
bun add @story75/pixel-forge
```

## Render a sprite

### HTML Setup

First you need to create a canvas element in your HTML file.
When you create a sample with e.g. [Vite](https://vitejs.dev/), your `index.html` file should look something like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello Pixel Forge</title>
  </head>
  <body style="margin: unset; overflow: hidden">
    <canvas></canvas>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Create a context

Then in your TypeScript, or JavaScript, file get a reference to the canvas and create a new `WebGPUContext`.

```ts
import { createContext } from '@story75/pixel-forge';

export async function application(): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);
}
```

### Create a pipeline

After that you can create your render pipeline. This is basically a set of instructions for the GPU on how to render
your sprites. It will return a `RenderPass` that you can use to render your sprites shortly.

```ts ins={3,10}
import { createContext, pipeline } from '@story75/pixel-forge';

export async function application(): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  const renderPass = pipeline(context);
}
```

### Create a sprite

Now you can create a sprite. A sprite is a 2D image that you can render to the screen. Either look for an image yourself or use the one I provided in the sample project.
A sprite is created with the `sprite` function. It takes a mandatory `texture` parameter. To get the texture you need to load the image with a `TextureLoader`.

```ts ins={4-5,14-24}
import {
  createContext,
  pipeline,
  createTextureLoader,
  sprite,
} from '@story75/pixel-forge';

export async function application(): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  const renderPass = pipeline(context);

  // this will create a texture loader
  const textureLoader = createTextureLoader(context.device);
  // this will load the image and return a texture
  const texture = await textureLoader('pixel-prowlers.png');

  // this will create a sprite at position 300, 300 with the texture we just loaded
  const sampleSprite = sprite({
    texture,
    x: 300,
    y: 300,
  });
}
```

### Create a draw loop

We're almost there. Now we need to add the sprite to the render pass. For this we need a render loop. A render loop is a function that is called every frame.
This is done via `requestAnimationFrame`. Inside the render loop we need to call the `renderPass` function and pass in the sprites we want to render.

```ts collapse={9-24} ins={26-31}
import {
  createContext,
  pipeline,
  createTextureLoader,
  sprite,
} from '@story75/pixel-forge';

export async function application(): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  const renderPass = pipeline(context);

  const textureLoader = createTextureLoader(context.device);
  const texture = await textureLoader('pixel-prowlers.png');
  const sampleSprite = sprite({
    texture,
    x: 300,
    y: 300,
  });

  const draw = function () {
    renderPass([sampleSprite]);
    requestAnimationFrame(draw);
  };

  draw();
}
```

And that's it. You should now see a sprite rendered to the screen. You can tinker with the code and see what happens.
You could change the position of the sprite, or add another sprite. You could also change the texture to something else.
Maybe try rotating the sprite inside the render loop via `sampleSprite.rotation += 0.01`.

<iframe width="100%" style="height: 400px !important" src="https://stackblitz.com/edit/vitejs-vite-5tbqtd?ctl=1&embed=1&file=src%2Fmain.ts"></iframe>
