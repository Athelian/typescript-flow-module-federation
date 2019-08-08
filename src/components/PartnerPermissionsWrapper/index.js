// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { navigate } from '@reach/router';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { partnerPermissionQuery } from 'components/common/QueryForm/query';
import LoadingIcon from 'components/LoadingIcon';
import PermissionContext from 'modules/permission/PermissionContext';
import useUser from 'hooks/useUser';

type Props = {
  data: Object,
  children: (permissions: Array<string>, isOwner: boolean) => React$Node,
};

const PartnerPermissionsWrapper = ({ data, children }: Props) => {
  const { isOwnerBy } = useUser();
  const { permissions } = React.useContext(PermissionContext);

  if (!data) {
    return children([], false);
  }

  const organizationId = getByPath('ownedBy.id', data);
  const isOwner = isOwnerBy(organizationId);

  if (isOwner) {
    return children(permissions, isOwner);
  }

  return (
    <Query
      query={partnerPermissionQuery}
      variables={{ organizationId: getByPath('ownedBy.id', data) }}
      fetchPolicy="cache-first"
    >
      {({ loading, data: permissionsData, error: permissionError }) => {
        if (loading) return <LoadingIcon />;

        if (permissionError) {
          if (permissionError.message && permissionError.message.includes('403')) {
            navigate('/403');
          }

          return permissionError.message;
        }
        return children(
          getByPathWithDefault([], 'viewer.permissionsForOrganization', permissionsData),
          isOwner
        );
      }}
    </Query>
  );
};

export default PartnerPermissionsWrapper;
