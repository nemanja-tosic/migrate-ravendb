import { DocumentStore, IDocumentSession } from 'ravendb';

import ISessionFactory from '../../../domain/ISessionFactory';
import ConfigProvider from '../config/ConfigProvider';

export default class SessionFactory implements ISessionFactory {
  public static Instance = new SessionFactory();

  async createSession<T>(
    cb: (session: IDocumentSession) => Promise<T>
  ): Promise<T> {
    const config = ConfigProvider.Instance.config;
    const store = new DocumentStore(config.databaseUrl, config.databaseName);

    store.initialize();

    const session = store.openSession();
    const result = await cb(session);
    await session.saveChanges();

    session.dispose();
    store.dispose();

    return result;
  }
}
