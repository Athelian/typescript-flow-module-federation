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
  const partnerId = getByPath('ownedBy.partner.id', data);
  const isOwner = isOwnerBy(partnerId);
  const { permissions } = React.useContext(PermissionContext);

  if (isOwner) {
    return children(permissions, isOwner);
  }

  return (
    <Query
      query={partnerPermissionQuery}
      variables={{ partnerId: getByPath('ownedBy.partner.id', data) }}
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
          getByPathWithDefault([], 'viewer.permissionsFromPartner', permissionsData),
          isOwner
        );
      }}
    </Query>
  );
};

export default PartnerPermissionsWrapper;
