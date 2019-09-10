// @flow
import log from 'loglevel';
import { isAppInProduction } from './env';

log.setLevel('info');

if (isAppInProduction) {
  log.setLevel('error');
}

export default log;
