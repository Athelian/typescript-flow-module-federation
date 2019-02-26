// @flow
import { useContext } from 'react';
import QueryFormPermissionContext from 'components/common/QueryForm/context';

/**
 *  Grab the owner permission or partner permission
 *
 * @param {boolean} isOwner
 *
 */
const usePartnerPermission = () => {
  const { ownerGroupId } = useContext(QueryFormPermissionContext);

  return {
    isOwner: () => ownerGroupId === '',
  };
};

export default usePartnerPermission;
