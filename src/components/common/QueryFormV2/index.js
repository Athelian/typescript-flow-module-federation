// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import type { DocumentNode } from 'graphql';
import { usePermissions } from 'contexts/Permissions';
import useUser from 'hooks/useUser';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { parseRoute } from 'utils/entity';
import { cleanTagsData } from 'utils/tags';
import { notificationSeeByEntitiesMutation } from './mutation';
import QueryFormPermissionContext from '../QueryForm/context';

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

// $FlowFixMe Flow typed is not updated yet
export default function QueryFormV2({ query, entityId, entityType, render, onCompleted }: Props) {
  // $FlowFixMe Flow typed is not updated yet
  const { data, loading, error } = useQuery(query, {
    variables: { id: decodeId(entityId) },
    fetchPolicy: 'network-only',
    onCompleted,
    onError: logger.error,
  });

  const [notificationSeeByEntities] = useMutation(notificationSeeByEntitiesMutation);

  const organizationId = data?.[entityType]?.ownedBy?.id;
  const permissions = usePermissions(organizationId);
  const { isOwnerBy } = useUser();
  const isOwner = isOwnerBy(organizationId);

  React.useEffect(() => {
    const notificationUnseenCount = data?.[entityType]?.notificationUnseenCount ?? 0;
    if (notificationUnseenCount === 0) {
      notificationSeeByEntities({
        variables: {
          entities: [
            {
              [`${entityType}Id`]: decodeId(entityId),
            },
          ],
        },
      });
    }
  }, [data, entityId, entityType, notificationSeeByEntities]);

  if (error) {
    if (error.message && error.message.includes('403')) {
      navigate('/403');
    }

    return error.message;
  }

  switch (data?.[entityType]?.__typename) {
    case 'NotFound':
    case 'Forbidden':
      navigate('/404');
      return null;
    default:
      if (!loading && !data?.[entityType]) {
        navigate(`/${parseRoute(entityType)}`);
        return null;
      }

      return (
        <QueryFormPermissionContext.Provider
          value={{
            isOwner,
            permissions: permissions.permissions,
          }}
        >
          {render(cleanTagsData(data?.[entityType] ?? {}), permissions.loading || loading)}
        </QueryFormPermissionContext.Provider>
      );
  }
}

QueryFormV2.defaultProps = defaultProps;
