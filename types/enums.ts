// User & Auth
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Routing
export enum AppRoutes {
  HOME = '/',
  DASHBOARD = '/dashboard',
  PUBLIC_FILES = '/public',
  SIGN_IN = '/auth/signin',
  CODE = '/code',
}

// File settings
export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum FileEditMode {
  OWNER = 'owner',
  COLLABORATIVE = 'collaborative',
}

// Editor
export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  HTML = 'html',
  CSS = 'css',
  JSON = 'json',
  MARKDOWN = 'markdown',
  PLAINTEXT = 'plaintext',
}

export enum SaveStatus {
  SAVED = 'saved',
  SAVING = 'saving',
  UNSAVED = 'unsaved',
}

// UI Components
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger',
  GHOST = 'ghost',
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum AvatarSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum DropdownItemVariant {
  DEFAULT = 'default',
  DANGER = 'danger',
}
