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
        // 상태 코드 확인
        if (res.statusCode !== 200) throw new Error(`Cannot get size of remote file (code: ${res.statusCode}) : ${srcUri}`);

        // 헤더 추출
        const contentLength = parseInt(res.caseless.get('content-length'));
        if (isNaN(contentLength)) throw new Error(`Cannot get size of remote file (invalid content-length header) : ${srcUri}`);

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
              // flush
              this.fdatasync(tmpPath)
                .then(() => {
                  resolve(tmpPath);
                })
                .catch(e => {
                  reject(e);
                });
            })
            .pipe(file);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  private fdatasync(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.open(path, 'a+', (err, fd) => {
        if (err) return reject(err);

        fs.fdatasync(fd, err => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }
}
