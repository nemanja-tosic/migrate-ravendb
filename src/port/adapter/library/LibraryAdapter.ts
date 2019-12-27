import FileSystemAdapter from '../filesystem/FileSystemAdapter';

export default class LibraryAdapter extends FileSystemAdapter {
  constructor() {
    super();

    this.loadConfig();
  }
}
