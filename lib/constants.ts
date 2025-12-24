import { FileVisibility, FileEditMode, Language } from "@/types/enums";

// File limits
export const MAX_CONTENT_LENGTH = 500000;
export const MAX_TITLE_LENGTH = 100;
export const MIN_TITLE_LENGTH = 1;
export const MAX_FILES_PER_USER = 5;

// Editor settings
export const SAVE_DEBOUNCE_MS = 1500;
export const MIN_SAVE_INTERVAL_MS = 2000;

// Assets
export const DEFAULT_AVATAR = '/assets/images/user.webp';

// Select options
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

