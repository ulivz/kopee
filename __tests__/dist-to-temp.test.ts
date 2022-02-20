import * as os from "os";
import { cp, TEMP } from "../src";
import { src, dist } from "./util";

it("write to temp dir", async () => {
  const stream = await cp({
    src,
    dist: TEMP,
  });

  expect(stream.destBaseDir.startsWith(os.tmpdir())).toBe(true);

  const stream2 = await cp({
    src: stream.destBaseDir,
    dist,
    write: false,
  });

  expect(stream.fileMap()).toEqual(stream2.fileMap());
});
