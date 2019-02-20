// @flow
import { useContext, useCallback } from 'react';
import PermissionContext from 'modules/permission/PermissionContext';

const usePermission = () => {
  const hasPermission = useCallback((checkPermission: string, permissions: Array<string>) => {
    return permissions.includes(checkPermission);
  });
  const { permissions } = useContext(PermissionContext);

  return {
    hasPermission: (checkPermission: string) => hasPermission(checkPermission, permissions),
  };
};

export default usePermission;
