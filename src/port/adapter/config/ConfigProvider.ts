import IConfig from './IConfig';

export default class ConfigProvider {
  public static Instance: ConfigProvider = new ConfigProvider();

  constructor(public config: IConfig = ConfigProvider.createDefaultConfig()) {}

  public static createDefaultConfig(): IConfig {
    return {
      databaseUrl: 'http://localhost',
      databaseName: 'dev'
    };
  }
}
