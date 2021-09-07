import { IDocumentSession } from 'ravendb';

export default interface ISessionFactory {
  createSession<T>(cb: (session: IDocumentSession) => Promise<T>): Promise<T>;
}
