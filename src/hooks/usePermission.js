// @flow
import { useContext, useCallback } from 'react';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import PermissionContext from 'modules/permission/PermissionContext';

/**
 *  Grab the owner permission or partner permission
 *
 * @param {boolean} isOwner
 *
 */
const usePermission = (isOwner: boolean = true) => {
  const hasPermission = useCallback((checkPermission: string, permissions: Array<string>) => {
    return permissions.includes(checkPermission);
  });
  const { permissions } = useContext(PermissionContext);
  const { permissions: partnerPermissions } = useContext(QueryFormPermissionContext);

  return {
    hasPermission: (checkPermission: string) =>
      hasPermission(checkPermission, isOwner ? permissions : partnerPermissions),
  };
};

export default usePermission;
