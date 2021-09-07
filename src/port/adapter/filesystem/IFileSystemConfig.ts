import IConfig from '../config/IConfig';

export default interface IFileSystemConfig extends IConfig {
  migrationsDirectory: string;
}
