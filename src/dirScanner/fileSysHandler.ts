import { opendir, stat, unlink } from "fs/promises";
import { EventEmitter } from "events";
import path from "path";
import { FS_TYPE, FSEvent } from "./model/fsEvents";

export class FileSysScanHandler extends EventEmitter {
  rootDir;
  constructor(rootDir: string) {
    super();
    this.rootDir = rootDir;
  }

  public async scan(dirPath: string = this.rootDir): Promise<void> {
    const now = Date.now();
    try {
      const dir = await opendir(this.rootDir);
      for await (const dirent of dir) {
        const filePath = path.join(this.rootDir, dirent.name);
        const fileStats = await stat(filePath);
        const ageInSeconds = Math.floor(
          (Date.now() - fileStats.mtimeMs) / 1000
        );
        const ageInDays = Math.floor(ageInSeconds / 86400);

        const fsEvent: FSEvent = {
          name: dirent.name,
          path: filePath,
          type: dirent.isDirectory() ? FS_TYPE.DIR : FS_TYPE.FILE,
          size: fileStats.size || 0,
          ageInDays,
          ageInSeconds,
        };

        if (dirent.isDirectory()) {
          // emit dir stats and call recursevily to scan
          // files in the directory founf
          this.emit(FS_TYPE.DIR, fsEvent);
          await this.scan(filePath);
        } else {
          //emit file stats
          this.emit(FS_TYPE.FILE, fsEvent);
        }
      }
    } catch (err: any) {
      this.emit(FS_TYPE.ERROR, err.message);
    }
  }
}
