import { z } from "zod";

const fsEventSchema = z.object({
  name: z.string().describe("file or dir name"),
  path: z.string().describe("full path"),
  type: z.string(),
  ageInSeconds: z.number().describe("age of file in seconds"),
  ageInDays: z.number().describe("age of file in days"),
  size: z.number().describe('"file size in MB"'),
});

export type FSEvent = z.infer<typeof fsEventSchema>;
