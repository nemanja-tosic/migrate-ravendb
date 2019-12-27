import Changelog from './Changelog';

export default interface IChangelogRepo {
  get(): Promise<Changelog>;
  store(changelog: Changelog): Promise<void>;
}
