// @flow
import { useContext, useCallback } from 'react';
import { intersection } from 'lodash';
import { useViewerHasPermissions } from 'contexts/Permissions';
import QueryFormPermissionContext from 'components/common/QueryForm/context';

/**
 *  Grab the owner permission or partner permission
 *
 * @param {boolean} isOwner
 *
 * @deprecated This hook use a deprecated form permission context, Use instead the hook useHasPermissions directly
 */
const usePermission = (isOwner: boolean = true) => {
  const { permissions: partnerPermissions } = useContext(QueryFormPermissionContext);
  const hasPermissionViewer = useViewerHasPermissions();

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
    hasPermission: isOwner ? hasPermissionViewer : hasPermissionPartner,
  };
};

export default usePermission;
