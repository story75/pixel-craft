#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { buildLibrary } from './command/build-library';
import { bundle } from './command/bundle';

const cli = yargs(hideBin(Bun.argv)).scriptName('pixel-craft').wrap(120).strict().version(false).help(true);

const commands = [buildLibrary, bundle];

commands.forEach((command) => command(cli));
await cli.demandCommand().parse();
