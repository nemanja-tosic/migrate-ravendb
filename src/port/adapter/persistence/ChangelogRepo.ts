import IChangelogRepo from '../../../domain/IChangelogRepo';

import Changelog from '../../../domain/Changelog';
import { DocumentConventions, IDocumentSession } from 'ravendb';
import ChangelogEntry from '../../../domain/ChangelogEntry';

export default class ChangelogRepo implements IChangelogRepo {
  constructor(private session: IDocumentSession) {
    ((session as any).conventions as DocumentConventions).registerEntityType(
      ChangelogEntry
    );
  }

  async get(): Promise<Changelog> {
    return (
      (await this.session.load('MigrationChangelog', Changelog)) ||
      new Changelog()
    );
  }

  async store(changelog: Changelog): Promise<void> {
    await this.session.store(changelog, 'MigrationChangelog');
  }
}
