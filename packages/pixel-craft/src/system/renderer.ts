import { RenderPass, Sprite, pipeline } from '@pixel-craft/renderer';
import { CreateHookContext, System } from './system';

/**
 * A render system is responsible for rendering sprites to the screen.
 */
export class RenderSystem implements System {
  private readonly sprites: Sprite[] = [];
  private renderPass!: RenderPass;

  createSystem({ context }: CreateHookContext): Promise<void> {
    this.renderPass = pipeline(context);
    return Promise.resolve();
  }

  addGameObject(sprite: unknown): void {
    if (sprite && typeof sprite === 'object' && 'texture' in sprite) {
      this.sprites.push(sprite as Sprite);
    }
  }

  removeGameObject(sprite: unknown): void {
    const index = this.sprites.indexOf(sprite as Sprite);
    if (index !== -1) {
      this.sprites.splice(index, 1);
    }
  }

  postUpdate(): void {
    this.renderPass(this.sprites);
  }
}
