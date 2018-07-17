export const isDevEnvironment = process.env.NODE_ENV !== 'production';
export const isAppInProduction = process.env.APP_ENV === 'production';
export const isClientRendered = typeof document !== 'undefined';
