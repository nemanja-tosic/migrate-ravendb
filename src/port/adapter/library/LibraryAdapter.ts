import FileSystemAdapter from '../filesystem/FileSystemAdapter';

export class LibraryAdapter {
  private fileSystemAdapter = new FileSystemAdapter();

  public async up() {
    await this.fileSystemAdapter.up();
  }

  public async loadConfig(path: string) {
    await this.fileSystemAdapter.loadConfig(path);
  }
}

export async function createFromFileSystemConfig(
  path: string
): Promise<LibraryAdapter> {
  const adapter = new LibraryAdapter();
  await adapter.loadConfig(path);
  return adapter;
}
