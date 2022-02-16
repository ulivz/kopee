import { cp } from '../src';
import { src, dist } from './util';

describe('cp all files', () => {
  it('default usage should be equivalent to array and object usage.', async () => {
    const stream1 = await cp({
      src,
      dist,
      write: false,
      debug: true,
    });

    expect(stream1.fileMap()).toMatchSnapshot();

    const stream2 = await cp({
      src,
      dist,
      write: false,
      debug: true,
      files: ['**'],
    });

    expect(stream2.fileMap()).toEqual(stream1.fileMap());

    const stream3 = await cp({
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
    const stream = await cp({
      src,
      dist: src,
      debug: true,
      write: false,
    });

    expect(stream.fileList.length).toBe(3);
  });
});
