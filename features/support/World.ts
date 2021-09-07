import { setWorldConstructor } from '@cucumber/cucumber';
import IMigration from '../../src/domain/IMigration';

export class World {
  public migrations: IMigration[] = [];

  public cleanup: string[] = ['MigrationChangelog'];
}

setWorldConstructor(World);
