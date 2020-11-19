import { fail } from 'assert';
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

  it('에러 페이지 접속시 에러 반환', async () => {
    const downloader = new Downloader();

    // 원격지 파일 크기 확인
    try {
      await downloader.size('https://yt3.ggpht.com/a-/AOh14Gg4ktzcdooJKkDSnXCq6npjpp-zLWgYeofd_A=s68-c-k-c0x00ffffff-no-rj-mo');
      fail();
    } catch (e) {}
  });
});
