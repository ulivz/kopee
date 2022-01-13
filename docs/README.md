---
home: false
sidebar: auto
---

# @nomadland/copy

## Introduction

`@nomadland/copy` is **a high-level interface for succinct files coping**, with 100% test coverage as guarantee.

## Features

- Copy all or partial files.
- Overriding files with glob patterns.
- Default content.
- Transform files with glob patterns.
- Rename files with glob patterns.
- Do not write to disk.
- Write to symtem tmp.
- Full TypeScript support.

## Install

```bash
npm install @nomadland/copy --save
```

## API

### `copy()`

- __Type__: `(opts: ICopyOptions) => Promise<ICopyStream>`

Source code of types：

- [ICopyOptions](https://github.com/ulivz/copyblob/master/src/interface.ts#L83)。 
- [ICopyStream](https://github.com/ulivz/copyblob/master/src/index.ts#L32)。 

## Usage

```bash
const copy = require('@nomadland/copy')
```

### Copy all files

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
})
```

which is equivalent to:

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: [
    '**'
  ]
})
```

and: 

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
    '**': true
  }
})
```

### Copy partial files

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: [
    'package.json'
  ]
})
```

glob patterns is also supported:

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: [
    '**/*.ts' // Only copy all *.js files.
  ]
})
```

### Override files

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
    '**': true,
    'package.json': {
      override: '{ "name": "@nomadland/copy" }'
    }
  }
})
```

which is equivalent to:

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
    '**': true,
    // package.json will be replaced with new content.
    'package.json': '{ "name": "@nomadland/copy" }'
  }
})
```

overriding function is also supported:

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
    '**': true,
    'package.json': {
      override: (filename, content) => {
        // return new content
      }
    }
  }
})
```

which is equivalent to:


```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
    '**': true,
    'package.json':  (filename, content) => {
      // return new content
    }
  }
})
```

Note that if the source files don't exists, the overriding result will be used as the default content.

You can enable the `disableOverride` flag to disable the overriding behaviors but only keep the behavior of using as default content.

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  disableOverride: true,
  files: {
    '**': true,
    // This content will be used as the default content when "package.json" doesn't exist.
    'package.json': '{}'
  }
})
```

### Transform files.

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
    '**': true,
    // Add banner in the front of all *.ts files.
    '**/*.ts': { transform: content => `${BANNER}\n${content}` }
  }
})
```

### Rename files

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
   '**': true,
   'package.json': { rename: 'config.json' }
  }
})
```

renaming function is also supported:

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
   '**': {
     rename: filename => `lib/${filename}`,
   }
  }
})
```

### Rename & transform files

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  files: {
   '**': true,
   'package.json': { 
     rename: 'package.json',
     transform: content => `${BANNER}\n${content}`,
    }
  }
})
```

### Do not write to disk

```js
copy({
  src: '/path/to/source/dir',
  dist: '/path/to/output/dir',
  write: false,
})
```

### Write to symtem tmp

```js
import { TEMP } from '@nomadland/temp'

const stream = await copy({
  src: '/path/to/source/dir',
  dist: TEMP,
  write: false,
  debug: true
})

// Get temp path with stream.destBaseDir.
```

For other usage, please refer to [unit tests](./__tests__)
