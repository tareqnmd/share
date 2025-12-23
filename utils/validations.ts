import { z } from "zod";
import { FileVisibility, FileEditMode } from "@/types/enums";

export const codeFileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  language: z.string().min(1, "Language is required"),
  content: z.string().optional().default(""),
  visibility: z.nativeEnum(FileVisibility),
  editMode: z.nativeEnum(FileEditMode),
});

export type CodeFileInput = z.infer<typeof codeFileSchema>;
