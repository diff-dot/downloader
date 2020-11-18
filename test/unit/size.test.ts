import { expect } from 'chai';
import fs from 'fs';
import { promisify } from 'util';
import { Downloader } from '../../src/Downloader';

const testImagePath = 'https://yt3.ggpht.com/a-/AOh14GiwWzg6CLhEJU0bbBp6vfHPyJewjEUb2O2BNQ';
describe('download', async () => {
  it('get image size of remote file', async () => {
    const downloader = new Downloader();
    const size = await downloader.size(testImagePath);
    expect(size).to.be.eq(36587);

    const tmpPath = await downloader.download(testImagePath);
    const tmpFileStat = await promisify(fs.stat)(tmpPath);
    expect(size).to.be.eq(tmpFileStat.size);
  });
});
