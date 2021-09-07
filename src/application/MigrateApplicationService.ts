import { v4 as uuid } from 'uuid';
import { IDocumentSession } from 'ravendb';

import UpService from '../domain/UpService';
import IMigration from '../domain/IMigration';
import SessionFactory from '../port/adapter/persistence/SessionFactory';
import ChangelogRepo from '../port/adapter/persistence/ChangelogRepo';

export default class MigrateApplicationService {
  public static async up(migrations: IMigration[]): Promise<void> {
    return await SessionFactory.Instance.createSession<void>(async (session) =>
      new UpService(new ChangelogRepo(session)).migrate(session, migrations)
    );
  }

  public static async create(
    description: string,
    {
      up = () => Promise.resolve(),
      down = () => Promise.resolve(),
    }: {
      up?: (session: IDocumentSession) => Promise<void>;
      down?: (session: IDocumentSession) => Promise<void>;
    } = {}
  ): Promise<IMigration> {
    return { id: uuid(), description, up, down };
  }
}
