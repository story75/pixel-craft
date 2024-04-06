---
title: Getting Started
description: A guide to get you started with Pixel Craft
---

## Before we start

:::caution
This is not a tutorial on HTML, TypeScript or JavaScript. If you're not familiar with those technologies
I recommend that you read up on them first. This guide assumes your familiar with modern web development and know how to use and configure your tools.
:::

The CLI uses [Bun](https://bun.sh/) internally. You can use npm or yarn instead, but then you're required to handle bundling and the development server yourself.
The guide will assume you use the CLI.

## Installation

First create a new project in a new directory. Inside you need the general boilerplate files like in any other web project.
In the future the CLI will provide a command to create a new project, but for now you need to do it manually.

```bash
mkdir my-pixel-craft-project
cd my-pixel-craft-project
bun init
bun add -d @pixel-craft/cli
bun add @pixel-craft/pixel-craft @pixel-craft/engine
```

## HTML Setup

You need a basic HTML file with a canvas element. This is where the game will be rendered.
The CLI will assume your main file is `src/index.ts` and the HTML file is `public/index.html`.
When the project is built the output will be in the `dist` folder as `bundle.js`.

Your index.html file should thus look like this:

```html title="public/index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Pixel Craft Demo</title>
  </head>
  <body style="margin: unset; overflow: hidden">
    <canvas></canvas>
    <script src="dist/bundle.js"></script>
  </body>
</html>
```

### Configuring your entry point

This is very much a personal preference, but I like to keep my entry point as clean as possible.
I usually create a separate file for the application logic and import it in the entry point.

You can do it however you like as long as your entry point is the `src/index.ts`, but this is how I would do it:

```ts title="src/index.ts"
import { application } from './application';

const canvas = document.getElementsByTagName('canvas')[0];
application(canvas).catch((e: unknown) => console.error(e));
```

### Creating your application

In Pixel Craft you create an application. This will tie everything together and be the backbone of your game.

All your game logic will reside in so-called "systems" that you add to the application. This is very similar to the Entity Component System pattern,
but without explicit entities and components, but instead the systems operate on "game objects" which are just plain objects with various properties.

The systems will check which game objects they should operate on and then do their thing. This is a very powerful pattern that allows for a lot of flexibility.

The engine offers built-in systems to get you started, but you can create your own systems as well. A default setup could look like this:

```ts title="src/application.ts"
import {
  AnimatorSystem,
  Application,
  InputCameraSystem,
  InputSystem,
  RenderSystem,
  TimerSystem,
} from '@pixel-craft/pixel-craft';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  // create the application
  const app = await Application.create(canvas);
  // create the systems
  const renderer = new RenderSystem();
  const input = new InputSystem();
  const timer = new TimerSystem();
  const camera = new InputCameraSystem(input, timer);
  const animator = new AnimatorSystem(timer);
  // add the systems to the application
  await app.addSystems(renderer, input, timer, camera, animator);
}
```

Notice that we have to wait for the application to be created, because the process is asynchronous.
The same goes for the systems. They might need to load resources or do other async operations.

With this setup you have a basic application that can render sprites, handle input and animate sprites.
When using WASD or the arrow keys the camera will move around the screen.

### Rendering a Sprite

Every game is built up of sprites. A sprite is a 2D image that can be rendered on the screen. This can be a character, a background, a bullet or anything else you can think of.

:::caution
The support around rendering sprites does not have any high-level abstractions yet, so you have to do use the engine API for now.
:::

We will go ahead and try to render a sprite at a specific position on the screen. For this you will need an image to render, a `TextureLoader` to load the image and a `sprite` object.
Together it should look like this:

```ts title="src/application.ts" ins={9-12,26-37} collapse={2-7,15-24}
import {
  AnimatorSystem,
  Application,
  InputCameraSystem,
  InputSystem,
  RenderSystem,
  TimerSystem,
} from '@pixel-craft/pixel-craft';
import { createTextureLoader, sprite } from '@pixel-craft/engine';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  // create the application
  const app = await Application.create(canvas);
  // create the systems
  const renderer = new RenderSystem();
  const input = new InputSystem();
  const timer = new TimerSystem();
  const camera = new InputCameraSystem(input, timer);
  const animator = new AnimatorSystem(timer);
  // add the systems to the application
  await app.addSystems(renderer, input, timer, camera, animator);

  // create a texture loader
  const textureLoader = createTextureLoader(app.context.device);
  // load the image of your choice as a texture
  const texture = await textureLoader('assets/pixel-prowlers.png');
  // create a sprite
  const mySprite = sprite({
    texture,
    x: 300,
    y: 300,
  });
  // add the sprite to the application, so it can be picked up by the render system
  app.addGameObjects(mySprite);
}
```

### Conclusion

And that's it. You should now see a sprite rendered on the screen.

You can play around with the code and see what happens. To make it easier for you, I've created a [StackBlitz](https://stackblitz.com/edit/vitejs-vite-5tbqtd?file=src%2Fmain.ts) project that you can use to experiment with the code.

:::danger
Since Bun is not yet supported in StackBlitz, the sample uses Vite instead. The code is the same, but the setup is different.
:::

You could change the position of the sprite to, say, 150,150, or add another sprite. You could also change the texture to something else.
You might try rotating the sprite with a custom system by calling `mySprite.rotation += 0.01` in the `update` method of the system.

<iframe width="100%" style="height: 400px !important" src="https://stackblitz.com/edit/vitejs-vite-upvica?embed=1&file=src%2Fapplication.ts"></iframe>
