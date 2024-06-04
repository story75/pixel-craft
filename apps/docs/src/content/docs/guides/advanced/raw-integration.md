---
title: Raw engine integration
description: A guide to using the engine directly
---

## Here be dragons

:::danger
This is not the recommended way to use Pixel Craft. This guide is for advanced users who want to integrate the engine directly into their projects.

This should only be used if you have a good understanding of how the engine works and you want to use it in a way that is not supported by the higher-level APIs.
:::

## Installation

With that out of the way, let's get started. This guide will purposefully avoid using the higher-level APIs and CLI tools that Pixel Craft provides.

This guide will also keep some things brief and assumes you to check the types and doc comments attached to the symbols mentioned.

First create a new project with the tooling of your choice. You can use [Vite](https://vitejs.dev/) to make it easier to get started.
Then use your favorite package manager to install the engine package.

```bash
bun add @pixel-craft/engine
```

### HTML Setup

The main idea behind using the engine directly is to use the rendering code provided by the engine and integrate it into your project.
Since this is built on top of WebGPU, you need to create a canvas element.

Going with the Vite example, your HTML should look something like this:

```html ins={9}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello Pixel Craft</title>
  </head>
  <body style="margin: unset; overflow: hidden">
    <canvas></canvas>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Creating a context

For the engine to work it has to initialize a `WebGPUContext`. This will prepare the canvas and create the necessary objects to create a rendering pipeline.
To do this grab the canvas element and pass it to the `createContext` function.

```ts ins={5}
import { createContext } from '@pixel-craft/renderer';

export async function application(): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);
}
```

### Creating a Pipeline

Now you can create your render pipeline. The pipeline itself is a configuration to instruct your GPU to render stuff via WebGPU.
Once the basic configuration is done, it will return a so called `RenderPass` that you can use to render
your sprites. The render pass will take care of batching and instancing for you to make rendering more efficient.

```ts ins={7}
import { createContext, pipeline } from '@pixel-craft/renderer';

export async function application(): Promise<void> {
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);

  const renderPass = pipeline(context);
}
```

### Creating a Sprite

A sprite is created with the `sprite` function. It takes a mandatory `texture` parameter. To get the texture you need to load the image with a `TextureLoader`.

You could also omit using the texture loader in your project if you instruct your bundler to inline the images in your bundle e.g. as base64 strings, but I would strongly recommend against this.

```ts ins={4-5,14-24}
import { createContext, pipeline, createTextureLoader, sprite } from '@pixel-craft/renderer';

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

We're almost there. Now we need to draw the sprite via the render pass. To do this we need a render loop. A render loop is a function that is called every frame.
This is best done with the native `requestAnimationFrame`. Inside the render loop we need to call the `renderPass` function and pass in the sprites we want to render.

:::caution
In the default pipeline configuration, the UVs and other data are calculated every frame. The JIT compiler will optimize this for you,
but if you want to optimize further, you should create a custom pipeline. With a custom pipeline you can also use a different shape
for your sprites and decide what to cache and recalculate.

The engine purposefully opts for this approach so sprites can be plain object without any logic at all. By completely eliminating any
caching in the engine it is also way easier to reason about the code and to debug it.
:::

```ts collapse={9-20} ins={22-27}
import { createContext, pipeline, createTextureLoader, sprite } from '@pixel-craft/renderer';

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

:::tip
You will very likely need to scale animations and movement to account for lag and frame rate differences.
If you pass `performance.now()` as the first argument of your draw function, you can calculate the time difference between frames and use that to scale your animations.
`requestAnimationFrame` will pass the value on every subsequent call.
:::

### Conclusion

And that's it. You should now see a sprite rendered on the screen.

You can play around with the code and see what happens. To make it easier for you, I've created a [StackBlitz](https://stackblitz.com/edit/vitejs-vite-5tbqtd?file=src%2Fmain.ts) project that you can use to experiment with the code.

You could change the position of the sprite to, say, 150,150, or add another sprite. You could also change the texture to something else.
You might try rotating the sprite in the render loop with `sampleSprite.rotation += 0.01`.

<iframe width="100%" style="height: 400px !important" src="https://stackblitz.com/edit/vitejs-vite-5tbqtd?ctl=1&embed=1&file=src%2Fmain.ts"></iframe>
