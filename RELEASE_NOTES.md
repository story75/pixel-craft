# Release Notes

## UNRELEASED

### Breaking changes

#### Rename `@pixel-craft/ec` package to `@pixel-craft/store`

The `@pixel-craft/ec` package has been renamed to `@pixel-craft/store`.
This change was made to better reflect the contents of the package, which are two classes for storing and querying entities.

#### Extract point and vector classes from `@pixel-craft/engine` into new `@pixel-craft/math` package

The point and vector classes have been extracted into a new `@pixel-craft/math` package.
This was done to slim down the `@pixel-craft/engine` package to focus on rendering logic.

### Features

#### Add `Store.index` method

The `Store.index` method allows you to get the index of an entity in the store.
This can be useful if you want to synchronize entities between different stores e.g. with a storage buffer.

#### Add `Store.onShuffle` observable

The `Store.onShuffle` observable emits an event whenever an entity in the store is shuffled. This happens when an entity is removed and another entity is moved to take its place.
This can be useful if you want to synchronize entities between different stores e.g. with a storage buffer.

#### Add `SpatialHashGrid` class to `@pixel-craft/store`

The `SpatialHashGrid` class is a spatial partitioning data structure that can be used to efficiently store and query entities in a 2D space.
It offers unbounded 2D space partitioning with a fixed cell size and supports adding, removing, updating and querying entities.
It is particularly useful for collision detection and spatial queries like finding entities in a certain area.

## 0.7.4 (01.05.2024)

### Fixes and improvements

#### Define point light position in world space

The point light position is now defined in world space instead of screen space. This means that the light will move with the camera and not stay in the same position on the screen.
The calculation is done in the shader by transforming the light position with the camera translation and scaling.

#### Add `radius` property to `PointLight

You can now set the `radius` property on a `PointLight` to control the radius of the light.
The radius is used to calculate the light intensity based on the distance to the light source.

#### Make `color`, `intensity` and `radius` properties of `PointLight` optional

The `color`, `intensity` and `radius` properties of `PointLight` are now optional. This allows you to create a light with default values and update the properties later on.
The default values are `color: [1, 1, 1]`, `intensity: 1` and `radius: 40`.

## 0.7.3 (29.04.2024)

### Features

#### Use deferred rendering

The renderer now uses deferred rendering. This allows for more complex lighting effects and better performance when rendering multiple lights.
The previous forward rendering approach only implemented global lighting, which was applied to all sprites in the scene.
With the new system it is now possible to also add multiple lights to the scene with different positions, colors, intensities and other properties.

#### Add point light support

You can now add point lights to the scene. A point light has a position in 2D screen space and emits light in all directions.

The current implementation uses a simple attenuation model to calculate the light intensity based on the distance to the light source.
The formula right now is `light_attenuation = mix(2, 0, clamp(light_distance / 200, 0, 1))`. This is just the current implementation and will change in the future,
to be configurable instead.

The lights right now are also in screen space, which means they move with the camera. This is not ideal, so the plan is to use world space in the future.

To add a point light to the scene, you can use the `addPointLight` function like so:

```ts
app.context.pointLight.addLight({
  position: [400, 480],
  color: [1.0, 0.2, 0.2],
  intensity: 1,
});
app.context.pointLight.addLight({
  position: [500, 480],
  color: [0.2, 1, 0.2],
  intensity: 1,
});
app.context.pointLight.addLight({
  position: [480, 400],
  color: [0.2, 0.2, 1],
  intensity: 1,
});
const playerLight = app.context.pointLight.addLight({
  position: [480, 480],
  color: [0.5, 0.5, 0.5],
  intensity: 1,
});
```

The `addLight` function returns the light object, which you can use to update the light properties later on.
To update the light properties, you can use the `updateLight` function like so:

```ts
playerLight.position[0] = (dino.x + dino.width / 2) * 4;
playerLight.position[1] = (dino.y + dino.height / 2) * 4;
app.context.pointLight.updateLight(playerLight);
```

