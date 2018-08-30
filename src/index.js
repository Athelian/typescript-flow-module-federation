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

loadFonts();
errorReport();
UNSTATED.isEnabled = !isAppInProduction;

const container = document.querySelector('#root');

if (!container) {
  throw new Error(`couldn't find element with id root`);
}

const renderApp = (Component, renderFn) => {
  renderFn(
    <React.Fragment>
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
    </React.Fragment>,
    container
  );
};

if (container.hasChildNodes()) {
  renderApp(Routes, hydrate);
} else {
  renderApp(Routes, render);
}
