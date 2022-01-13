import * as os from 'os';
import { copy, TEMP } from '../src';
import { src, dist } from './util';

it('write to temp dir', async () => {
  const stream = await copy({
    src,
    dist: TEMP,
  });

  expect(stream.destBaseDir.startsWith(os.tmpdir())).toBe(true);

  const stream2 = await copy({
    src: stream.destBaseDir,
    dist,
    write: false,
  });

  expect(stream.fileMap()).toEqual(stream2.fileMap());
});
