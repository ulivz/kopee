import { copy } from '../src';
import { src, dist } from './util';

const BANNER = '/* Banner*/';

describe('transform with rename option', () => {
  it('single file', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: {
        '**': true,
        'src/index.ts': {
          rename: 'src/index2.ts',
          transform: content => `${BANNER}\n${content}`,
        },
      },
    });
    expect(stream.fileMap()).toMatchSnapshot();
    expect(stream.fileContents('src/bin.ts').startsWith(BANNER)).toBe(false);
    expect(stream.fileContents('src/index2.ts').startsWith(BANNER)).toBe(true);
  });

  it('multple files', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: {
        '**': true,
        '**/*.ts': {
          rename: filename => filename.replace('.ts', '.js'),
          transform: content => `${BANNER}\n${content}`,
        },
      },
    });
    expect(stream.fileMap()).toMatchSnapshot();
    expect(stream.fileContents('src/bin.js').startsWith(BANNER)).toBe(true);
    expect(stream.fileContents('src/index.js').startsWith(BANNER)).toBe(true);
  });
});
