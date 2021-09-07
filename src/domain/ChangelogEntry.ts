export default class ChangelogEntry {
  public readonly id: string;

  public readonly description: string;

  public readonly appliedAt: Date = new Date();

  constructor(id: string, description: string) {
    this.id = id;
    this.description = description;
  }
}
