// @flow
import * as React from 'react';
import { hydrate, render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import UNSTATED from 'unstated-debug';
import FullStory from 'react-fullstory';
import AuthenticationProvider from './modules/authentication';
import LanguageProvider from './modules/language';
import UIProvider from './modules/ui';
import apolloClient from './apollo';
import Routes from './routes';
import loadFonts from './fonts';
import { isAppInProduction } from './utils/env';
import errorReport from './errorReport';
import './styles/reset.css';

if (!isAppInProduction) {
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable global-require */
  // $FlowFixMe: not have flow typed yet
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, {
    exclude: [
      /^Consumer/,
      /^Subscribe/,
      /^FormattedMessage/,
      /^InjectIntl/,
      /^DebounceInput/,
      /^Query/,
      /^Mutation/,
    ],
  });
}

loadFonts();
errorReport();

UNSTATED.isEnabled = !isAppInProduction;

const container = document.querySelector('#root');

if (!container) {
  throw new Error(`couldn't find element with id root`);
}

const renderApp = (Component, renderFn) => {
  renderFn(
    <div>
      {isAppInProduction && <FullStory org={process.env.ZENPORT_FULLSTORY_ID} />}
      <ApolloProvider client={apolloClient}>
        <AuthenticationProvider>
          <LanguageProvider>
            <UIProvider>
              {/* $FlowFixMe: React Flow typings are not updated to React 16.3 yet */}
              <React.StrictMode>
                <Component />
              </React.StrictMode>
            </UIProvider>
          </LanguageProvider>
        </AuthenticationProvider>
      </ApolloProvider>
    </div>,
    container
  );
};

if (container.hasChildNodes()) {
  renderApp(Routes, hydrate);
} else {
  renderApp(Routes, render);
}
