#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { extractReleaseNotes } from './command/extract-release-notes';
import { releasePackage } from './command/release-package';
import { watch } from './command/watch';

const cli = yargs(hideBin(Bun.argv)).scriptName('pixel-craft-tooling').wrap(120).strict().version(false).help(true);

const commands = [extractReleaseNotes, releasePackage, watch];

for (const command of commands) {
  command(cli);
}
await cli.demandCommand().parse();
