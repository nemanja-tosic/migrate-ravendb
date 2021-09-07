import MigrateApplicationService from '../../../application/MigrateApplicationService';
import IMigration from '../../../domain/IMigration';
import ConfigProvider from '../config/ConfigProvider';
import SessionFactory from '../persistence/SessionFactory';

const vagrantDbHost = 'http://192.168.42.42';
const vagrantDbName = 'test';

ConfigProvider.Instance.config = {
  database: {
    url: process.env.DB_HOST ?? vagrantDbHost,
    name: process.env.DB_NAME ?? vagrantDbName,
  },
};

export default class TestAdapter {
  public static async create(script: string, description: string) {
    const [up, down] = script.split('===');

    // noinspection JSUnusedLocalSymbols
    return await MigrateApplicationService.create(description, {
      up: eval(`async session => { ${up} }`),
      down: eval(`async session => { ${down} }`),
    });
  }

  public static async up(migrations: IMigration[]) {
    return MigrateApplicationService.up(migrations);
  }

  public static async deleteEntities(entities: string[]) {
    return SessionFactory.Instance.createSession(async (session) => {
      for (const entityId of entities) {
        await session.delete(entityId);
      }
    });
  }

  public static async loadEntity(entityId: string) {
    return SessionFactory.Instance.createSession(async (session) => {
      return session.load(entityId);
    });
  }

  public static async createEntity(entity: any) {
    return SessionFactory.Instance.createSession(async (session) => {
      await session.store(entity);
    });
  }
}
