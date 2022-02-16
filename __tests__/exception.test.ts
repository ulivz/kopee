import { cp } from '../src';
import { src, dist } from './util';

describe('exception', () => {
  it('throw when "files" is invalid.', async () => {
    try {
      await cp({
        src,
        dist,
        write: false,
        files: null,
      });
    } catch (e) {
      expect(e.message).toBe('Invalid value for "files" option: null');
    }
  });

  it('throw when file pattern is invalid.', async () => {
    try {
      await cp({
        src,
        dist,
        write: false,
        files: [
          null,
        ],
      });
    } catch (e) {
      expect(e.message).toBe('Invalid file pattern: null');
    }
  });

  it('throw when file descriptors is invalid.', async () => {
    try {
      await cp({
        src,
        dist,
        write: false,
        files: [
          ['**', null],
        ],
      });
    } catch (e) {
      expect(e.message).toBe('Invalid file descriptor: null');
    }
  });
});
