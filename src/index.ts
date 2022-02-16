/**
 * @license
 * Copyright (c) ULIVZ. All Rights Reserved.
 */

import * as path from "path";
import * as os from "os";
import * as fs from "fs-extra";
import tildify from "tildify";
import matcher from "micromatch";
import { majo, Majo } from "majo";
import { createMajoFileSync } from "./utils";
import { normalizeFileDescriptors } from "./normalize";

export * from "./interface";
import {
  INormalizedDescriptor,
  INormalizedDescriptors,
  ICopyOptions,
  IFilesMap,
} from "./interface";

const debug = require("debug")("cp");

declare module "majo" {
  interface Majo {
    fileMap: () => IFilesMap;
    srcFileMap: () => IFilesMap;
    _srcFileMap: IFilesMap;
    destBaseDir: string;
    existsSync(filename: string): boolean;
  }
}

Majo.prototype.fileMap = function () {
  return getFilesMap(this);
};

Majo.prototype.srcFileMap = function () {
  return this._srcFileMap;
};

export { majo, Majo };

export const TEMP = "TEMP";

export { Majo as ICopyStream };

const MEDIA_FILE_REG = /^.*\.(jpg|png|webp|mov|mp4|gif|doc|pdf)$/i;

export async function cp(opts: ICopyOptions): Promise<Majo> {
  const {
    src: sourceDir,
    files: fileDescriptors = ["**"],
    debug: displayLog = false,
    write: writeToDisk = true,
    skipIfNotExists: globalSkipIfNotExists = false,
    disableOverride = false,
    enableMigrateMode = false,
  } = opts;

  let { dist: targetDir } = opts;

  if (targetDir === TEMP) {
    targetDir = path.join(
      os.tmpdir(),
      new Date().getTime().toString(36) + Math.random().toString(36)
    );
    fs.ensureDirSync(targetDir);
  }

  if (displayLog) {
    require("debug").enable("cp");
  }

  /**
   * Normalize snippets
   */
  const nFileDescriptors: INormalizedDescriptors =
    normalizeFileDescriptors(fileDescriptors);
  if (nFileDescriptors === null) {
    throw new Error(`Invalid value for "files" option: ${fileDescriptors}`);
  }

  const normalize =
    sourceDir === targetDir ? (filepath: string): string => filepath : tildify;

  /**
   * A majo middleware to cache source files.
   */
  function cacheSourcefilesMiddleware(stream: Majo): void {
    stream._srcFileMap = getFilesMap(stream);
  }

  /**
   * A majo middleware to handle core functions for cp.
   */
  async function coreMiddleware(stream: Majo): Promise<void> {
    await Promise.all(nFileDescriptors.map(async (descriptor: INormalizedDescriptor) => {
      const [
        pattern,
        {
          transform,
          rename,
          skipIfNotExists = false,
          ignored,
          override: overrideGetter,
        },
      ] = descriptor;

      debug("enter pattern", pattern);

      if (ignored) {
        return;
      }

      const { fileList } = stream;
      const targetFiles = matcher(fileList, pattern);

      /**
       * Handle that source files doesn't exists.
       */
      if (targetFiles.length === 0) {
        const abFilepath = path.join(sourceDir, pattern);

        if (overrideGetter) {
          let defaultContent = overrideGetter;
          if (typeof overrideGetter === "function") {
            defaultContent = overrideGetter(pattern);
          }

          debug("Created", normalize(pattern));
          stream.createFile(
            pattern,
            createMajoFileSync(abFilepath, defaultContent as string)
          );
        } else if (skipIfNotExists || globalSkipIfNotExists) {
          return;
        } else {
          throw new Error(`"${pattern}" not exist！`);
        }

        return;
      }

      /**
       * Handle that source files exists
       */
      await Promise.all(targetFiles.map(async (filename: string) => {
        if (MEDIA_FILE_REG.test(filename)) {
          return;
        }
        let fileContent = stream.fileContents(filename);

        if (rename) {
          const outputFilename =
            typeof rename === "function"
              ? rename(filename)
              : typeof rename === "string"
              ? rename
              : filename;

          /**
           * Only apply renaming when the target filename isn't same to filename.
           * Or the new file will be deleted after it was created.
           */
          if (filename !== outputFilename) {
            stream.rename(filename, outputFilename);
            filename = outputFilename;
          }
        }

        if (typeof transform === "function") {
          fileContent = await transform.call(opts, fileContent, filename);
          debug("Transformed", normalize(filename));
          stream.writeContents(filename, fileContent as string);
        }

        if (overrideGetter && !disableOverride) {
          let overrideContent = overrideGetter;
          if (typeof overrideGetter === "function") {
            overrideContent = overrideGetter(pattern, fileContent);
          }
          stream.writeContents(filename, overrideContent as string);
        }

        debug("copied", normalize(filename));
      }));
    }));
  }

  const globalPatterns = nFileDescriptors.map((descriptor) => {
    const [pattern, { ignored }] = descriptor;
    return ignored ? `!${pattern}` : pattern;
  });

  debug("globalPatterns", globalPatterns);

  const stream = majo();
  await stream
    .source(globalPatterns, { baseDir: sourceDir })
    .use(cacheSourcefilesMiddleware)
    .use(coreMiddleware);

  /**
   * Handle `write`
   */
  if (writeToDisk) {
    await stream.dest("", { baseDir: targetDir });
  } else {
    await stream.process();
  }

  /**
   * Handle `enableMigrateMode`
   */
  if (enableMigrateMode && sourceDir === targetDir) {
    const srcFileMap = stream.srcFileMap();
    const distFileMap = stream.fileMap();
    const srcFilePaths = Object.keys(srcFileMap);
    await Promise.all(
      srcFilePaths.map(async (srcFilePath) => {
        const absFilePath = path.join(sourceDir, srcFilePath);
        if (!distFileMap[srcFilePath] && fs.existsSync(absFilePath)) {
          await fs.remove(absFilePath);
        }
      })
    );
  }

  stream.destBaseDir = targetDir;
  stream.existsSync = (filename: string) => {
    return !!stream.file(filename);
  };

  return stream;
}

function getFilesMap(stream: Majo) {
  return stream.fileList.reduce<IFilesMap>((memo, filename) => {
    memo[filename] = stream.fileContents(filename);
    return memo;
  }, {});
}
