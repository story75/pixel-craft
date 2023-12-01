# Release Notes

## UNRELEASED

### Breaking changes

- `pipeline` now takes a `WebGPUContext` instead of a `GPUDevice` and a `GPUCanvasContext`.

  This is to make it easier to create pipelines by providing the `WebGPUContext` that is returned by `createContext` instead of having to provide the `GPUDevice` and `GPUCanvasContext` separately.

  ```ts
  // Before
  const { device, context } = await createContext(canvas);
  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    device,
    canvas.width,
    canvas.height,
  );
  const renderPass = pipeline(
    device,
    context,
    projectionViewMatrixUniformBuffer,
  );
  ```

  ```ts
  // After
  const context = await createContext(canvas);
  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    context.device,
    canvas.width,
    canvas.height,
  );
  const renderPass = pipeline(context, projectionViewMatrixUniformBuffer);
  ```

### Features

- Sprite flipping

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

- Tiling sprites

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

- Canvas configuration

  You can automatically configure the canvas by providing it to `createContext` like so:

  ```ts
  const canvas = document.getElementsByTagName('canvas')[0]!;
  const context = await createContext(canvas);
  ```

  This will automatically set the canvas size to the size of the window and configure the pixel ratio to match the device's pixel ratio.
  The function will return a promise that resolves to the `GPUDevice` and `GPUCanvasContext`.

- View projection

  You can create a view projection matrix by providing a `GPUDevice` and the canvas bounds to `projectionViewMatrix` like so:

  ```ts
  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    device,
    canvas.width,
    canvas.height,
  );
  ```

  This will create a view projection matrix uniform buffer that you can use in your shaders or pass to the default pipeline.

- Texture loader

  You can load textures by providing a `GPUDevice` to `createTextureLoader` like so:

  ```ts
  const textureLoader = createTextureLoader(device);
  ```

  This will create a texture loader that you can use to load textures from URLs like so:

  ```ts
  const texture = await textureLoader('assets/pixel-prowlers.png');
  ```

  The function will return a promise that resolves to a `GPUTexture`. The texture is bound to the device and cached, so subsequent calls to the function with the same path will return the same texture.

- Sprites

  You can create sprites by providing a `GPUTexture` to `sprite` like so:

  ```ts
  const sampleSprite = sprite({
    texture,
    x: 300,
    y: 300,
  });
  ```

  This will create a sprite that you can use to render to the canvas via a render pass. Except for the texture, all other properties are optional. Please refer to the `Sprite` type for more information.

- Default pipeline - 2D unlit pixel pipeline

  You can create a default pipeline by providing a `GPUDevice`, a `GPUCanvasContext` and a view projection matrix uniform buffer to `pipeline` like so:

  ```ts
  const renderPass = pipeline(
    device,
    context,
    projectionViewMatrixUniformBuffer,
  );
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
