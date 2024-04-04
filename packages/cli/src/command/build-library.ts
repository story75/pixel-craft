import { $ } from 'bun';
import yargs from 'yargs';

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
      const command = (format: 'cjs' | 'esm') =>
        $`esbuild src/index.ts --loader:.wgsl=text --outfile=${files[format]} --bundle --platform=node --format=${format} --sourcemap ${watch ? '--watch' : ''}`;

      if (!watch) {
        await Promise.all([command('cjs'), command('esm')]);
      } else {
        await command('esm');
      }
    },
  );
}
