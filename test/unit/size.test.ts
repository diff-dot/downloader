import { expect } from 'chai';
import { Downloader } from '../../src/Downloader';

describe('download', async () => {
  it('get image size of remote file', async () => {
    const downloader = new Downloader();
    const size = await downloader.size('https://yt3.ggpht.com/a-/AOh14GiwWzg6CLhEJU0bbBp6vfHPyJewjEUb2O2BNQ');
    expect(size).to.be.eq(36587);
  });
});
