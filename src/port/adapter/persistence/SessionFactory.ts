import { DocumentConventions, DocumentStore, IDocumentSession } from 'ravendb';

import ISessionFactory from '../../../domain/ISessionFactory';
import ConfigProvider from '../config/ConfigProvider';

export default class SessionFactory implements ISessionFactory {
  public static Instance = new SessionFactory();

  async createSession<T>(
    cb: (session: IDocumentSession) => Promise<T>
  ): Promise<T> {
    const {
      database: { url, name, authOptions },
      conventions
    } = ConfigProvider.Instance.config;

    const store = new DocumentStore(url, name, authOptions as any);

    store.conventions = Object.assign(new DocumentConventions(), conventions || {});

    store.initialize();

    const session = store.openSession();
    try {
      const result = await cb(session);
      await session.saveChanges();

      return result;
    } finally {
      session.dispose();
      store.dispose();
    }
  }
}
