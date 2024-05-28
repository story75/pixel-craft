import { build, BuildOptions, context } from 'esbuild';
import yargs from 'yargs';
import { ESBUILD_LOADER } from './esbuild-loader';

export function buildLibrary(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'build-library',
    'Build a library for publishing',
    (yargs) => {
      yargs.option('watch', {
        type: 'boolean',
        describe: 'Keep the process running and watch for changes',
        alias: 'w',
      });
    },
    async (args) => {
      const watch = args['w'] as boolean | undefined;
      const files = {
        cjs: 'dist/index.js',
        esm: 'dist/esm.js',
      };
      const options = (format: 'cjs' | 'esm'): BuildOptions => ({
        entryPoints: ['src/index.ts'],
        outfile: files[format],
        bundle: true,
        platform: 'node',
        format,
        sourcemap: true,
        loader: ESBUILD_LOADER,
      });

      if (!watch) {
        await Promise.all([build(options('cjs')), build(options('esm'))]);
      } else {
        const ctx = await context(options('esm'));
        await ctx.watch();
      }
    },
  );
}
