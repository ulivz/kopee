import { copy } from '../src';
import { src, dist } from './util';

describe('ignore files', () => {
  it('do not copy some files with explicit false - array usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: [
        '**',
        ['**/*.ts', false],
      ],
    });

    expect(stream.fileList.length).toBe(1);
    expect(stream.fileList[0]).toBe('package.json');
  });

  it('do not copy some files with explicit false - object usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: {
        '**': true,
        '**/*.ts': false,
      },
    });

    expect(stream.fileList.length).toBe(1);
    expect(stream.fileList[0]).toBe('package.json');
  });
});
