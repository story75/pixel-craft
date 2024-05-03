import { $ } from 'bun';
import yargs from 'yargs';

export function bundle(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'bundle',
    'Bundle a project',
    (yargs) => {
      yargs.option('watch', {
        type: 'boolean',
        describe: 'Keep the process running and watch for changes',
        alias: 'w',
      });
    },
    async (args) => {
      const watch = args['w'] as boolean | undefined;
      await $`esbuild src/index.ts --outfile=public/dist/bundle.js --bundle ${{ raw: watch ? '--servedir=public --sourcemap --watch' : '' }}`;
    },
  );
}
