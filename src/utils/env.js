// @flow
export const isDevEnvironment: boolean = process.env.NODE_ENV !== 'production';
export const isAppInProduction: boolean = process.env.NODE_ENV === 'production';
export const isClientRendered: boolean = typeof document !== 'undefined';
