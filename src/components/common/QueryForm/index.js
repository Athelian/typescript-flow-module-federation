// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import type { DocumentNode } from 'graphql';
import useUser from 'hooks/useUser';
import LoadingIcon from 'components/LoadingIcon';
import { usePermissions } from 'contexts/Permissions';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { parseRoute } from 'utils/entity';
import { cleanTagsData } from 'utils/tags';
import QueryFormPermissionContext from './context';
import { notificationSeeByEntitiesMutation } from '../QueryFormV2/mutation';

type OptionalProps = {
  onCompleted: ?Function,
};

type Props = OptionalProps & {
  query: DocumentNode,
  entityId: string,
  entityType: string,
  render: (result: Object, isOwner: boolean) => React.Node,
};

export default function QueryForm({ query, entityId, entityType, render, onCompleted }: Props) {
  // $FlowFixMe Flow typed is not updated yet
  const { data, loading, error } = useQuery(query, {
    variables: { id: decodeId(entityId) },
    fetchPolicy: 'network-only',
    onCompleted: onCompleted || logger.warn,
    onError: logger.error,
  });

  const [notificationSeeByEntities] = useMutation(notificationSeeByEntitiesMutation);

  const organizationId = data?.[entityType]?.ownedBy?.id;
  const permissions = usePermissions(organizationId);
  const { isOwnerBy } = useUser();
  const isOwner = isOwnerBy(organizationId);

  React.useEffect(() => {
    const notificationUnseenCount = data?.[entityType]?.notificationUnseenCount ?? 0;
    if (notificationUnseenCount > 0) {
      notificationSeeByEntities({
        variables: [
          {
            [`${entityType}Id`]: decodeId(entityId),
          },
        ],
      });
    }
  }, [data, entityId, entityType, notificationSeeByEntities]);

  if (error) {
    if (error.message && error.message.includes('403')) {
      navigate('/403');
    }

    return error.message;
  }

  if (loading || permissions.loading) {
    return <LoadingIcon />;
  }

  switch (data?.[entityType]?.__typename) {
    case 'NotFound':
    case 'Forbidden':
      navigate('/404');
      return null;
    default:
      if (!data?.[entityType]) {
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
          {render(cleanTagsData(data?.[entityType] ?? {}), isOwner)}
        </QueryFormPermissionContext.Provider>
      );
  }
}
