// @flow
import log from 'loglevel';
import { isAppInProduction } from './env';

if (isAppInProduction) {
  log.setLevel('warn');
}

export default log;
