import IChangelogRepo from '../../../domain/IChangelogRepo';

import Changelog from '../../../domain/Changelog';
import { IDocumentSession } from 'ravendb';
import ChangelogEntry from '../../../domain/ChangelogEntry';

export default class ChangelogRepo implements IChangelogRepo {
  constructor(private session: IDocumentSession) {
    session.advanced.requestExecutor.conventions.registerEntityType(
      ChangelogEntry
    );
  }

  async get(): Promise<Changelog> {
    return (
      (await this.session.load('MigrationChangelog', Changelog)) ??
      new Changelog()
    );
  }

  async store(changelog: Changelog): Promise<void> {
    await this.session.store(changelog, 'MigrationChangelog');
  }
}
