import { opendir, stat, unlink } from "fs/promises";
import path from "path";

export class FileSysScanHandler {
  rootDir;
  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  public async scan() {
    const now = Date.now();
    const dir = await opendir(this.rootDir);
    for await (const dirent of dir) {
      if (!dirent.isFile()) {
        console.log(`[${dirent.name}]`);
      }
      const filePath = path.join(this.rootDir, "..", "..", dirent.name);
      console.log(">", filePath);
    }
  }
}

async function main() {
  const f = new FileSysScanHandler(__dirname);
  await f.scan();
}

main()
  .then((suc) => console.log(suc))
  .catch((err) => console.log(err));
