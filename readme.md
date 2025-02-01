# VMind Directory Scanner

![NPM Version](https://img.shields.io/npm/v/my-package)
![Downloads](https://img.shields.io/npm/dm/my-package)
![License](https://img.shields.io/npm/l/my-package)
![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=flat&logo=typescript&logoColor=white)
![GitHub Actions](https://github.com/my-user/my-repo/actions/workflows/ci.yml/badge.svg)

An awesome package that does amazing things.

## 📦 Installation

````sh
npm install my-package


## Description

VMind Directory Scanner is a TypeScript/Node.js library that recursively scans a given directory, listing all files and directories while providing metadata such as name, path, size, and age. The library emits events for each file and directory found, allowing real-time processing.

## Features

- Recursively scans directories
- Emits events for files and directories
- Provides metadata: name, path, size, age (in days and seconds)
- Supports error handling via event emission

## Installation

```sh
npm install vmind-dir-scan
````

## Usage

```ts
import { FileSysScanHandler, FS_TYPE, FSEvent } from "vmind-dir-scan";

const scanner = new FileSysScanHandler("/path/to/directory");

scanner.on(FS_TYPE.FILE, (event: FSEvent) => {
  console.log(`File found: ${event.name}, Size: ${event.size}MB`);
});

scanner.on(FS_TYPE.DIR, (event: FSEvent) => {
  console.log(`Directory found: ${event.name}, Path: ${event.path}`);
});

scanner.on(FS_TYPE.ERROR, (errorMsg: string) => {
  console.error(`Error: ${errorMsg}`);
});

scanner.scan();
```

## API

### `FileSysScanHandler(rootDir: string)`

Creates a new instance of the directory scanner.

### Events

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
