import { FileVisibility, FileEditMode } from "@/types/enums";

export const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
] as const;

export const VISIBILITY_OPTIONS = [
  { value: FileVisibility.PUBLIC, label: "Public" },
  { value: FileVisibility.PRIVATE, label: "Private" },
] as const;

export const EDIT_MODE_OPTIONS = [
  { value: FileEditMode.OWNER, label: "Owner Only" },
  { value: FileEditMode.COLLABORATIVE, label: "Collaborative" },
] as const;

