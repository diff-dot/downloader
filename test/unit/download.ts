import { expect } from 'chai';
import { Downloader } from '../../src/Downloader';
import { promisify } from 'util';
import fs from 'fs';
import { RemoteFileNotFoundError } from '../../src/error/RemoteFileNotFoundError';

function isJpeg(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 3) {
    return false;
  }

  return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
}

let tmpPath: string;

describe('download', async () => {
  it('download remote image', async () => {
    const downloader = new Downloader();
    tmpPath = await downloader.download('https://yt3.ggpht.com/a-/AOh14GiwWzg6CLhEJU0bbBp6vfHPyJewjEUb2O2BNQ');

    const tmpBin = await promisify(fs.readFile)(tmpPath);
    expect(isJpeg(tmpBin)).to.be.true;
  });

  it('download malformed uri', async () => {
    const downloader = new Downloader();

    try {
      tmpPath = await downloader.download('http://google.com/a.gif');
      expect(true).to.be.false;
    } catch (e) {
      expect(e).instanceOf(RemoteFileNotFoundError);
    }
  });

  after(async () => {
    if (tmpPath) {
      await promisify(fs.unlink)(tmpPath);
    }
  });
});
