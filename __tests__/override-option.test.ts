import { copy } from '../src';
import { src, dist } from './util';

describe('override option', () => {
  it('non-existed files - throw when override is not given - array usage', async () => {
    try {
      await copy({
        src,
        dist,
        write: false,
        files: [
          '**',
          'config.json',
        ],
      });
    } catch (e) {
      expect(e.message).toBe('"config.json" not exist！');
    }
  });

  it('non-existed files - throw when override is not given - object usage', async () => {
    try {
      await copy({
        src,
        dist,
        write: false,
        files: {
          '**': true,
          'config.json': true,
        },
      });
    } catch (e) {
      expect(e.message).toBe('"config.json" not exist！');
    }
  });

  it('non-existed files - local skipIfNotExists - array usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: [
        '**',
        ['config.json', { skipIfNotExists: true }],
      ],
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.file('config.json')).toBe(undefined);
  });

  it('non-existed files - local skipIfNotExists - object usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: {
        '**': true,
        'config.json': {
          skipIfNotExists: true,
        },
      },
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.file('config.json')).toBe(undefined);
  });

  it('non-existed files - global skipIfNotExists - array usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      skipIfNotExists: true,
      files: [
        '**',
        'config.json',
      ],
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.file('config.json')).toBe(undefined);
  });

  it('non-existed files - global skipIfNotExists - object usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      skipIfNotExists: true,
      files: {
        '**': true,
        'config.json': true,
      },
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.file('config.json')).toBe(undefined);
  });

  it('non-existed files - with override content - array usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: [
        '**',
        ['config.json', { override: '{}' }],
      ],
    });

    expect(stream.fileList.length).toBe(4);
    expect(stream.fileContents('config.json')).toBe('{}');
  });

  it('non-existed files - with override content - object usage', async () => {
    const stream = await copy({
      src,
      dist,
      write: false,
      files: {
        '**': true,
        'config.json': {
          override: '{}',
        },
      },
    });

    expect(stream.fileList.length).toBe(4);
    expect(stream.fileContents('config.json')).toBe('{}');
  });

  it('non-existed files - shortcut of override content - array usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: [
        '**',
        ['config.json', '{}'],
      ],
    });

    expect(stream.fileList.length).toBe(4);
    expect(stream.fileContents('config.json')).toBe('{}');
  });

  it('non-existed files - shortcut of override content - object usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: {
        '**': true,
        'config.json': '{}',
      },
    });

    expect(stream.fileList.length).toBe(4);
    expect(stream.fileContents('config.json')).toBe('{}');
  });

  it('non-existed files - override content function - array usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: [
        '**',
        ['config.json', {
          override: filename => filename,
        }],
      ],
    });

    expect(stream.fileList.length).toBe(4);
    expect(stream.fileContents('config.json')).toBe('config.json');
  });

  it('non-existed files - override content function - object usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: {
        '**': true,
        'config.json': {
          override: filename => filename,
        },
      },
    });

    expect(stream.fileList.length).toBe(4);
    expect(stream.fileContents('config.json')).toBe('config.json');
  });

  it('existed files - static content - array usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: [
        '**',
        ['package.json', {
          override: '{}',
        }],
      ],
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).toBe('{}');
  });

  it('existed files - static content - object usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: {
        '**': true,
        'package.json': {
          override: '{}',
        },
      },
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).toBe('{}');
  });

  it('existed files - shorcut of static content - array usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: [
        '**',
        ['package.json', '{}'],
      ],
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).toBe('{}');
  });

  it('existed files - shorcut of static content - object usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: {
        '**': true,
        'package.json': '{}',
      },
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).toBe('{}');
  });

  it('existed files - override content function - array usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: [
        '**',
        ['package.json', {
          override: filename => filename,
        }],
      ],

    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).toBe('package.json');
  });

  it('existed files - override content function - object usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      files: {
        '**': true,
        'package.json': {
          override: filename => filename,
        },
      },
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).toBe('package.json');
  });

  it('existed files - override content function - disableOverride - array usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      disableOverride: true,
      files: [
        '**',
        ['package.json', {
          override: filename => filename,
        }],
      ],
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).not.toBe('package.json');
  });

  it('existed files - override content function - object usage', async () => {
    const stream = await copy({
      src,
      dist: src,
      write: false,
      disableOverride: true,
      files: {
        '**': true,
        'package.json': {
          override: filename => filename,
        },
      },
    });

    expect(stream.fileList.length).toBe(3);
    expect(stream.fileContents('package.json')).not.toBe('package.json');
  });
});
