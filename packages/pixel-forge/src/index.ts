// setting bun-types will break lib option in tsconfig.json
// see: https://bun.sh/docs/typescript#dom-types
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

export { createTextureLoader } from './loader/texture';
export { type Rect } from './math/rect';
// TODO: export the math modules as separate packages
// we export the math modules normally, because the symbols are not unique.
// instead we export them with a new name, but this breaks tree shaking.
// since the modules are small, this is a good enough solution for now.
export * as Mat4 from './math/mat4';
export * as Vec2 from './math/vec2';
export * as Vec3 from './math/vec3';
export * as Vec4 from './math/vec4';
export { projectionViewMatrix } from './renderer/camera/projection-view-matrix';
export {
  createContext,
  type WebGPUContext,
} from './renderer/context/create-context';
export { pipeline } from './renderer/pipeline/default/pipeline';
export { type RenderPass } from './renderer/pipeline/shared/render-pass';
export {
  sprite,
  tilingSprite,
  type Sprite,
  type TilingSprite,
} from './sprite/sprite';
