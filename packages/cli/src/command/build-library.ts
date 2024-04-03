import yargs from 'yargs';

const sh = async (command: string) => {
  const process = Bun.spawn(command.split(' '), {
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  await process.exited;
  if (process.exitCode !== 0) {
    throw new Error(`Could not update package.json!`);
  }
};

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
        `esbuild src/index.ts --loader:.wgsl=text --outfile=${files[format]} --bundle --platform=node --format=${format} --sourcemap`;

      if (!watch) {
        await Promise.all([sh(command('cjs')), sh(command('esm'))]);
      } else {
        await sh(`${command('esm')} --watch`);
      }
    },
  );
}
