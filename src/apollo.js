// @flow
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import Raven from 'raven-js';
import { isDevEnvironment } from './utils/env';
import { getAuthToken, reloadPageOnExpireToken } from './utils/auth';
import introspectionQueryResultData from './generated/fragmentTypes.json';
import logger from './utils/logger';

const errorLogger = errors => {
  errors.forEach(error => {
    const { message, locations, path } = error;
    if (!isDevEnvironment) {
      if (!(path && path.includes('login'))) Raven.captureException(error, error);
    } else {
      logger.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    }
    if (message.includes('Token is invalid')) {
      reloadPageOnExpireToken();
    }
  });
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    errorLogger(graphQLErrors);
  }

  if (networkError) {
    logger.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = createHttpLink({
  uri: `${process.env.ZENPORT_SERVER_URL || ''}/graphql`,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${getAuthToken()}`,
  },
}));

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  }),
});

export default client;
