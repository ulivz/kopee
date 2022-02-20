import { cp } from "../src";
import { src, dist } from "./util";

describe("rename option", () => {
  it("rename - rename with same name - array usage", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: [["**", { rename: (filename) => filename }]],
    });

    expect(stream.fileList).toEqual([
      "package.json",
      "src/bin.ts",
      "src/index.ts",
    ]);
  });

  it("rename - rename with same name - object usage", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: {
        "**": {
          rename: (filename) => filename,
        },
      },
    });

    expect(stream.fileList).toEqual([
      "package.json",
      "src/bin.ts",
      "src/index.ts",
    ]);
  });

  it("rename - with glob and rename function - array usage", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: [["**", { rename: (filename) => `r_${filename}` }]],
    });

    expect(stream.fileList).toEqual([
      "r_package.json",
      "r_src/bin.ts",
      "r_src/index.ts",
    ]);
  });

  it("rename - with glob and rename function - object usage", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: {
        "**": {
          rename: (filename) => `r_${filename}`,
        },
      },
    });

    expect(stream.fileList).toEqual([
      "r_package.json",
      "r_src/bin.ts",
      "r_src/index.ts",
    ]);
  });

  it("rename - with file path and static name - array usage", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: ["**", ["package.json", { rename: "config.json" }]],
    });

    expect(stream.fileList).toEqual([
      "config.json",
      "src/bin.ts",
      "src/index.ts",
    ]);
  });

  it("rename - with file path and static name - object usage", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: {
        "**": true,
        "package.json": { rename: "config.json" },
      },
    });

    expect(stream.fileList).toEqual([
      "config.json",
      "src/bin.ts",
      "src/index.ts",
    ]);
  });
});
