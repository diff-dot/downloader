import request from 'request';
import fs from 'fs';
import tmp from 'tmp-promise';
import { RemoteFileNotFoundError } from './error/RemoteFileNotFoundError';

const DOWNLOAD_TIMEOUT = 3000;

export class Downloader {
  private readonly timeout: number;

  constructor(args?: { timeout: number }) {
    const { timeout = DOWNLOAD_TIMEOUT } = args || {};
    this.timeout = timeout;
  }

  public size(srcUri: string): Promise<number> {
    return new Promise((resolve, reject) => {
      request.head(srcUri, { followAllRedirects: true, followOriginalHttpMethod: true }, (err, res) => {
        if (err) return reject(err);

        const contentLength = parseInt(res.caseless.get('content-length'));
        if (isNaN(contentLength)) throw new Error('Cannot get size of remote file : ' + srcUri);
        return resolve(contentLength);
      });
    });
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
            .on('response', response => {
              if (response.statusCode === 404) {
                reject(new RemoteFileNotFoundError(srcUri));
              }
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
