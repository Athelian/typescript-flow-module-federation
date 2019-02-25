// @flow
import { useContext, useCallback } from 'react';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import PermissionContext from 'modules/permission/PermissionContext';

/**
 *  Grab the owner permission or partner permission
 *
 * @param {boolean} isPartnerPermission
 *
 */
const usePermission = (isPartnerPermission: boolean = false) => {
  const hasPermission = useCallback((checkPermission: string, permissions: Array<string>) => {
    return permissions.includes(checkPermission);
  });
  const { permissions } = useContext(PermissionContext);
  const { permissions: partnerPermissions } = useContext(QueryFormPermissionContext);

  return {
    hasPermission: (checkPermission: string) =>
      hasPermission(checkPermission, isPartnerPermission ? partnerPermissions : permissions),
  };
};

export default usePermission;
