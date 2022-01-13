import { isPlainObject } from "./utils";
import {
  IFileDescriptor,
  IFileDescriptorArray,
  IFileDescriptorMap,
  IFileDescriptors,
  IFileObjectDescriptor,
  INomalizedDescriptors,
} from "./interface";

export function normalizeFileDescriptor(
  descriptor: IFileDescriptor
): IFileObjectDescriptor {
  if (isPlainObject(descriptor)) {
    return descriptor as IFileObjectDescriptor;
  }
  if (typeof descriptor === "string" || typeof descriptor === "function") {
    return { override: descriptor };
  }
  if (descriptor === true) {
    return {};
  }
  if (descriptor === false) {
    return { ignored: true };
  }
  throw new Error(`Invalid file descriptor: ${descriptor}`);
}

/**
 * Normalize @IFileDescriptors to @INomalizedDescriptors
 */
export function normalizeFileDescriptors(
  descriptors: IFileDescriptors
): INomalizedDescriptors | null {
  if (Array.isArray(descriptors)) {
    return (descriptors as IFileDescriptorArray).map((descriptor) => {
      descriptor = Array.isArray(descriptor) ? descriptor : [descriptor];

      const [pattern, fileDescriptor = {}] = descriptor;

      if (typeof pattern !== "string") {
        throw new Error(`Invalid file pattern: ${pattern}`);
      }

      const objectDescriptor = normalizeFileDescriptor(fileDescriptor);

      return [pattern, objectDescriptor];
    });
  }

  if (isPlainObject(descriptors)) {
    return Object.keys(descriptors as IFileDescriptorMap).map(
      (pattern: string) => {
        const descriptor = descriptors[pattern];
        const objectDescriptor = normalizeFileDescriptor(descriptor);

        return [pattern, objectDescriptor];
      }
    );
  }

  return null;
}
