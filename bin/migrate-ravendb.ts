import * as commander from 'commander';

import FileSystemAdapter from '../src/port/adapter/filesystem/FileSystemAdapter';

const program = new commander.Command();
const adapter = new FileSystemAdapter();

program
  .command('init')
  .description('bootstrap migrations')
  .action(async () => {
    await adapter.init();
    console.log('Migrations project initalized');
  });

program
  .command('create <description>')
  .description('create a new migration')
  .action(
    withConfig(async description => {
      await adapter.create(description);
      console.log(`Migration created`);
    })
  );

program
  .command('up')
  .description('run pending migrations')
  .action(
    withConfig(async () => {
      await adapter.up();
      console.log(`Migrated up`);
    })
  );

program.parse(process.argv);

function withConfig(action) {
  return (...params) => {
    adapter.loadConfig();
    action(...params);
  };
}
