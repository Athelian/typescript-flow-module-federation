// @flow
import * as React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import Raven from 'raven-js';
import FullStory from 'react-fullstory';
import LanguageProvider from './modules/language';
import { isDevEnvironment, isAppInProduction } from './utils/env';
import apolloClient from './apollo';
import Routes from './routes';
import loadFonts from './fonts';
import './styles/reset.css';

loadFonts();

if (!isDevEnvironment) {
  Raven.config(process.env.ZENPORT_SENTRY_URL || '').install();
}

const container = document.querySelector('#root');

if (!container) {
  throw new Error(`couldn't find element with id root`);
}

/* eslint-disable react/jsx-filename-extension */
const renderApp = Component => {
  render(
    <ApolloProvider client={apolloClient}>
      <LanguageProvider>
        <React.Fragment>
          {isAppInProduction && <FullStory org={process.env.ZENPORT_FULLSTORY_ID} />}
          <Component />
        </React.Fragment>
      </LanguageProvider>
    </ApolloProvider>,
    container
  );
};

renderApp(Routes);
