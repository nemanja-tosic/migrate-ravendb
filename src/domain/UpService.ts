import { IDocumentSession } from 'ravendb';

import IChangelogRepo from './IChangelogRepo';
import IMigration from './IMigration';

import ChangelogRepo from '../port/adapter/persistence/ChangelogRepo';
import SessionFactory from '../port/adapter/persistence/SessionFactory';

export default class UpService {
  public async migrate(migrations: IMigration[]): Promise<void> {
    await SessionFactory.Instance.createSession<void>(async session => {
      const changelogRepo = UpService.createChangelogRepo(session);

      const changelog = await changelogRepo.get();
      for (const migration of changelog.getPendingMigrations(migrations)) {
        await migration.up(session);
        changelog.addMigration(migration);
        await changelogRepo.store(changelog);
        await session.saveChanges();
      }
    });
  }

  private static createChangelogRepo(
    session: IDocumentSession
  ): IChangelogRepo {
    return new ChangelogRepo(session);
  }
}
