import MigrateApplicationService from '../../../application/MigrateApplicationService';
import IMigration from '../../../domain/IMigration';
import ConfigProvider from '../config/ConfigProvider';
import SessionFactory from '../persistence/SessionFactory';

ConfigProvider.Instance.config = {
  database: {
    url: process.env.DB_HOST ?? 'http://192.168.42.42',
    name: process.env.DB_NAME ?? 'test'
  }
};

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

  public static async deleteEntities(entities: string[]) {
    return SessionFactory.Instance.createSession(async session => {
      for (const entityId of entities) {
        await session.delete(entityId);
      }
    });
  }

  public static async loadEntity(entityId: string) {
    return SessionFactory.Instance.createSession(async session => {
      return session.load(entityId);
    });
  }

  public static async createEntity(entity: any) {
    return SessionFactory.Instance.createSession(async session => {
      await session.store(entity);
    });
  }
}
