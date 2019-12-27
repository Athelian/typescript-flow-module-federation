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

const snipperLink = new ApolloLink((operation: Operation, forward: NextLink) => {
  const isMutate = (operation.operationName || '').includes('Update');
  if (isMutate) {
    emitter.emit('MUTATION');
  }
  return forward(operation).map(result => {
    if (isMutate) {
      emitter.emit('MUTATION', result);
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

const parseHeaders = (rawHeaders: string): Headers => {
  const headers = new Headers();
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(':');
    const key = parts.shift().trim();
    if (key) {
      const value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
};

const customFetch = (url: string, options: any) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (options.signal && options.signal.aborted) {
      const err = new Error('Aborted');
      err.name = 'AbortError';
      reject(err);
      return;
    }

    xhr.onload = () =>
      resolve(
        new Response('response' in xhr ? xhr.response : xhr.responseText, {
          url: 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL'),
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
        })
      );
    xhr.onerror = () => {
      reject(new TypeError('Network request failed'));
    };
    xhr.ontimeout = () => {
      reject(new TypeError('Network request failed'));
    };
    xhr.onabort = () => {
      const err = new Error('Aborted');
      err.name = 'AbortError';
      reject(err);
    };
    xhr.open(options.method || 'get', url, true);
    Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, options.headers[key]);
    });
    if (options.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (options.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if (xhr.upload && options.onProgress) {
      xhr.upload.onprogress = options.onProgress;
    }

    if (options.signal) {
      const abortXhr = () => xhr.abort();
      options.signal.addEventListener('abort', abortXhr);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          options.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(options.body);
  });
};

const httpWithUploadLink = createUploadLink({
  uri: `${process.env.ZENPORT_SERVER_URL || ''}/graphql`,
  credentials: 'include',
  fetch: customFetch,
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
      ? [apolloLogger, snipperLink, errorLink, SSELink, httpWithUploadLink]
      : [snipperLink, errorLink, SSELink, httpWithUploadLink]
  ),
  cache,
  defaultOptions,
});

export default client;
