# VMind Directory Scanner

![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=flat&logo=typescript&logoColor=white)

An awesome package that does amazing things.

## 📦 Installation

```sh
npm install vmind_dir_scan
```

## Description

VMind Directory Scanner is a TypeScript/Node.js library that recursively scans a given directory, listing all files and directories while providing metadata such as name, path, size, and age. The library emits events for each file and directory found, allowing real-time processing.

## Features

- Recursively scans directories
- Emits events for files and directories
- Provides metadata: name, path, size, age (in days and seconds)
- Supports error handling via event emission

## Usage

The `FileSysScanHandler` class provides an easy way to iteratively scan a directory tree. You can listen to events to handle files and directories as they are discovered.

### Importing the Library

```ts
import { FileSysScanHandler, FSEvent, FS_TYPE } from "vmind_scan_dir";
```

---

```ts
import { FileSysScanHandler, FSEvent, FS_TYPE } from "vmind_scan_dir";

// Create an instance of FileSysScanHandler
const scanner = new FileSysScanHandler("/path/to/start");

// Listen for directory events
scanner.on("FS_TYPE.DIR", (event) => {
  console.log("Directory found:", event);
});

// Listen for file events
scanner.on("FS_TYPE.FILE", (event) => {
  console.log("File found:", event);
});

// Listen for errors
scanner.on("FS_TYPE.ERROR", (error) => {
  console.error("Error encountered:", error);
});

// Start the scanning process
scanner.scanIterative(5).then(() => {
  console.log("Scanning complete.");
});
```

- `file`: Emitted when a file is found. Provides an `FSEvent` object.
- `dir`: Emitted when a directory is found. Provides an `FSEvent` object.
- `error`: Emitted when an error occurs. Provides an error message.

### FSEvent Object

```ts
interface FSEvent {
  name: string; // File or directory name
  path: string; // Full path
  type: "file" | "dir"; // Type
  ageInSeconds: number; // Age of file in seconds
  ageInDays: number; // Age of file in days
  size: number; // File size in MB
}
```

## License

MIT

## Author

Emi Roberti
