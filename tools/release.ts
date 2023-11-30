import { join } from 'node:path';
import { cwd } from 'node:process';

// We have to do the following things during the release:
// 1. Update the package.json via tools/update-package-json.ts
// 2. Include LICENSE in the package
// 3. Run npm publish
// We omit resetting the version in package.json because we do not want to commit the version change anyway.

const [_bun, _file, version] = Bun.argv;

if (!version) {
  throw new Error('Version is required');
}

const workingDirectory = cwd();

const updatePackageJSON = Bun.spawn(
  ['bun', join(import.meta.dir, 'update-package-json.ts'), version],
  {
    cwd: workingDirectory,
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

await updatePackageJSON.exited;
if (updatePackageJSON.exitCode !== 0) {
  throw new Error(`Could not update package.json!`);
}

const licenseInput = Bun.file(join(import.meta.dir, '..', 'LICENSE'));
const licenseOutput = Bun.file(join(workingDirectory, 'LICENSE'));
await Bun.write(licenseOutput, licenseInput);

const npmPublish = Bun.spawn(['npm', 'publish', '--access', 'public'], {
  cwd: workingDirectory,
  stdio: ['inherit', 'inherit', 'inherit'],
});

await npmPublish.exited;
if (npmPublish.exitCode !== 0) {
  throw new Error(`Could not publish package!`);
}
