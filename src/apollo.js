// @flow
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { navigate } from '@reach/router';
import { getOperationAST } from 'graphql/utilities/getOperationAST';
import { print } from 'graphql/language/printer';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink, Observable, type Operation } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { isDevEnvironment } from './utils/env';
import introspectionQueryResultData from './generated/fragmentTypes.json';
import logger from './utils/logger';

class SubscriptionSSE {
  // $FlowFixMe missing EventSource https://github.com/facebook/flow/issues/6493
  source: ?EventSource;

  subscribe(operation, handler) {
    const { query, variables, operationName } = operation;

    this.source = new EventSource(
      encodeURI(
        `${process.env.ZENPORT_SERVER_URL ||
          ''}/graphql?query=${query}&operationName=${operationName}&variables=${JSON.stringify(
          variables
        )}`
      ),
      { withCredentials: true }
    );
    this.source.onmessage = msg => {
      try {
        // heartbeat
        if (msg.data === '') {
          return;
        }

        handler(JSON.parse(String(msg.data)));
      } catch (e) {
        logger.error(e);
      }
    };
    this.source.onerror = () => {
      this.unsubscribe();

      const retryTimeout = setTimeout(() => {
        this.subscribe(operation, handler);
        clearTimeout(retryTimeout);
      }, 1000);
    };
  }

  unsubscribe() {
    if (this.source) {
      this.source.close();
    }
  }
}

const SSELink = new ApolloLink((operation: Operation, forward) => {
  const operationAST = getOperationAST(operation.query, operation.operationName);

  if (!operationAST || operationAST.operation !== 'subscription') {
    return forward(operation);
  }

  return new Observable(observer => {
    const subscription = new SubscriptionSSE();

    subscription.subscribe(Object.assign(operation, { query: print(operation.query) }), data =>
      observer.next({ data })
    );

    return () => subscription.unsubscribe();
  });
});

const errorLogger = errors => {
  errors.forEach(error => {
    const { message, locations, path } = error;
    if (!isDevEnvironment) {
      if (!(path && path.includes('login'))) Sentry.captureException(error);
    } else {
      // this is toast message only shows on develop environment
      toast.error(error.message);
      logger.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    }
  });
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    errorLogger(graphQLErrors);
  }

  if (networkError) {
    logger.error(`[Network error]: ${networkError}`);

    if (networkError.statusCode === 401) {
      navigate('/login');
    }
  }
});

const httpLink = createHttpLink({
  uri: `${process.env.ZENPORT_SERVER_URL || ''}/graphql`,
  credentials: 'include',
});

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

const client: Object = new ApolloClient({
  link: ApolloLink.from([errorLink, SSELink, httpLink]),
  cache,
  defaultOptions,
});

export default client;
