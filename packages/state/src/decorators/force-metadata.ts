/**
 * Due to a bug in esbuild, metadata is only set if the class is decorated
 *
 * @remarks
 * Once the bug is fixed, this function and all usages should be removed.
 *
 * @see https://github.com/evanw/esbuild/issues/3781
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function forceMetadata(_: Function, _context: ClassDecoratorContext) {
  // eslint-disable-next-line no-console
  console.warn('Remove @forceMetadata once https://github.com/evanw/esbuild/issues/3781 is fixed');
}
