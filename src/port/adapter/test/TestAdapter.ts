import MigrateApplicationService from '../../../application/MigrateApplicationService';
import IMigration from '../../../domain/IMigration';

export default class TestAdapter {
  public static async create(script: string, description: string) {
    const [up, down] = script.split('===');

    const migration = await MigrateApplicationService.create(description);
    migration.up = eval(`async session => { ${up} }`);
    migration.down = eval(`async session => { ${down} }`);

    return migration;
  }

  public static async up(migrations: IMigration[]) {
    return MigrateApplicationService.up(migrations);
  }
}
