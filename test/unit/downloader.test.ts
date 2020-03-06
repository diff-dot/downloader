import { expect } from 'chai';
import { Downloader } from '../../src/Downlaoder';
import { promisify } from 'util';
import fs from 'fs';

function isJpeg(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 3) {
    return false;
  }

  return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
}

let tmpPath: string;
describe('downloader', async () => {
  it('download remote image', async () => {
    const downloader = new Downloader();
    tmpPath = await downloader.download('https://yt3.ggpht.com/a-/AOh14GiwWzg6CLhEJU0bbBp6vfHPyJewjEUb2O2BNQ');

    const tmpBin = await promisify(fs.readFile)(tmpPath);
    expect(isJpeg(tmpBin)).to.be.true;
  });

  after(async () => {
    if (tmpPath) {
      await promisify(fs.unlink)(tmpPath);
    }
  });
});
