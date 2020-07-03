import FileSystemAdapter from '../filesystem/FileSystemAdapter';

import 'ts-node/register';

export default class LibraryAdapter {
  private fileSystemAdapter = new FileSystemAdapter();

  private constructor() {}

  public static createFromFileSystemConfig(path: string): LibraryAdapter {
    const adapter = new LibraryAdapter();
    adapter.loadConfig(path);
    return adapter;
  }

  public async up() {
    await this.fileSystemAdapter.up();
  }

  private loadConfig(path: string) {
    this.fileSystemAdapter.loadConfig(path);
  }
}
