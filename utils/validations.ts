import { z } from "zod";

export const codeFileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  language: z.string().min(1, "Language is required"),
  content: z.string().optional().default(""),
  visibility: z.enum(["public", "private"]),
  editMode: z.enum(["owner", "collaborative"]),
});

export type CodeFileInput = z.infer<typeof codeFileSchema>;

