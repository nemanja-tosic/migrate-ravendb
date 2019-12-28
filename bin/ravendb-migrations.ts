#! /usr/bin/env node

import * as commander from 'commander';
import { join } from 'path';

import FileSystemAdapter from '../src/port/adapter/filesystem/FileSystemAdapter';

const program = new commander.Command();
const adapter = new FileSystemAdapter();
const defaultConfigName = 'ravendb-migrations.js';

program
  .command('init')
  .description('bootstrap migrations')
  .action(() => adapter.createConfig(join(process.cwd(), defaultConfigName)));

program
  .command('create <description>')
  .description('create a new migration')
  .action(withConfig((description: string) => adapter.create(description)));

program
  .command('up')
  .description('run pending migrations')
  .action(withConfig(() => adapter.up()));

program.parse(process.argv);

function withConfig(action: any) {
  return (...params: any) => {
    adapter.loadConfig(join(process.cwd(), defaultConfigName));
    action(...params);
  };
}
