import { cp } from "../src";
import { useScene } from "./util";

const { src, dist } = useScene("images");

describe("cp images", () => {
  it("should not change images after coping.", async () => {
    const stream = await cp({
      src,
      dist,
      debug: true,
      write: false,
    });
    expect(stream.fileMap()).toStrictEqual(stream.srcFileMap());
  });

  it("should not change images when `transform` option is specified.", async () => {
    const stream = await cp({
      src,
      dist,
      debug: true,
      write: false,
      files: {
        "**": {
          transform(content) {
            return `${content}10000`;
          },
        },
      },
    });

    const fileMap = stream.fileMap();
    const srcFileMap = stream.srcFileMap();
    expect(fileMap).not.toEqual(srcFileMap);
    /**
     * images should not be modified
     */
    expect(fileMap["cat.jpg"]).toBe(srcFileMap["cat.jpg"]);
    expect(fileMap["dog.jpg"]).toBe(srcFileMap["dog.jpg"]);
    /**
     * other files should not be modified
     */
    expect(fileMap["index.md"]).not.toBe(srcFileMap["index.md"]);
    expect(srcFileMap["index.md"].includes("10000")).toBe(false);
    expect(fileMap["index.md"].includes("10000")).toBe(true);
  });
});
