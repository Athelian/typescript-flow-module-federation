import * as emotion from 'emotion';
/* eslint-disable import/no-extraneous-dependencies */
import { createSerializer } from 'jest-emotion';
import IntlPolyfill from 'intl';

expect.addSnapshotSerializer(createSerializer(emotion));

const setupTest = () => {
  // https://formatjs.io/guides/runtime-environments/#server
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  } else {
    global.Intl = IntlPolyfill;
  }
};

setupTest();
