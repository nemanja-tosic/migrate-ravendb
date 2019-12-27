import * as uuid from 'uuid/v4';

import UpService from '../domain/UpService';
import IMigration from '../domain/IMigration';

export default class MigrateApplicationService {
  public static async up(migrations: IMigration[]): Promise<void> {
    return new UpService().migrate(migrations);
  }

  public static async create(description: string): Promise<IMigration> {
    // noinspection JSUnusedLocalSymbols
    return {
      id: uuid(),
      description,
      up: session => Promise.resolve(),
      down: session => Promise.resolve()
    };
  }
}
