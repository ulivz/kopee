import { copy } from '../src';
import { src, dist } from './util';

describe('copy partial files', () => {
  it('array usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: [
        'package.json',
      ],
    });

    expect(stream.fileList.length).toBe(1);
    expect(stream.fileList[0]).toBe('package.json');
  });

  it('object usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: {
        'package.json': true,
      },
    });

    expect(stream.fileList.length).toBe(1);
    expect(stream.fileList[0]).toBe('package.json');
  });
});
