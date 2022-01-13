import { copy } from '../src';
import { src, dist } from './util';

describe('copy all files', () => {
  it('default usage should be equalivant to array and object usage.', async () => {
    const stream1 = await copy({
      src,
      dist,
      write: false,
      debug: true,
    });

    expect(stream1.fileMap()).toMatchSnapshot();

    const stream2 = await copy({
      src,
      dist,
      write: false,
      debug: true,
      files: ['**'],
    });

    expect(stream2.fileMap()).toEqual(stream1.fileMap());

    const stream3 = await copy({
      src,
      dist,
      write: false,
      debug: true,
      files: {
        '**': true,
      },
    });

    expect(stream3.fileMap()).toEqual(stream1.fileMap());
  });

  it('source dir is same to out dir', async () => {
    const stream = await copy({
      src,
      dist: src,
      debug: true,
      write: false,
    });

    expect(stream.fileList.length).toBe(3);
  });
});
