import * as uuid from 'uuid/v4';

import UpService from '../domain/UpService';
import IMigration from '../domain/IMigration';
import SessionFactory from '../port/adapter/persistence/SessionFactory';
import ChangelogRepo from '../port/adapter/persistence/ChangelogRepo';

export default class MigrateApplicationService {
  public static async up(migrations: IMigration[]): Promise<void> {
    return await SessionFactory.Instance.createSession<void>(async session =>
      new UpService(new ChangelogRepo(session)).migrate(session, migrations)
    );
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
