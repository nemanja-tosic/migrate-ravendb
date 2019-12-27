import * as glob from 'glob';
import { join, resolve } from 'path';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { stripIndent } from 'common-tags';
import * as moment from 'moment';

import MigrateApplicationService from '../../../application/MigrateApplicationService';
import IMigration from '../../../domain/IMigration';
import ConfigProvider from '../config/ConfigProvider';
import IFileSystemConfig from './IFileSystemConfig';
import FileSystemConfigProvider from './FileSystemConfigProvider';

export default class FileSystemAdapter {
  public loadConfig() {
    const config = JSON.parse(
      readFileSync(join(process.cwd(), 'migrations.json'), 'utf-8')
    );

    ConfigProvider.Instance = new FileSystemConfigProvider(config);
  }

  public async up() {
    return MigrateApplicationService.up(this.getMigrationScripts());
  }

  private getMigrationScripts(): IMigration[] {
    return glob
      .sync('*.js', { cwd: this.config.migrationsDirectory })
      .map(fileName => {
        const { up, down } = require(resolve(
          process.cwd(),
          this.config.migrationsDirectory,
          fileName
        ));

        return { id: fileName, up, down, description: '' };
      });
  }

  public async create(description: string) {
    // lexicographically sortable
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const suffix = description
      .toLocaleLowerCase()
      .split(' ')
      .join('-');

    const migration = {
      ...(await MigrateApplicationService.create(description)),
      id: `${timestamp}-${suffix}`
    };

    writeFileSync(
      join(this.config.migrationsDirectory, `${migration.id}.js`),
      stripIndent`
        module.exports = {
          up: ${migration.up},
          down: ${migration.down}
        };
      `
    );
  }

  public async init() {
    const config: IFileSystemConfig = {
      ...ConfigProvider.createDefaultConfig(),
      migrationsDirectory: './migrations'
    };

    writeFileSync(
      join(process.cwd(), 'migrations.json'),
      JSON.stringify(config, null, 2)
    );

    mkdirSync(join(process.cwd(), config.migrationsDirectory));
  }

  private get config(): IFileSystemConfig {
    return ConfigProvider.Instance.config as IFileSystemConfig;
  }
}
