import { FileVisibility, FileEditMode, Language } from "@/types/enums";

export const LANGUAGE_OPTIONS = [
  { value: Language.JAVASCRIPT, label: "JavaScript" },
  { value: Language.TYPESCRIPT, label: "TypeScript" },
  { value: Language.PYTHON, label: "Python" },
  { value: Language.HTML, label: "HTML" },
  { value: Language.CSS, label: "CSS" },
  { value: Language.JSON, label: "JSON" },
  { value: Language.MARKDOWN, label: "Markdown" },
  { value: Language.PLAINTEXT, label: "Plain Text" },
] as const;

export const VISIBILITY_OPTIONS = [
  { value: FileVisibility.PUBLIC, label: "Public" },
  { value: FileVisibility.PRIVATE, label: "Private" },
] as const;

export const EDIT_MODE_OPTIONS = [
  { value: FileEditMode.OWNER, label: "Owner Only" },
  { value: FileEditMode.COLLABORATIVE, label: "Collaborative" },
] as const;

