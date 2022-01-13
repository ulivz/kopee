import * as path from 'path';

export const src = path.join(__dirname, 'fixtures/source-dir');
export const dist = path.join(__dirname, 'fixtures/source-dir/dist');
export const useScene = (scene: string) => {
  if (!scene) {
    return {
      src,
      dist,
    };
  }
  return {
    src: path.join(__dirname, `fixtures/${scene}`),
    dist: path.join(__dirname, `fixtures/${scene}/dist`),
  };
};