To remove a light from the scene, you can use the `removeLight` function like so:

```ts
app.context.pointLight.removeLight(playerLight);
```

## 0.7.2 (27.04.2024)

### Features

#### Add global lighting

You can now use global lighting in your scenes. The `WebGPUContext` now exposes a `globalLight` property that you can use to set the global light like so:

```ts
context.globalLight.color([Math.random(), Math.random(), Math.random()]);
context.globalLight.intensity(Math.random());
```

If you do this in a render loop, you can create a disco light effect. The global light will be applied to all sprites in the scene.
Be default, the global light is white with an intensity of 1.0, so it will not affect the colors of the sprites.

## 0.7.1 (27.04.2024)

### Features

#### Add `@pixel-craft/observable` package

Introducing the `@pixel-craft/observable` package. This package provides an observable class for synchronous event handling.

#### Add `@pixel-craft/ec` package

Introducing the `@pixel-craft/ec` package.

This package provides a simple Entity-Component framework to store and query entities.
It purposefully does not provide any systems and leaves the implementation of systems to the user.

#### Add `@pixel-craft/composer` package

Introducing the `@pixel-craft/composer` package.

This package provides `Composer`, a class which allows you to build a pipeline by chaining functions with different input and output types.

```typescript
const add = (a: number) => (b: number) => a + b;
const multiply = (a: number) => (b: number) => a * b;

const add3 = add(3);
const double = multiply(2);
const triple = multiply(3);

const result = new Composer(1, add3)
  .next(double)
  .next(triple)
  .next((n) => String(n))
  .execute();

expect(result).toBe('24');
```

#### Add `@pixel-craft/animator` package

Introducing the `@pixel-craft/animator` package.

This package contains the Animation code previously found in the `@pixel-craft/pixel-craft` package.
The code is now system agnostic and can be used in any project using the `@pixel-craft/engine` package.

The `@pixel-craft/pixel-craft` package was updated to use the `@pixel-craft/animator` package.

#### Add `@pixel-craft/spritesheet` package

Introducing the `@pixel-craft/spritesheet` package.

This package contains the sprite sheet code previously found in the `@pixel-craft/pixel-craft` package.
The code was moved just like the animation code to make it more reusable for custom integrations.

The `@pixel-craft/pixel-craft` package was updated to use the `@pixel-craft/spritesheet` package.

## 0.7.0 (19.04.2024)

### Breaking changes

#### Export new Point types and Vector classes

The new `Point` types and `Vector` classes are now exported from the `@pixel-craft/engine` package.
In contrast to the old array-based types, these are easier to use and provide more functionality.

### Features

#### Add `InputMovementSystem`

The new `InputMovementSystem` allows you to move entities with the arrow keys or WASD.
To use it, instantiate the system and create entities implementing the `Moveable` type.

### Fixes and improvements

#### Discard transparent pixels in repeating fragment shader

The repeating fragment shader now discards transparent pixels. This fixes z index issues with tiling sprites.

#### Correctly flip texture slices

Previously, only full texture frames were flipped correctly but not texture slices. This has been fixed.

## 0.6.2 (14.04.2024)

### Features

#### Add `z` property to `Sprite`

You can now set the `z` property on a `Sprite` to control the draw order of sprites. Sprites with a higher `z` value will be drawn on top of sprites with a lower `z` value.
This is backed by depth and stencil testing in the pipeline. THis should enable all sorts of possibilities for layering sprites and creating more complex scenes.
Previously, the draw order was determined by the order in which sprites were passed to the `renderPass` function.

This is not only prone to user errors, but was also sometimes re-shuffled by the batching process. Now you can control the draw order of sprites more precisely.
Performance-wise, the impact is negligible, and avoids sorting the sprites in JS.

#### Add option to pass data to `spriteParser`

