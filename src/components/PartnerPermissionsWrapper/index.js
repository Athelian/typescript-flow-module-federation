// @flow
import * as React from 'react';
import { usePermissions } from 'contexts/Permissions';
import LoadingIcon from 'components/LoadingIcon';
import useUser from 'hooks/useUser';

type Props = {
  data: Object,
  children: (permissions: Array<string>, isOwner: boolean) => React$Node,
};

const PartnerPermissionsWrapper = ({ data, children }: Props) => {
  const { isOwnerBy } = useUser();
  const organizationId = data?.ownedBy?.id;
  const permissions = usePermissions(organizationId);

  if (!organizationId) {
    return children([], false);
  }

  if (permissions.loading) {
    return <LoadingIcon />;
  }

  return children(permissions.permissions, isOwnerBy(organizationId));
};

export default PartnerPermissionsWrapper;
