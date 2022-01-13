/**
 * Transform file.
 */
export type TransformerType = (
  this: ICopyOptions,
  content: string,
  filename: string
) => string;
/**
 * Rename file.
 */
export type RenamerType = (originalName: string) => string;
/**
 * Set default content, it will be used when the source
 * file doesn't exist.
 */
export type OverrideFnType = (filename: string, content?: string) => string;

/**
 * A inteface to describe file action.
 */
export interface IFileObjectDescriptor {
  /**
   * Transform the file.
   */
  transform?: TransformerType;
  /**
   * Rename the source file.
   */
  rename?: string | RenamerType;
  /**
   * Whether to skip existence check when the source file
   * doesn't exist, Note that the check will be disabled
   * when the 'default' content is given.
   */
  skipIfNotExists?: boolean;
  /**
   * Override content.
   * Note that if the source files don't exists, the overriding
   * result will be used as the default content.
   */
  override?: string | OverrideFnType;
  /**
   * Whether to ignore this file.
   */
  ignored?: boolean;
}

/**
 * Combined descriptor.
 */
export type IFileDescriptor =
  | IFileObjectDescriptor
  | boolean
  | string
  | OverrideFnType;

/**
 * Array item for usage of descriptors.
 */
export type IFileDescriptorArrayItem = string | [string, IFileDescriptor?];

/**
 * Array usage of descriptors for users.
 */
export type IFileDescriptorArray = Array<IFileDescriptorArrayItem>;

/**
 * Map usage of descriptors for users.
 */
export interface IFileDescriptorMap {
  [pattern: string]: IFileDescriptor;
}

/**
 * Descriptor interface for users.
 */
export type IFileDescriptors = IFileDescriptorArray | IFileDescriptorMap;

/**
 * Normalized descriptor.
 */
export type INomalizedDescriptor = [
  string /* pattern */,
  IFileObjectDescriptor
];

/**
 * Normalized descriptors.
 */
export type INomalizedDescriptors = Array<INomalizedDescriptor>;

/**
 * User options.
 */
export interface ICopyOptions {
  /**
   * Source directory.
   */
  src: string;
  /**
   * Output directory.
   */
  dist: string;
  /**
   * Files handler.
   */
  files?: IFileDescriptors;
  /**
   * Debug flag.
   */
  debug?: boolean;
  /**
   * Whether to write to disk.
   */
  write?: boolean;
  /**
   * Global skipIfNotExists
   */
  skipIfNotExists?: boolean;
  /**
   * Disable the "override" option under file descriptor.
   * the overriding content will be fallback to default content.
   */
  disableOverride?: boolean;
  /**
   * Enable migrate mode, it will clean source files that have been renamed.
   *
   * NOTE: It only takes effect when `src` is same to `dist`.
   */
  enableMigrateMode?: boolean;
}

export interface IFilesMap {
  [pattern: string]: string;
}
