import { join } from 'node:path';
import { cwd } from 'node:process';

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

const [_bun, _file, version] = Bun.argv;

if (!version) {
  throw new Error('Version is required');
}

const workingDirectory = cwd();
const file = Bun.file(join(workingDirectory, 'package.json'));
const content = await file.json<PackageJson>();

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
