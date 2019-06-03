// @flow
import * as React from 'react';
import { DocumentNode } from 'graphql';
import { Query } from 'react-apollo';
import { navigate } from '@reach/router';
import useOnScreen from 'hooks/useOnScreen';
import logger from 'utils/logger';

type OptionalProps = {
  entityId: string,
  fetchPolicy: 'cache-first' | 'network-only' | 'cache-only' | 'no-cache' | 'standby',
  onCompleted: Function,
  query: DocumentNode,
};

type Props = OptionalProps & {
  isLoading: boolean,
  PlaceHolder: React.ComponentType<any>,
  children: ({ data: ?Object }) => React.Node,
};

const defaultProps = {
  entityId: '',
  onCompleted: logger.warn,
  fetchPolicy: 'network-only',
  query: {},
};

export default function QueryPlaceHolder({
  isLoading,
  PlaceHolder,
  entityId,
  query,
  onCompleted,
  fetchPolicy,
  children,
}: Props) {
  const ref = React.createRef();
  const isReady = useOnScreen(ref, { rootMargin: '0px', threshold: 0.2 });

  return (
    <div ref={ref}>
      {(() => {
        if (entityId) {
          if (!isReady || isLoading) return <PlaceHolder />;

          return (
            <Query
              query={query}
              variables={{
                id: entityId,
              }}
              fetchPolicy={fetchPolicy}
              onCompleted={onCompleted}
            >
              {({ loading, data, error }) => {
                if (error) {
                  if (error.message && error.message.includes('403')) {
                    navigate('/403');
                  }

                  return error.message;
                }

                if (loading) return <PlaceHolder />;

                return children({ data });
              }}
            </Query>
          );
        }

        if (!isReady || isLoading) return <PlaceHolder />;

        return children({ data: null });
      })()}
    </div>
  );
}

QueryPlaceHolder.defaultProps = defaultProps;
