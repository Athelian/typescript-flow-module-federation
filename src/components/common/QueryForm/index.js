// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql';
import useUser from 'hooks/useUser';
import LoadingIcon from 'components/LoadingIcon';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { getByPathWithDefault, getByPath } from 'utils/fp';
import { parseRoute } from 'utils/route';
import QueryFormPermissionContext from './context';
import { partnerPermissionQuery } from './query';

type OptionalProps = {
  onCompleted: ?Function,
};

type Props = OptionalProps & {
  query: DocumentNode,
  entityId: string,
  entityType: string,
  render: (Object, boolean) => React.Node,
};

export default function QueryForm({ query, entityId, entityType, render, onCompleted }: Props) {
  const { isOwnerBy } = useUser();
  return (
    <Query
      query={query}
      variables={{ id: decodeId(entityId) }}
      fetchPolicy="network-only"
      onCompleted={onCompleted || logger.warn}
      onError={logger.error}
    >
      {({ loading, data, error }) => {
        if (error) {
          if (error.message && error.message.includes('403')) {
            navigate('/403');
          }

          return error.message;
        }

        if (loading) return <LoadingIcon />;

        const errorType = getByPath(`${entityType}.__typename`, data);
        if (['NotFound', 'Forbidden'].includes(errorType)) {
          navigate('/404');
          return null;
        }

        const partnerId = getByPath(`${entityType}.ownedBy.id`, data);
        const isOwner = isOwnerBy(partnerId);
        if (!isOwner) {
          // query permission for partner
          return (
            <Query
              query={partnerPermissionQuery}
              variables={{ partnerId }}
              fetchPolicy="cache-first"
            >
              {({ loading: isLoading, data: permissionData, error: permissionError }) => {
                if (isLoading) return <LoadingIcon />;
                if (permissionError) {
                  if (permissionError.message && permissionError.message.includes('403')) {
                    navigate('/403');
                  }

                  return permissionError.message;
                }
                return (
                  <QueryFormPermissionContext.Provider
                    value={{
                      isOwner: false,
                      permissions: getByPathWithDefault(
                        [],
                        'viewer.permissionsForOrganization',
                        permissionData
                      ),
                    }}
                  >
                    {render(getByPathWithDefault({}, entityType, data), isOwner)}
                  </QueryFormPermissionContext.Provider>
                );
              }}
            </Query>
          );
        }
        if (getByPath(entityType, data)) {
          return (
            <QueryFormPermissionContext.Provider
              value={{
                isOwner: true,
                permissions: [],
              }}
            >
              {render(getByPathWithDefault({}, entityType, data), isOwner)}
            </QueryFormPermissionContext.Provider>
          );
        }
        navigate(`/${parseRoute(entityType)}`);
        return <LoadingIcon />;
      }}
    </Query>
  );
}
