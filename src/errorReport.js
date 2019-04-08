import LogRocket from 'logrocket';
import { init, configureScope } from '@sentry/browser';
import setupLogRocketReact from 'logrocket-react';
import { isAppInProduction, isEnableErrorReport } from './utils/env';

const errorReport = () => {
  if (isAppInProduction && isEnableErrorReport) {
    LogRocket.init(process.env.ZENPORT_LOG_ROCKET_APP_ID);
    setupLogRocketReact(LogRocket);
    init({
      dsn: process.env.ZENPORT_SENTRY_URL || '',
    });
    configureScope(scope => {
      scope.addEventProcessor(async event => {
        const { extra } = event;
        return { ...event, extra: { ...extra, sessionURL: LogRocket.sessionURL } };
      });
    });
  }
};

export default errorReport;
