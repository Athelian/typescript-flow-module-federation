// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { navigate } from '@reach/router';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import { partnerPermissionQuery } from 'components/common/QueryForm/query';
import LoadingIcon from 'components/LoadingIcon';
import useUser from 'hooks/useUser';

const PartnerPermissionsWrapper = ({ data, children }: { data: Object, children: Function }) => {
  const { isOwnerBy } = useUser();
  const partnerId = getByPath('ownedBy.partner.id', data);
  const isOwner = isOwnerBy(partnerId);

  if (isOwner) {
    return (
      <QueryFormPermissionContext.Provider
        value={{
          isOwner: true,
          permissions: [],
        }}
      >
        {children(data)}
      </QueryFormPermissionContext.Provider>
    );
  }

  return (
    <Query
      query={partnerPermissionQuery}
      variables={{ partnerId: getByPath('ownedBy.partner.id', data) }}
      fetchPolicy="cache-first"
    >
      {({ loading: isLoading, data: permissionsData, error: permissionError }) => {
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
                'viewer.permissionsFromPartner',
                permissionsData
              ),
            }}
          >
            {children(data)}
          </QueryFormPermissionContext.Provider>
        );
      }}
    </Query>
  );
};

export default PartnerPermissionsWrapper;
