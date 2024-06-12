import { textureAllocator } from '../renderer/buffer/texture-allocator';
import { sprite, Sprite } from '../sprite/sprite';

/**
 * An instance of text which can be rendered to a canvas
 */
export type CanvasText = Sprite & {
  /**
   * The text to render
   */
  text: string;

  /**
   * The font to use
   *
   * @remarks
   * This should be a valid CSS font string.
   * For example: "12px Arial" or "36px Monocraft"
   *
   * If you use a custom font, make sure to load it first using a FontLoader.
   */
  font: string;
};

/**
 * Create a canvas text.
 *
 * @remarks
 * This will render the text using a canvas 2d context and then upload the result to a texture.
 *
 * Under the hood, this will still use the sprite renderer.
 * Keep in mind that this is not the most efficient way to render text, and should only be used for small amounts of text.
 * Text generated this way will not be able to be batched with other sprites, and thus result in more draw calls.
 *
 * Once the text is created you can access the texture by using the `texture` property on the returned object.
 * Once the texture is available you can also use the width and height properties to get the size of the text.
 * The texture will be updated whenever the text or font properties change.
 *
 * Canvas text will use linear filter sampling by default. This will make the text look crisp, but may result in blurry text when the text is scaled.
 */
export function canvasText(
  data: Pick<CanvasText, 'text' | 'font'> & Omit<Partial<CanvasText>, 'texture' | 'text' | 'font'>,
  device: GPUDevice,
): CanvasText {
  const allocator = textureAllocator(device);
  const canvas = document.createElement('canvas');

  // prepare canvas for text rendering
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get 2d context from canvas!');
  }

  // create initial texture, we throw this away later, but we just need it to create the sprite
  const texture = allocator(canvas);

  const textSprite = sprite({
    ...data,
    sampler: data.sampler ?? 'linear',
    texture,
  });

  const text = {
    ...textSprite,
    text: data.text,
    font: data.font,
  };

  const configureContext = () => {
    context.textBaseline = 'top'; // we want to render text from the top left corner, so it matches the sprite's bounding box
    context.font = text.font;
    context.fillStyle = 'white';
  };
  const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    configureContext();
    const rect = context.measureText(text.text);

    // resize canvas to match text size
    // this will reset the context, so we need to set everything again
    canvas.width = rect.actualBoundingBoxRight - rect.actualBoundingBoxLeft; // left may be negative, so we need to subtract it
    canvas.height = rect.actualBoundingBoxDescent - rect.actualBoundingBoxAscent; // ascent may be negative, so we need to subtract it

    configureContext();
    context.fillText(text.text, 0, 0);

    // create new texture and destroy old one
    const texture = allocator(canvas);
    const oldTexture = text.texture;
    text.texture = texture;
    oldTexture.destroy();

    // update sprite properties to match new texture
    text.width = texture.width;
    text.height = texture.height;
    text.frame.width = texture.width;
    text.frame.height = texture.height;
  };
  render();

  // use a proxy to re-render the text whenever a text related property changes
  return new Proxy(text, {
    set: (target, property, value) => {
      const traps: (keyof CanvasText)[] = ['text', 'font'];
      const ret = Reflect.set(target, property, value);

      if (typeof property === 'string' && traps.includes(property as keyof CanvasText)) {
        render();
      }

      return ret;
    },
  });
}
