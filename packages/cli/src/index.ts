#!/usr/bin/env bun
import { cancel, intro, isCancel, outro, select } from '@clack/prompts';
import color from 'picocolors';

// const interactive = !Bun.env['CI'];

intro(color.cyan(color.bold(`Good to see you! Let's get started.`)));

const commands: Array<{
  command: string;
  label: string;
  execute: () => Promise<void>;
}> = [];

const command = await select({
  message: 'What do you want to do?',
  options: commands.map(({ command, label }) => ({ value: command, label })),
  initialValue: commands[0].command,
});

if (isCancel(command)) {
  cancel('Fair enough. See you later!');
  process.exit(0);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const { execute } = commands.find((c) => c.command === command)!;
await execute();

outro(`You're all set!`);
