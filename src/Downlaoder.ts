import request from 'request';
import fs from 'fs';
import tmp from 'tmp-promise';

const DOWNLOAD_TIMEOUT = 3000;

export class Downloader {
  private readonly timeout: number;

  constructor(args?: { timeout: number }) {
    const { timeout = DOWNLOAD_TIMEOUT } = args || {};
    this.timeout = timeout;
  }

  public download(srcUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      tmp
        .tmpName()
        .then(tmpPath => {
          const file = fs.createWriteStream(tmpPath);
          request(srcUri, {
            encoding: null,
            timeout: this.timeout
          })
            .on('error', err => {
              reject(err);
            })
            .on('complete', () => {
              resolve(tmpPath);
            })
            .pipe(file);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}