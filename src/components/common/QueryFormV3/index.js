// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { useQuery } from 'react-apollo';
import type { DocumentNode } from 'graphql';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { getByPathWithDefault } from 'utils/fp';
import { usePermissions } from 'components/Permissions';

type OptionalProps = {
  onCompleted: ?Function,
};

type Props = OptionalProps & {
  query: DocumentNode,
  entityId: string,
  entityType: string,
  render: (result: Object, loading: boolean) => React.Node,
};

const defaultProps = {
  onCompleted: logger.warn,
};

const QueryQueryV3 = ({ query, entityId, entityType, render, onCompleted }: Props) => {
  const { data, loading, error } = useQuery(query, {
    variables: { id: decodeId(entityId) },
    fetchPolicy: 'network-only',
    onCompleted,
    onError: logger.error,
  });

  const organizationId = getByPathWithDefault(null, `${entityType}.ownedBy.id`, data);
  const permissions = usePermissions(organizationId);

  if (error) {
    if (error.message && error.message.includes('403')) {
      navigate('/403');
    }

    return error.message;
  }

  if (loading) {
    return render({}, true);
  }

  switch (data?.[entityType]?.__typename) {
    case 'NotFound':
    case 'Forbidden':
      navigate('/404');
      return null;
    default:
      return render(data?.[entityType] ?? {}, permissions.loading);
  }
};

QueryQueryV3.defaultProps = defaultProps;

export default QueryQueryV3;
