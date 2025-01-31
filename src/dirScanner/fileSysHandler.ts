import { opendir, stat, unlink } from "fs/promises";
import { EventEmitter } from "events";
import path from "path";
import { FSEvent } from "./model/fsEvents";

export class FileSysScanHandler extends EventEmitter {
  rootDir;
  constructor(rootDir: string) {
    super();
    this.rootDir = rootDir;
  }

  public async scan() {
    const now = Date.now();
    const dir = await opendir(this.rootDir);
    for await (const dirent of dir) {
      if (!dirent.isFile()) {
        const fsEvent: FSEvent = {
          name: dirent.name,
          path: "no path",
          type: "file",
          size: 100,
          ageInDays: 1,
          ageInSeconds: 1,
        };
        this.emit("dir", fsEvent);
        //console.log(`[${dirent.name}]`);
        continue;
      }
      const filePath = path.join(this.rootDir, dirent.name);
      //console.log(">", filePath);
      const fileStats = await stat(filePath);
      //console.log(fileStats);
      const fsEvent: FSEvent = {
        name: dirent.name,
        path: filePath,
        type: "file",
        size: fileStats.size || 100,
        ageInDays: 1,
        ageInSeconds: 1,
      };
      this.emit("file", fsEvent);
    }
  }
}

// async function main() {
//   const f = new FileSysScanHandler(path.join(__dirname, "..", ".."));
//   await f.scan();
// }

// main()
//   .then((suc) => console.log(suc))
//   .catch((err) => console.log(err));
