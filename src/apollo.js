// @flow
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { navigate } from '@reach/router';
import { getOperationAST } from 'graphql/utilities/getOperationAST';
import { print } from 'graphql/language/printer';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink, NextLink, Observable, type Operation } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';
import apolloLogger from 'apollo-link-logger';
import { isDevEnvironment } from './utils/env';
import introspectionQueryResultData from './generated/fragmentTypes.json';
import logger from './utils/logger';

class SubscriptionSSE {
  source: EventSource | null = null;

  subscribe(operation: Operation, handler: (data: any) => void) {
    const { query, variables, operationName } = operation;

    this.source = new EventSource(
      encodeURI(
        `${process.env.ZENPORT_SERVER_URL || ''}/graphql?query=${print(
          query
        )}&operationName=${operationName}&variables=${JSON.stringify(variables)}`
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
      this.source = null;
    }
  }
}

const SSELink = new ApolloLink((operation: Operation, forward?: NextLink) => {
  const operationAST = getOperationAST(operation.query, operation.operationName);

  if (forward && (!operationAST || operationAST.operation !== 'subscription')) {
    return forward(operation);
  }

  return new Observable(observer => {
    const subscription = new SubscriptionSSE();

    subscription.subscribe(operation, data => observer.next({ data }));

    return () => subscription.unsubscribe();
  });
});

const errorLogger = errors => {
  errors.forEach(error => {
    const { message } = error;
    if (!isDevEnvironment) {
      // ignore error from authentication
      if (
        !(
          message.includes('Unauthorized') ||
          message.includes('Network error with auth') ||
          message.includes('401')
        )
      ) {
        Sentry.withScope(scope => {
          scope.setExtra('full-error-message', error);
          Sentry.captureException(new Error(message));
        });
      }
    } else {
      // this is toast message only shows on develop environment
      toast.error(error.message);
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

const httpWithUploadLink = createUploadLink({
  uri: `${process.env.ZENPORT_SERVER_URL || ''}/graphql`,
  credentials: 'include',
});

const cache = new InMemoryCache({
  freezeResults: true,
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
  assumeImmutableResults: true,
  link: ApolloLink.from(
    isDevEnvironment
      ? [apolloLogger, errorLink, SSELink, httpWithUploadLink]
      : [errorLink, SSELink, httpWithUploadLink]
  ),
  cache,
  defaultOptions,
});

export default client;
