export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PREVIEW: '/preview',
  MESSAGES: '/messages',
  LOGIN: '/login',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
