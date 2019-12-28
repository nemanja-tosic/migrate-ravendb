import IConfig from './IConfig';

export default class ConfigProvider {
  public static readonly Instance: ConfigProvider = new ConfigProvider(
    ConfigProvider.createDefaultConfig()
  );

  constructor(public config: IConfig) {}

  public static createDefaultConfig(): IConfig {
    return {
      database: {
        url: 'http://localhost',
        name: 'dev'
      }
    };
  }
}
