import * as glob from 'glob';
import { resolve, join, dirname, parse } from 'path';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import moment from 'moment';
import { register } from 'ts-node';

import ConfigProvider from '../config/ConfigProvider';
import MigrateApplicationService from '../../../application/MigrateApplicationService';
import IMigration from '../../../domain/IMigration';
import IFileSystemConfig from './IFileSystemConfig';

export default class FileSystemAdapter {
  // TODO: verify config
  public async loadConfig(path: string) {
    if (!existsSync(path)) {
      return this.error(
        `${path} doesn't exist. Did you initialize migrations first?`
      );
    }

    const config: IFileSystemConfig = (await import(path)).default;

    (ConfigProvider.Instance.config as IFileSystemConfig) = {
      ...config,
      migrationsDirectory: resolve(dirname(path), config.migrationsDirectory),
    };
  }

  public async createConfig(path: string) {
    const config: IFileSystemConfig = {
      ...ConfigProvider.createDefaultConfig(),
      migrationsDirectory: './migrations',
    };

    writeFileSync(path, `module.exports = ${JSON.stringify(config, null, 2)}`);
    mkdirSync(join(dirname(path), config.migrationsDirectory));

    this.log('Migrations project initialized');
  }

  public async create(description: string) {
    this.saveAsFile(await MigrateApplicationService.create(description));
  }

  public async up() {
    const tsNodeRegister = register({
      transpileOnly: true,
      compilerOptions: {
        target: 'es6',
      },
    });

    await MigrateApplicationService.up(await this.getMigrationScripts());
    this.log('Migrated up');

    tsNodeRegister.enabled(false);
  }

  private saveAsFile(migration: IMigration) {
    const fileName = `${this.createFileName(migration.description)}.js`;

    writeFileSync(
      join(this.config.migrationsDirectory, fileName),
      `module.exports = { up: ${migration.up}, down: ${migration.down} };`
    );

    this.log(`Created migration "${fileName}"`);
  }

  private createFileName(description: string) {
    // lexicographically sortable
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const suffix = description.toLocaleLowerCase().split(' ').join('-');

    return `${timestamp}-${suffix}`;
  }

  private async getMigrationScripts(): Promise<IMigration[]> {
    const { migrationsDirectory } = this.config;

    return Promise.all(
      glob
        .sync('**/*.{js,ts}', {
          cwd: migrationsDirectory,
          ignore: ['*.d.ts', '*.map'],
        })
        .map((path) => parse(path))
        .sort((a, b) => a.base.localeCompare(b.base))
        .map(async (path) => {
          const { up, down } = await import(
            join(migrationsDirectory, path.base)
          );

          return { id: path.name, up, down, description: '' };
        })
    );
  }

  private get config(): IFileSystemConfig {
    return ConfigProvider.Instance.config as IFileSystemConfig;
  }

  // TODO: introduce logger
  protected log: (message: string) => void = console.log;

  protected error: (message: string) => void = console.error;
}
