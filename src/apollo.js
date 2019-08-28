// @flow
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { navigate } from '@reach/router';
import { getOperationAST } from 'graphql/utilities/getOperationAST';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink, NextLink, Observable, type Operation } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';
import apolloLogger from 'apollo-link-logger';
import { isDevEnvironment } from './utils/env';
import emitter from './utils/emitter';
import introspectionQueryResultData from './generated/fragmentTypes.json';
import logger from './utils/logger';
import { SubscriptionSSE } from './SubscriptionSSE';

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

const snipperLink = new ApolloLink((operation: Operation, forward?: NextLink) => {
  const isMutate = operation.operationName.includes('Update');
  if (isMutate) {
    emitter.emit('MUTATION', 'start');
  }
  return (forward?.(operation) ?? []).map(result => {
    if (isMutate) {
      emitter.emit('MUTATION', 'stop');
    }
    return result;
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

const links = [snipperLink, errorLink, SSELink, httpWithUploadLink];

if (isDevEnvironment) links.push(apolloLogger);

const client: Object = new ApolloClient({
  assumeImmutableResults: true,
  link: ApolloLink.from(links),
  cache,
  defaultOptions,
});

export default client;
