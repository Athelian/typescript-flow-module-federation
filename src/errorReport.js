import LogRocket from 'logrocket';
import Raven from 'raven-js';
import setupLogRocketReact from 'logrocket-react';
import { isAppInProduction } from './utils/env';

const errorReport = () => {
  if (isAppInProduction) {
    LogRocket.init(process.env.ZENPORT_LOG_ROCKET_APP_ID);
    setupLogRocketReact(LogRocket);
    Raven.config(process.env.ZENPORT_SENTRY_URL || '').install();
    Raven.setDataCallback(data => {
      const { extra } = data;
      return { ...data, extra: { ...extra, sessionURL: LogRocket.sessionURL } };
    });
  }
};

export default errorReport;
