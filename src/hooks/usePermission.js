// @flow
import { useContext, useCallback } from 'react';
import { intersection } from 'lodash';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import PermissionContext from 'modules/permission/PermissionContext';

/**
 *  Grab the owner permission or partner permission
 *
 * @param {boolean} isOwner
 *
 */
const usePermission = (isOwner: boolean = true) => {
  const hasPermission = useCallback(
    (checkPermission: string | Array<string>, permissions: Array<string>) => {
      if (Array.isArray(checkPermission)) {
        return intersection(permissions, checkPermission).length > 0;
      }
      return permissions.includes(checkPermission);
    },
    []
  );
  const { permissions } = useContext(PermissionContext);
  const { permissions: partnerPermissions } = useContext(QueryFormPermissionContext);

  return {
    hasPermission: (checkPermission: string | Array<string>) =>
      hasPermission(checkPermission, isOwner ? permissions : partnerPermissions),
  };
};

export default usePermission;
