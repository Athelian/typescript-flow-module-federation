import { init } from '@sentry/browser';
import { isAppInProduction, isEnableErrorReport } from './utils/env';

const errorReport = () => {
  if (isAppInProduction && isEnableErrorReport) {
    init({
      dsn: process.env.ZENPORT_SENTRY_URL || '',
      whitelistUrls: ['https://my.zenport.io', 'https://staging.zenport.io'],
    });
  }
};

export default errorReport;