You can now pass data to the `spriteParser` function to create sprites with additional data attached.
This, together with some updates to the Transition type, allows your IDE to provide better autocompletion and type checking for your conditions.

## 0.6.1 (12.04.2024)

### Features

#### Add `uniformSpriteSheet` function

With the new `uniformSpriteSheet` function you can generate frame data for sprite sheets with uniform tiles.
The resulting frames are indexed in a 2D array corresponding to the x and y position of the tile in the sprite sheet.

#### Add `animatedSpriteSheet` function

The new `animatedSpriteSheet` function allows you to generate frame data for sprite sheets with animations.
For example if you want to extract the first dino sprite of the https://0x72.itch.io/dungeontileset-ii asset pack you can use the following code:

```ts
const dinoSpriteSheet = animatedSpriteSheet({
  frameWidth: tileSize,
  frameHeight: tileSize * 2,
  width: atlasCharacters.width,
  height: atlasCharacters.height,
  animations: [
    {
      name: 'idle',
      row: 6,
      frames: 4,
      startFrame: 8,
    },
    {
      name: 'run',
      row: 6,
      frames: 4,
      startFrame: 12,
    },
    {
      name: 'hit',
      row: 6,
      frames: 1,
      startFrame: 16,
    },
  ],
});
```

Together with the correct 0x72_DungeonTilesetII_v1.7.png texture you could create a sprite with the following code:

```ts
const animation = {
  name: 'idle',
  interruptible: true,
  loop: true,
  speed: 5,
  animationFrames: dinoSpriteSheet['idle'],
};
const dino: Sprite & Animated = {
  ...sprite({
    texture: atlasCharacters,
    frame: animation.animationFrames[0],
  }),
  ...AnimatorSystem.createAnimated({
    animations: {
      [animation.name]: animation,
    },
    transitions: [
      {
        from: { type: TransitionType.Entry },
        to: animation.name,
        condition: () => true,
      },
    ],
  }),
};
```

Doing the entire process manually is cumbersome, so you may want to check out the new `spriteParser` function that simplifies the process.

#### Add `spriteParser` function

The above example can get a little tedious, so the new `spriteParser` function can help you with that.
If you're fine with a little less flexibility, you can omit a lot of the boilerplate code like so:

```ts
const dino = spriteParser({
  frameWidth: tileSize,
  frameHeight: tileSize * 2,
  atlas: atlasCharacters,
  animations: [
    {
      name: 'idle',
      row: 6,
      frames: 4,
      startFrame: 8,
      speed: 5,
      interruptible: true,
      loop: true,
    },
    {
      name: 'run',
      row: 6,
      frames: 4,
      startFrame: 12,
      speed: 5,
      interruptible: true,
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
  ],
});
```

### Fixes and improvements

#### `sprite` will now use frame rect before texture rect if width and height are not provided

Previously, if you did not provide a `width` and `height` property to the `sprite` function, it would use the texture rect to determine the size of the sprite.
Now, it will use the frame rect if it is available, and fall back to the texture rect if it is not. This makes working with sprite sheets easier,
as you can provide the frame rect and not have to explicitly provide the width and height.

#### Application provides a `loadTexture` function

The `Application` class now provides a `loadTexture` function that you can use to load textures.
Internally, it creates a `TextureLoader` and uses it to load the texture. This is a convenience function that allows you to load textures without having to create a `TextureLoader` yourself.

## 0.6.0 (06.04.2024)

### Breaking changes

#### Remove `inputControlledCamera`, `createInput`, `createTimer` and `createCamera`

The above-mentioned functions have been removed in favor of the new `InputCameraSystem`, `InputSystem` and `TimerSystem` respectively,
that are part of the `@pixel-craft/pixel-craft` package.

`createCamera` was removed because it was not part of the public API and is called internally by the `createContext` function.

### Features

#### @pixel-craft/cli

Introducing the `@pixel-craft/cli` package. This package provides a command line interface for creating new Pixel Craft projects and managing them.
Right now, the CLI can be used to build libraries and applications, as well as running watch tasks for development.

