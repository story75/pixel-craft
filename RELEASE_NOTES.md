# Release Notes

## UNRELEASED

## 0.1.0 (29.11.2023)

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
