import { setWorldConstructor } from '@cucumber/cucumber';
import IMigration from '../../src/domain/IMigration';

class World {
  public migrations: IMigration[] = [];

  public cleanup: any[] = ['MigrationChangelog'];
}

setWorldConstructor(World);