Future versions will include more features like creating new projects from templates and more.

#### @pixel-craft/pixel-craft

Introducing the `@pixel-craft/pixel-craft` package. This package provides an application framework for creating Pixel Craft applications.
It is a simple ECS-like framework that allows you to create game objects and systems to apply logic to them.

The main idea is to keep the application as slim as possible and implement everything with composable systems.
This is also the way you should use Pixel Craft in general, instead of using the engine directly.
There will still be a few changes until the API is stable and complete enough until breaking changes are avoided.

Currently implemented systems out of the box are:

- `RenderSystem`: Renders sprites to the screen
- `InputSystem`: Handles keyboard input
- `InputCameraSystem`: Moves the camera with the arrow keys or WASD
- `TimerSystem`: Handles delta time calculation
- `AnimatorSystem`: Animates sprites

#### AnimatorSystem

The `AnimatorSystem` is a new system that allows you to animate sprites. It was already possible to roll your own animation system, but it was not straightforward.
To animate a sprite it has to implement the `Animated` interface. This will allow your sprite to loop through a single animation consisting of multiple frames.

Going forward, the plan is to add more features to the `AnimatorSystem` like playing multiple animations, pausing, and stopping animations.

## 0.5.0 (01.04.2024)

### Breaking changes

#### Change project name and npm scope to `@pixel-craft`

The project name has been changed from `@story75/pixel-forge` to `@pixel-craft/engine`. The main driver was to reserve the `@pixel-craft` npm scope for future packages.
This change will require you to update your imports to use the new package name.

Going forward, the plan is to keep low level engine features in the `@pixel-craft/engine` package and create higher level features in separate packages under the `@pixel-craft` scope.
This will allow the engine parts to focus more on the low level features and keep the higher level features and abstractions separate.
I expect most people to use the higher level packages, but the engine package will still be available for those who want to build their own abstractions.

The actual version scheme is still under consideration, but for now all packages will have the same version number.
To highlight where a change was made, the release notes will include the package name.

#### `createContext` now returns a `Camera` object instead of a `projectionViewMatrixUniformBuffer` property and `observe` function

The camera is starting to receive more features, like zooming in this release, so it makes sense to return it from the `createContext` function.
This avoids bloating the context object with camera related properties and functions.

### Features

#### Camera zoom

You can now zoom the camera in and out with the `zoom` property on the camera like so:

```ts
const context = await createContext(canvas);
context.camera.zoom([4, 4]);
```

This will zoom the camera in by a factor of 4. You can also zoom out by providing a value less than 1.

## 0.4.0 (29.03.2024)

### Features

#### Timer

You can now create a timer with `createTimer`. This will calculate the time since the last frame and delta time.
To use the timer with a render loop, you can look at the following example:

```ts
const timer = createTimer();

const draw = function (now: number) {
  timer.update(now);
  renderPass(sprites);
  requestAnimationFrame(draw);
};

draw(performance.now());
```

Now you can use `timer.deltaTime` to multiply with the speed of your objects to make them move at a constant speed regardless of the frame rate.

#### Keyboard input

You can now create an input tracker for keyboard input with `createInput`. This will track the state of the keys and provide a way to check if a key is pressed.
Additionally, you can query the x and y-axis of the arrow keys or WASD keys. You can use the input tracker like so:

```ts
const input = createInput();

// inside your game loop to move a sprite
sprite.x += input.x * speed * timer.deltaTime;
sprite.y += input.y * speed * timer.deltaTime;
```

#### Input controlled camera

You can now create an input controlled camera with `inputControlledCamera`. This will create a camera that can be moved with the arrow keys or WASD keys through the input tracker.
You can use the camera like so:

```ts
const input = createInput();
const timer = createTimer();
const camera = inputControlledCamera(input, timer, context);

const draw = function (now: number) {
  timer.update(now);
  camera.update();
  stats.begin();

  renderPass(sprites);

  stats.end();
  requestAnimationFrame(draw);
};

draw(performance.now());
```

