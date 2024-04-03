import { findUp } from 'find-up';
import { join } from 'node:path';
import { cwd } from 'node:process';
import yargs from 'yargs';

type PublishConfig = {
  bin?: string;
  main?: string;
  exports?: string | Record<string, string>;
  types?: string;
  typings?: string;
  module?: string;
  browser?: string;
};

type PackageJson = PublishConfig & {
  version: string;
  publishConfig?: PublishConfig;
};

const sh = async (command: string) => {
  const process = Bun.spawn(command.split(' '), {
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  await process.exited;
  if (process.exitCode !== 0) {
    throw new Error(`Could not update package.json!`);
  }
};

export function releasePackage(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'release-package <version>',
    'Release a package',
    (yargs) => {
      yargs.positional('version', {
        type: 'string',
        describe: 'Version to release',
      });
    },
    async (args) => {
      const version = args['version'] as string;
      const workingDirectory = cwd();

      const file = Bun.file(join(workingDirectory, 'package.json'));
      const content = (await file.json()) as PackageJson;

      content.version = version;

      if (content.publishConfig) {
        // this is a subset of the values pnpm allows
        // see https://pnpm.io/package_json#publishconfig
        const allowedPublishConfigKeys = [
          'bin',
          'main',
          'types',
          'typings',
          'module',
          'browser',
        ] as const;

        for (const key of allowedPublishConfigKeys) {
          if (content.publishConfig[key]) {
            content[key] = content.publishConfig[key];
          }
        }

        if (content.publishConfig.exports) {
          content.exports = content.publishConfig.exports;
        }
      }

      await Bun.write(file, JSON.stringify(content, null, 2));

      const licenseFilePath = await findUp('LICENSE');
      if (!licenseFilePath) {
        throw new Error('Could not find LICENSE file!');
      }

      const licenseInput = Bun.file(licenseFilePath);
      const licenseOutput = Bun.file(join(workingDirectory, 'LICENSE'));
      await Bun.write(licenseOutput, licenseInput);

      await sh('npm publish --access public');
    },
  );
}
