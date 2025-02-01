import { opendir, stat } from "fs/promises";
import { EventEmitter } from "events";
import path from "path";
import { FS_TYPE, FSEvent } from "./model/fsEvents";

export class FileSysScanHandler extends EventEmitter {
  rootDir: string;

  constructor(rootDir: string) {
    super();
    this.rootDir = rootDir;
  }

  /**
   * Iterative scan using a shared work queue and fixed worker concurrency.
   */
  public async scanIterative(workerCount = 10): Promise<void> {
    // The queue holds directories that still need scanning.
    const queue: string[] = [this.rootDir];

    // Worker function: each worker continuously grabs a directory from the queue.
    const worker = async () => {
      while (true) {
        // Get the next directory. Use shift() to remove from the queue.
        const currentDir = queue.shift();
        if (!currentDir) {
          // If the queue is empty, exit the loop.
          break;
        }

        try {
          const dir = await opendir(currentDir);
          // Process each entry in the directory.
          for await (const dirent of dir) {
            const filePath = path.join(currentDir, dirent.name);
            let fileStats;
            try {
              fileStats = await stat(filePath);
            } catch (statError: any) {
              // Emit an error event for stat errors and skip this entry.
              this.emit(
                FS_TYPE.ERROR,
                `stat error for ${filePath}: ${statError.message}`
              );
              continue;
            }

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
              // Emit an event for the directory and add it to the queue.
              this.emit(FS_TYPE.DIR, fsEvent);
              queue.push(filePath);
            } else {
              // Emit an event for the file.
              this.emit(FS_TYPE.FILE, fsEvent);
            }
          }
        } catch (opendirError: any) {
          // Emit an error event if opening the directory fails.
          this.emit(
            FS_TYPE.ERROR,
            `opendir error for ${currentDir}: ${opendirError.message}`
          );
        }
      }
    };

    // Create an array of worker promises.
    const workers: Promise<void>[] = [];
    for (let i = 0; i < workerCount; i++) {
      workers.push(worker());
    }

    // Wait until all workers complete.
    await Promise.all(workers);
  }
}
