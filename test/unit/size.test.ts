import { expect } from 'chai';
import fs from 'fs';
import { promisify } from 'util';
import { Downloader } from '../../src/Downloader';

const testImagePath = 'https://yt3.ggpht.com/a-/AOh14GiwWzg6CLhEJU0bbBp6vfHPyJewjEUb2O2BNQ';
describe('download', async () => {
  it('get image size of remote file', async () => {
    const downloader = new Downloader();

    // 원격지 파일 크기 확인
    const size = await downloader.size(testImagePath);
    expect(size).to.be.eq(36587);

    // 다운로드 받은 파일의 크기 확인
    const tmpPath = await downloader.download(testImagePath);
    const tmpFileStat = await promisify(fs.stat)(tmpPath);

    // 같아야 하느니라
    expect(size).to.be.eq(tmpFileStat.size);
  });
});
