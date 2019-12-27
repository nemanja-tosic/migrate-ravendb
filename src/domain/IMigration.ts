import { IDocumentSession } from 'ravendb';

export default interface IMigration {
  id: string;
  description: string;
  up: (session: IDocumentSession) => Promise<void>;
  down: (session: IDocumentSession) => Promise<void>;
}
