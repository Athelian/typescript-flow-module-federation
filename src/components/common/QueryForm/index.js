// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql';
import useUser from 'hooks/useUser';
import LoadingIcon from 'components/LoadingIcon';
import { decodeId } from 'utils/id';
import { getByPathWithDefault, getByPath } from 'utils/fp';
import QueryFormPermissionContext from './context';
import { partnerPermissionQuery } from './query';

type Props = {
  query: DocumentNode,
  entityId: string,
  entityType: string,
  render: (Object, boolean) => React.Node,
};

export default function QueryForm({ query, entityId, entityType, render }: Props) {
  const { isOwnerBy } = useUser();
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

        const errorType = getByPath(`${entityType}.__typename`, data);
        if (['NotFound', 'Forbidden'].includes(errorType)) {
          navigate('/404');
        }

        const ownerGroupId = getByPath(`${entityType}.ownedBy.id`, data);
        const isOwner = isOwnerBy(ownerGroupId);
        if (!isOwner) {
          // query permission for partner
          return (
            <Query
              query={partnerPermissionQuery}
              variables={{ partnerId: ownerGroupId }}
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
                      ownerGroupId,
                      permissions: getByPathWithDefault(
                        [],
                        'viewer.permissionsFromPartner',
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
                ownerGroupId: '',
                permissions: [],
              }}
            >
              {render(getByPathWithDefault({}, entityType, data), isOwner)}
            </QueryFormPermissionContext.Provider>
          );
        }
        navigate(`/${entityType}`);
        return <LoadingIcon />;
      }}
    </Query>
  );
}
