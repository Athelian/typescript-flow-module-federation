// @flow
export const isEnableBetaFeature: boolean = parseInt(process.env.ZENPORT_BETA_FEATURE, 10) !== 0;
export const isDevEnvironment: boolean = process.env.NODE_ENV !== 'production';
export const isAppInProduction: boolean = process.env.NODE_ENV === 'production';
export const isClientRendered: boolean = typeof document !== 'undefined';
