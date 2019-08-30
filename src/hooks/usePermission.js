// @flow
import { useContext, useCallback } from 'react';
import { intersection } from 'lodash';
import { useHasPermissions } from 'components/Context/Permissions';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import useUser from './useUser';

/**
 *  Grab the owner permission or partner permission
 *
 * @param {boolean} isOwner
 *
 * @deprecated This hook use a deprecated form permission context, Use instead the hook useHasPermissions directly
 */
const usePermission = (isOwner: boolean = true) => {
  const { permissions: partnerPermissions } = useContext(QueryFormPermissionContext);
  const { organization } = useUser();
  const hasPermissionOwner = useHasPermissions(organization?.id);

  const hasPermissionPartner = useCallback(
    (checkPermission: string | Array<string>) => {
      if (Array.isArray(checkPermission)) {
        return intersection(partnerPermissions, checkPermission).length > 0;
      }
      return partnerPermissions.includes(checkPermission);
    },
    [partnerPermissions]
  );

  return {
    hasPermission: isOwner ? hasPermissionOwner : hasPermissionPartner,
  };
};

export default usePermission;
