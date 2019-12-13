// @flow
import React, { Profiler } from 'react';
import { unstable_trace as trace } from 'scheduler/tracing';
import NP from 'number-precision';
import { hydrate, render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHookProvider } from '@apollo/react-hooks';
import UNSTATED from 'unstated-debug';
import FullStory from 'react-fullstory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PermissionsProvider from './contexts/Permissions';
import LanguageProvider from './contexts/Language';
import ViewerProvider from './contexts/Viewer';
import UIProvider from './contexts/UI';
import { isEnableStrictMode, isAppInProduction } from './utils/env';
import { useFilterSortInvalidator } from './hooks/useFilterSort';
import { useLocalSortInvalidator } from './components/Sheet/useLocalSort';
import { useColumnsInvalidator } from './components/Sheet/useColumns';
import { useResizedColumnsInvalidator } from './components/Sheet/useResizedColumns';
import DeployNotifier from './components/DeployNotifier';
import apolloClient from './apollo';
import Routes from './routes';
import loadFonts from './fonts';
import logger from './utils/logger';
import errorReport from './errorReport';
import './styles/reset.css';
import * as serviceWorker from './serviceWorker';

loadFonts();
errorReport();

UNSTATED.isEnabled = !isAppInProduction;

NP.enableBoundaryChecking(isAppInProduction);

const container = document.querySelector('#root');

if (!container) {
  throw new Error(`couldn't find element with id root`);
}

const AppHooks = () => {
  useFilterSortInvalidator();
  useLocalSortInvalidator();
  useColumnsInvalidator();
  useResizedColumnsInvalidator();
  return null;
};

const renderApp = (Component, renderFn) => {
  trace('initial render', performance.now(), () =>
    renderFn(
      <Profiler id="Application" onRender={logger.debug}>
        <div>
          {isAppInProduction && <FullStory org={process.env.ZENPORT_FULLSTORY_ID} />}
          <ApolloHookProvider client={apolloClient}>
            <ApolloProvider client={apolloClient}>
              <ViewerProvider>
                <PermissionsProvider>
                  <LanguageProvider>
                    <UIProvider>
                      <AppHooks />

                      {isAppInProduction && (
                        <DeployNotifier
                          revision={process.env.ZENPORT_FIREBASE_DEPLOY_REVISION || ''}
                          revisionKey={process.env.ZENPORT_FIREBASE_REVISION_KEY || ''}
                        />
                      )}
                      {isEnableStrictMode ? (
                        <React.StrictMode>
                          <Component />
                        </React.StrictMode>
                      ) : (
                        <Component />
                      )}
                    </UIProvider>
                  </LanguageProvider>
                </PermissionsProvider>
              </ViewerProvider>
            </ApolloProvider>
          </ApolloHookProvider>

          <ToastContainer />
        </div>
      </Profiler>,
      container
    )
  );
};

if (container.hasChildNodes()) {
  renderApp(Routes, hydrate);
} else {
  renderApp(Routes, render);
}

serviceWorker.register({
  onUpdate: registration => {
    // TODO: notify our client with toast
    logger.warn(
      'New content is available and will be used when all tabs for this page are closed',
      registration
    );
    // manual update, refer https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual_updates
    registration.update();
  },
  onSuccess: registration => {
    logger.warn('Content is cached for offline use.', registration);
  },
});
