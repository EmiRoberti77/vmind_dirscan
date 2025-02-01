# FileSysScanHandler

The `FileSysScanHandler` class provides a mechanism for iteratively scanning a directory tree using a queue-based approach. The class uses Node.js's asynchronous file system operations and an `EventEmitter` to handle file and directory discovery, emitting events for every found item or error.

---

## Class: FileSysScanHandler

### Constructor

```ts
constructor(rootDir: string)
```

- **Parameters:**
  - `rootDir` (string): The root directory where the scan starts.
- **Description:**  
  Creates an instance of `FileSysScanHandler`, initializing the `rootDir` and setting up the base event emitter.

---

### Method: `scanIterative(workerCount = 10)`

```ts
public async scanIterative(workerCount = 10): Promise<void>
```

- **Parameters:**
  - `workerCount` (number): The number of concurrent workers processing directories. Defaults to 10.
- **Description:**  
  Starts scanning the file system iteratively. The root directory and its subdirectories are added to a queue, and a fixed number of workers concurrently process each directory.
- **Returns:**
  - A `Promise<void>` that resolves once all directories have been scanned.

---

### Events

- **`FS_TYPE.DIR`**:  
  Emitted when a directory is found.  
  **Payload:**

  ```ts
  {
    name: string;
    path: string;
    type: FS_TYPE.DIR;
    size: number;
    ageInDays: number;
    ageInSeconds: number;
  }
  ```

- **`FS_TYPE.FILE`**:  
  Emitted when a file is found.  
  **Payload:**

  ```ts
  {
    name: string;
    path: string;
    type: FS_TYPE.FILE;
    size: number;
    ageInDays: number;
    ageInSeconds: number;
  }
  ```

- **`FS_TYPE.ERROR`**:  
  Emitted when an error occurs.  
  **Payload:**
  - A string describing the error.

---

### Usage Example

```ts
import { FileSysScanHandler } from "./FileSysScanHandler";

const scanner = new FileSysScanHandler("/path/to/root");

// Listen for events
scanner.on("FS_TYPE.DIR", (event) => {
  console.log("Directory found:", event);
});

scanner.on("FS_TYPE.FILE", (event) => {
  console.log("File found:", event);
});

scanner.on("FS_TYPE.ERROR", (error) => {
  console.error("Error occurred:", error);
});

// Start scanning
scanner.scanIterative(5).then(() => {
  console.log("Scanning completed.");
});
```

---

## How It Works

1. **Queue-Based Approach:**  
   The scanner maintains a queue of directories to scan. Each worker takes a directory from the queue and processes its entries.

2. **Concurrency Control:**  
   The `workerCount` parameter determines how many workers run concurrently. Each worker retrieves directories from the queue until the queue is empty.

3. **Event Emission:**  
   The scanner emits events for every file and directory it finds. This allows the application to react to discovered items (e.g., logging, processing files, or collecting statistics).

4. **Error Handling:**  
   Errors encountered during directory opening or file stat reading are emitted as `FS_TYPE.ERROR` events.

---

## License

This project is licensed under the [MIT License](LICENSE).
