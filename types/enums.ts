export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum AppRoutes {
  HOME = '/',
  DASHBOARD = '/dashboard',
  PUBLIC_FILES = '/public',
  SIGN_IN = '/auth/signin', // Though we use google provider directly usually
  CODE = '/code',
}

export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum FileEditMode {
  OWNER = 'owner',
  COLLABORATIVE = 'collaborative',
}

