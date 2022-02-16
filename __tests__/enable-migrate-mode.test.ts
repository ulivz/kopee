/**
 * Module dependencies
 */
import { join } from 'path';
import { cp } from '../src';
import { useScene, src } from './util';
import { fs } from 'majo';

/**
 * Since `enableMigrateMode` will modify `src` directly, using code to create fixture here 
 */
async function prepareFixture(name: string) {
  const fixture = useScene(`tmp_enableMigrateMode_${name}`);
  if (fs.existsSync(fixture.src)) {
    await fs.remove(fixture.src);
  }
  await fs.copy(src, fixture.src);
  return fixture.src;
}

describe('enableMigrateMode', () => {
  it('rename', async () => {
    const fixture = await prepareFixture('rename');

    const stream = await cp({
      src: fixture,
      dist: fixture,
      write: true,
      debug: true,
      enableMigrateMode: true,
      files: {
        '**/*.ts': {
          rename: name => {
            return name.replace(/\.ts$/, '.js')
          }
        },
      }
    });

    const exists = (filename: string) => {
      return fs.existsSync(join(fixture, filename))
    }

    expect(stream.existsSync('src/index.ts')).toBe(false)
    expect(stream.existsSync('src/index.js')).toBe(true)
    expect(stream.existsSync('src/bin.ts')).toBe(false)
    expect(stream.existsSync('src/bin.js')).toBe(true)
    expect(stream.existsSync('package.json')).toBe(false)

    expect(exists('src/index.ts')).toBe(false)
    expect(exists('src/index.js')).toBe(true)
    expect(exists('src/bin.ts')).toBe(false)
    expect(exists('src/bin.js')).toBe(true)
    expect(exists('package.json')).toBe(true)
  });

  // TODO Support delete files
  it.skip('delete files', async () => {
    const fixture = await prepareFixture('delete-files');
    
    await cp({
      src: fixture,
      dist: fixture,
      write: true,
      debug: true,
      enableMigrateMode: true,
      files: {
        '**': true,
        '**/*.ts': false
      }
    });

    const exists = (filename: string) => {
      return fs.existsSync(join(fixture, filename))
    }

    expect(exists('src/index.ts')).toBe(false)
    expect(exists('src/bin.ts')).toBe(false)
    expect(exists('package.json')).toBe(true)
  });
});
