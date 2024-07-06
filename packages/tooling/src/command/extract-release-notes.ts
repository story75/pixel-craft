import { join } from 'node:path';
import { cwd } from 'node:process';
import type yargs from 'yargs';

export function extractReleaseNotes(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'extract-release-notes <version>',
    'Extract release notes for a given version',
    (yargs) => {
      yargs.positional('version', {
        type: 'string',
        describe: 'Version to extract release notes for',
      });
    },
    async (args) => {
      const version = args.version as string;
      const file = Bun.file(join(cwd(), 'RELEASE_NOTES.md'));
      const content = await file.text();

      const fromPosition = content.indexOf(`## ${version}`);
      if (fromPosition === -1) {
        throw new Error(`Version ${version} not found in RELEASE_NOTES.md`);
      }

      const toPosition = content.substring(fromPosition + 1).search(/## \d+\.\d+\.\d+/);
      const releaseNotes = content.substring(
        fromPosition,
        toPosition === -1 ? undefined : fromPosition + 1 + toPosition,
      );

      console.log(releaseNotes.trim());
    },
  );
}
