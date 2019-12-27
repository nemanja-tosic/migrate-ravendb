import ChangelogEntry from './ChangelogEntry';
import IMigration from './IMigration';

export default class Changelog {
  private readonly entries: ChangelogEntry[] = [];

  public addMigration(migration: IMigration) {
    this.entries.push(new ChangelogEntry(migration.id, migration.description));
  }

  public getPendingMigrations(migrations: IMigration[]): IMigration[] {
    return migrations.filter(m => !this.containsEntry(m.id));
  }

  private containsEntry(id: string) {
    return this.entries.some(e => e.id === id);
  }
}
