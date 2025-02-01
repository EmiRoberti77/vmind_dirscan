# File System Event Scanner

## Overview

This project provides a **recursive file system scanner** that lists all files and directories while efficiently traversing nested folders. It uses **TypeScript**, **Node.js**, and **Zod** for type validation.

The scanner emits events when it encounters files or directories, making it suitable for applications that require file system monitoring, indexing, or clean-up tasks.

---

## Features

✅ Recursively scans directories  
✅ Uses **EventEmitter** to trigger events for files and directories  
✅ Provides **file metadata** (size, age, path, type)  
✅ Implements **Zod schema validation** for event data  
✅ Supports **error handling** for invalid paths  
✅ Optimized for **asynchronous performance** using `for await`

---

## File System Event Type

The system defines a structured format for file system events using **Zod** schema validation and TypeScript types.

### **`FSEvent` Interface**

```typescript
import { z } from "zod";

const fsEventSchema = z.object({
  name: z.string().describe("file or dir name"),
  path: z.string().describe("full path"),
  type: z.string().describe("file or dir type"),
  ageInSeconds: z.number().describe("age of file in seconds"),
  ageInDays: z.number().describe("age of file in days"),
  size: z.number().describe("file size in MB"),
});

export type FSEvent = z.infer<typeof fsEventSchema>;
```

**📌 Explanation:**

- **`name`** - The name of the file or directory
- **`path`** - The full absolute path
- **`type`** - Either `file` or `dir`
- **`ageInSeconds`** - File's age in seconds
- **`ageInDays`** - File's age in days
- **`size`** - Size of the file (for directories, this is 0)

### **Enum for File System Types**

```typescript
export enum FS_TYPE {
  FILE = "file",
  DIR = "dir",
}
```

This enum standardizes file and directory type identifiers.

---

## **Recursive File System Scanner**

### **Implementation**

```typescript
import { EventEmitter } from "events";
import { opendir, stat } from "fs/promises";
import * as path from "path";
import { FSEvent, FS_TYPE } from "./fsEventSchema";

export class FileSysScanHandler extends EventEmitter {
  rootDir: string;

  constructor(rootDir: string) {
    super();
    this.rootDir = rootDir;
  }

  public async scan(dirPath: string = this.rootDir): Promise<void> {
    try {
      const dir = await opendir(dirPath);

      for await (const dirent of dir) {
        const filePath = path.join(dirPath, dirent.name);
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
          this.emit(FS_TYPE.DIR, fsEvent);
          await this.scan(filePath); // 🔁 Recursively scan subdirectory
        } else {
          this.emit(FS_TYPE.FILE, fsEvent);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory: ${dirPath}`, error);
    }
  }
}
```

### **Usage Example**

```typescript
const scanner = new FileSysScanHandler("/your/directory/path");

scanner.on("file", (event) => {
  console.log(`File found: ${event.path}, Size: ${event.size} bytes`);
});

scanner.on("dir", (event) => {
  console.log(`Directory found: ${event.path}`);
});

scanner.scan();
```

---

## **How It Works**

1. **Initialises with a root directory**
2. **Iterates through all files and directories**
3. **Uses `fs.promises.stat()` to fetch metadata (size, age, etc.)**
4. **If a directory is found, it recursively scans it**
5. **Emits `file` or `dir` events when a file or directory is found**
6. **Supports event-driven handling of files & directories**
7. **Handles errors gracefully**

---

## **Performance Optimisations**

🚀 **Uses `for await` for efficient iteration over directories**  
🚀 **Asynchronous `fs.promises` API to prevent blocking**  
🚀 **Minimal memory footprint - processes one file at a time**  
🚀 **Leverages EventEmitter for real-time file event processing**

---

## **Conclusion**

This **file system scanner** is ideal for **batch processing**, **data indexing**, or **log management**. It efficiently traverses directories **recursively** while collecting and validating file metadata.

📌 **To extend functionality, you can:**

- Add **filters** (e.g., file extensions, age threshold)
- Implement **asynchronous batch processing**
- Store metadata in a **database or cloud storage**

---

#### **Author:** Emi Roberti

#### **License:** MIT
