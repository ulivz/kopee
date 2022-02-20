import { cp } from "../src";
import { src, dist } from "./util";

const BANNER = "/* Banner*/";

describe("transform with rename option", () => {
  it("single file", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: {
        "**": true,
        "src/index.ts": {
          rename: "src/index2.ts",
          transform: (content) => `${BANNER}\n${content}`,
        },
      },
    });
    expect(stream.fileMap()).toMatchSnapshot();
    expect(stream.fileContents("src/bin.ts").startsWith(BANNER)).toBe(false);
    expect(stream.fileContents("src/index2.ts").startsWith(BANNER)).toBe(true);
  });

  it("should transformer argument should get the original filename", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: {
        "**": true,
        "src/index.ts": {
          rename: "src/index2.ts",
          transform: (content, filename) => filename,
        },
      },
    });

    expect(stream.fileContents("src/index2.ts")).toBe("src/index.ts");
  });

  it("multple files", async () => {
    const stream = await cp({
      src,
      dist,
      write: false,
      files: {
        "**": true,
        "**/*.ts": {
          rename: (filename) => filename.replace(".ts", ".js"),
          transform: (content) => `${BANNER}\n${content}`,
        },
      },
    });
    expect(stream.fileMap()).toMatchSnapshot();
    expect(stream.fileContents("src/bin.js").startsWith(BANNER)).toBe(true);
    expect(stream.fileContents("src/index.js").startsWith(BANNER)).toBe(true);
  });
});
