// @flow
import { captureException, captureMessage } from '@sentry/browser';

export const trackingMessage = (msg: string) => captureMessage(msg);

export const trackingError = (error: any) => captureException(error);
