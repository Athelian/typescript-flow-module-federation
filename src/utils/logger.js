// @flow
import log from 'loglevel';
import { isAppInProduction } from './env';

if (isAppInProduction) {
  log.setLevel('error');
}

export default log;
