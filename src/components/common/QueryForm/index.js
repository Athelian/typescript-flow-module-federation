// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql';
import LoadingIcon from 'components/LoadingIcon';
import { decodeId } from 'utils/id';
import { getByPathWithDefault, getByPath } from 'utils/fp';

type Props = {
  query: DocumentNode,
  entityId: string,
  entityType: string,
  render: Object => React.Node,
};

export default function QueryForm({ query, entityId, entityType, render }: Props) {
  return (
    <Query query={query} variables={{ id: decodeId(entityId) }} fetchPolicy="network-only">
      {({ loading, data, error }) => {
        if (error) {
          if (error.message && error.message.includes('403')) {
            navigate('/403');
          }

          return error.message;
        }

        if (loading) return <LoadingIcon />;

        if (getByPath(`${entityType}.__typename`, data) === 'NotFound') {
          navigate('/404');
        }

        if (getByPath(entityType, data)) return render(getByPathWithDefault({}, entityType, data));

        navigate(`/${entityType}`);
        return <LoadingIcon />;
      }}
    </Query>
  );
}
