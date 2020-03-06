export class RemoteFileNotFoundError extends Error {
  public uri: string;

  constructor(uri: string) {
    super('Remote file not found : ' + uri);
    this.uri = uri;
  }
}
