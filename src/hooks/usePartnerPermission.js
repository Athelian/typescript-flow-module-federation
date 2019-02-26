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
  const { isOwner } = useContext(QueryFormPermissionContext);

  return {
    isOwner,
  };
};

export default usePartnerPermission;
