// @flow
import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { navigate } from '@reach/router';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { partnerPermissionQuery } from 'components/common/QueryForm/query';
import PermissionContext from 'modules/permission/PermissionContext';
import LoadingIcon from 'components/LoadingIcon';
import useUser from 'hooks/useUser';

const PartnerPermissionsWrapper = ({ data, children }: { data: Object, children: Function }) => {
  const { isOwnerBy } = useUser();
  const partnerId = getByPath('ownedBy.partner.id', data);
  const isOwner = isOwnerBy(partnerId);
  const { permissions } = useContext(PermissionContext);

  if (isOwner) {
    return children(permissions);
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
        return children(getByPathWithDefault([], 'viewer.permissionsFromPartner', permissionsData));
      }}
    </Query>
  );
};

export default PartnerPermissionsWrapper;
