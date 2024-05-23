import { build, BuildOptions, context } from 'esbuild';
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

      const options: BuildOptions = {
        entryPoints: ['src/index.ts'],
        outfile: 'public/dist/bundle.js',
        bundle: true,
        sourcemap: watch,
      };

      if (watch) {
        const ctx = await context(options);
        await ctx.serve({
          servedir: 'public',
        });
      } else {
        await build(options);
      }
    },
  );
}
