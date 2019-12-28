import { IAuthOptions } from 'ravendb';

export default interface IConfig {
  database: {
    url: string;
    name: string;
    authOptions?: IAuthOptions;
  };
}
