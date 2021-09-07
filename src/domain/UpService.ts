import { IDocumentSession } from 'ravendb';

import IChangelogRepo from './IChangelogRepo';
import IMigration from './IMigration';

export default class UpService {
  constructor(private changeLogRepo: IChangelogRepo) {}

  public async migrate(
    session: IDocumentSession,
    migrations: IMigration[]
  ): Promise<void> {
    const changelog = await this.changeLogRepo.get();

    for (const migration of changelog.getPendingMigrations(migrations)) {
      await migration.up(session);
      changelog.addMigration(migration);
      await this.changeLogRepo.store(changelog);

      await session.saveChanges();
      await session.advanced.waitForIndexesAfterSaveChanges();
    }
  }
}
