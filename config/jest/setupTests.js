import '@testing-library/jest-dom/extend-expect';
import * as emotion from 'emotion';
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

const portalRoot = document.createElement('div');
portalRoot.id = 'portal-root';

beforeAll(() => {
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  document.body.removeChild(portalRoot);
});

setupTest();
