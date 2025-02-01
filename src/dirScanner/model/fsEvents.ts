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

export enum FS_TYPE {
  FILE = "file",
  DIR = "dir",
}
