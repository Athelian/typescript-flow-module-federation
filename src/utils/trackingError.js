// @flow
import { captureException, captureMessage } from '@sentry/browser';
import logger from './logger';

export const trackingMessage = (msg: string) => captureMessage(msg);

export const trackingError = (error: any) => {
  logger.warn(error);
  captureException(error);
};
