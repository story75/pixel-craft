import { dirname, join } from 'node:path';
import browserSync, { type BrowserSyncInstance } from 'browser-sync';
import { Glob, spawnSync } from 'bun';
import { type FSWatcher, watch as chokidar } from 'chokidar';
import type yargs from 'yargs';

export function watch(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'watch [demo]',
    'Watch and rebuild all packages on changes. Optionally provide a demo name to also watch that demo.',
    (yargs) => {
      yargs.positional('demo', {
        type: 'string',
        describe: 'Demo to watch for changes',
      });
    },
    (args) => {
      const glob = new Glob('packages/*/package.json');
      const watcherPatterns = Array.from(glob.scanSync()).map((file) => join(dirname(file), 'src/**/*'));

      const demo = args.demo as string | undefined;
      if (demo) {
        watcherPatterns.push(join('demos', demo, 'src/**/*'));
      }

      console.log(`Starting watch for paths: ${watcherPatterns.join(', ')}`);
      let watcher: FSWatcher | undefined;
      let devServer: BrowserSyncInstance | undefined;

      if (demo) {
        devServer = browserSync.create();
        devServer.init({
          port: 8000,
          open: 'local',
          server: [join('demos', demo, 'public')],
        });
      }

      const spawnBuildProcess = () => {
        devServer?.pause();
        console.log('Build repository...');
        const proc = spawnSync(['bun', 'run', 'build'], {
          stdio: ['inherit', 'inherit', 'inherit'],
        });
        if (!proc.success) {
          console.error(`Build failed with code ${String(proc.exitCode)}`);
        } else {
          console.log('Build finished successfully');
        }
        createWatcher();
        devServer?.resume();
        devServer?.reload();
      };

      const createWatcher = () => {
        console.log('Start file watcher');
        watcher = chokidar(watcherPatterns, {
          ignored: [],
          followSymlinks: false,
          ignoreInitial: true,
        })
          .on('ready', () => {
            console.log('Watcher ready');
          })
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          .on('all', async () => {
            await watcher?.close();
            spawnBuildProcess();
          });
      };

      spawnBuildProcess();

      const killWatcher = async () => {
        await watcher?.close();
        devServer?.exit();
      };

      process.once('SIGINT', () => {
        console.log('SIGINT received...');
        // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
        killWatcher().catch((e) => console.error(e));
      });

      process.once('SIGTERM', () => {
        console.log('SIGTERM received...');
        // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
        killWatcher().catch((e) => console.error(e));
      });
    },
  );
}