The camera is integrated in the sample and tileset demo, feel free to try it out.

## 0.3.0 (23.03.2024)

### Features

#### Camera movement

You can now set a camera position to observe the scene by calling the `observe` function attached to the `context` like this

```ts
context.observe([200, 0]); // move the camera 200 pixels to the right
```

This API is likely to change in the future, but for now it is an easy way to move the camera.

You can check out the sample project for an example of how to use this feature, with four hidden sprites that are revealed as the camera moves.
The camera can be moved using the arrow keys or WASD.

#### Astro Starlight Documentation

You can now access the documentation for Pixel Craft at [https://story75.github.io/pixel-craft/](https://story75.github.io/pixel-craft/).
The documentation is created with [Astro Starlight](https://starlight.astro.build/) for those who are curious.

It is still a work in progress, but will be updated along with the library.

### Fixes and improvements

#### New place for demos

There is now a separate directory for demos in the repository. You can find it under `demos/` in the root of the repository.
The demo project has been moved to this directory for better organization.

#### Parallax demo

There is a new parallax demo in the demo directory. This demo shows how to create a parallax effect with multiple layers of sprites.

## 0.2.1 (03.12.2023)

### Features

#### Linear sampling

You can now use linear sampling by providing a `sampler` property to the `sprite` function like so:

```ts
const sampleSprite = sprite({
  texture,
  x: 300,
  y: 300,
  sampler: 'linear',
});
```

This will use linear sampling for the sprite. This is not useful for rendering pixel art, but rather for rendering textures like text.

The `sampler` property is a string that can be either `nearest` or `linear`. If the value is `nearest`, the sprite will use nearest neighbor sampling. If the value is `linear`, the sprite will use linear sampling.
The default value is `nearest`, which was the only option before this change.

#### Font loader

You can create a font loader with `createFontLoader` like so:

```ts
const fontLoader = createFontLoader();
```

This will create a font loader that you can use to load fonts from URLs like so:

```ts
await fontLoader('vendor/monocraft/Monocraft.otf');
```

The function will return a promise that resolves to a `FontFace`. The font is bound to the document and cached, so subsequent calls to the function with the same name will return the same font.
You do not need the font face after loading it, so it is safe to ignore the return value, but keep in mind that the font will not be available until the promise resolves.

#### CanvasText

You can create text with `canvasText` like so:

```ts
const text = canvasText(
  {
    text: 'Hello World!',
    font: '42px Monocraft',
    color: [0, 0, 0],
  },
  context.device,
);
```

This will create a `CanvasText` that you can use to render text to the canvas via a render pass. Except for the text and font, all other properties are optional.
This will render the text using a canvas 2d context and then upload the result to a texture.

Under the hood, this will still use the sprite renderer. Keep in mind that this is not the most efficient way to render text,
and should only be used for small amounts of text. Text generated this way will not be able to be batched with other sprites,
and thus result in more draw calls.

Once the text is created you can access the texture by using the `texture` property on the returned object.
Once the texture is available you can also use the width and height properties to get the size of the text.
The texture will be updated whenever the text or font properties change.

Canvas text will use linear filter sampling by default. This will make the text look crisp, but may result in blurry text when the text is scaled.

## 0.2.0 (02.12.2023)

### Breaking changes

#### `pipeline` now takes just a `WebGPUContext` instead of a `GPUDevice`,`GPUCanvasContext` and `projectionViewMatrixUniformBuffer`.

This is to make it easier to create pipelines by providing the `WebGPUContext` that is returned by `createContext` instead of having to provide the `GPUDevice` and `GPUCanvasContext` separately.
The `projectionViewMatrixUniformBuffer` is now also created during the `createContext` call, so you don't have to create it yourself.

```ts
// Before
const { device, context } = await createContext(canvas);
const projectionViewMatrixUniformBuffer = projectionViewMatrix(
  device,
  canvas.width,
  canvas.height,
);
const renderPass = pipeline(device, context, projectionViewMatrixUniformBuffer);
```

```ts
// After
const context = await createContext(canvas);
const renderPass = pipeline(context);
```

### Features

#### Sprite flipping

You can now flip sprites by providing a `flip` property to the `sprite` function like so:

```ts
const sampleSprite = sprite({
  texture,
  x: 300,
  y: 300,
  flip: [true, false],
});
```

This will flip the sprite horizontally.

The `flip` property is a tuple of two booleans, the first one controls horizontal flipping and the second one controls vertical flipping.
If the value is true, the sprite will be flipped. If the value is false, the sprite will not be flipped.
This is useful for rendering a sprite facing left or right, without having to create a separate texture.
This will not affect the frame of the sprite, but just change the uv coordinates.

#### Tiling sprites

You can now render tiling sprites with the `tilingSprite` function like so:

```ts
const parallax = tilingSprite({
  texture,
  width: canvas.width,
  height: canvas.height,
});
```

This will create a full screen sprite and the texture will repeat in every direction. You can change the offset of the texture by providing an `offset` property like so:

```ts
const parallax = tilingSprite({
  texture,
  width: canvas.width,
  height: canvas.height,
  offset: [0.5, 0.5],
});
```

This will offset the texture by half the width and height of the texture. You can use this to create parallax effects.
This will not affect the frame of the sprite, but just change the uv coordinates.
Internally, this will use a different pipeline with a different fragment shader that supports tiling.

## 0.1.0 (30.11.2023)

This marks the first release of the project. Below is a list of the main features:

#### Canvas configuration

You can automatically configure the canvas by providing it to `createContext` like so:

```ts
const canvas = document.getElementsByTagName('canvas')[0]!;
const context = await createContext(canvas);
```

This will automatically set the canvas size to the size of the window and configure the pixel ratio to match the device's pixel ratio.
The function will return a promise that resolves to the `GPUDevice` and `GPUCanvasContext`.

#### View projection

You can create a view projection matrix by providing a `GPUDevice` and the canvas bounds to `projectionViewMatrix` like so:

```ts
const projectionViewMatrixUniformBuffer = projectionViewMatrix(
  device,
  canvas.width,
  canvas.height,
);
```

This will create a view projection matrix uniform buffer that you can use in your shaders or pass to the default pipeline.

#### Texture loader

You can load textures by providing a `GPUDevice` to `createTextureLoader` like so:

```ts
const textureLoader = createTextureLoader(device);
```

This will create a texture loader that you can use to load textures from URLs like so:

```ts
const texture = await textureLoader('assets/pixel-prowlers.png');
```

The function will return a promise that resolves to a `GPUTexture`. The texture is bound to the device and cached, so subsequent calls to the function with the same path will return the same texture.

#### Sprites

You can create sprites by providing a `GPUTexture` to `sprite` like so:

```ts
const sampleSprite = sprite({
  texture,
  x: 300,
  y: 300,
});
```

This will create a sprite that you can use to render to the canvas via a render pass. Except for the texture, all other properties are optional. Please refer to the `Sprite` type for more information.

#### Default pipeline - 2D unlit pixel pipeline

You can create a default pipeline by providing a `GPUDevice`, a `GPUCanvasContext` and a view projection matrix uniform buffer to `pipeline` like so:

```ts
const renderPass = pipeline(device, context, projectionViewMatrixUniformBuffer);
```

This will create a default pipeline that you can use to render 2D unlit pixels and return a render pass that you can use to render sprites to the canvas.

To render a sprite to the canvas, you can use the `renderPass` function like so:

```ts
const draw = function () {
  renderPass([sampleSprite]);
  requestAnimationFrame(draw);
};

draw();
```

`renderPass` will automatically batch sprites by texture and render them in a single draw call per texture.
