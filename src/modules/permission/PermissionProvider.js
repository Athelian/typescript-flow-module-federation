// @flow
import * as React from 'react';
import { ROLE_MANAGER } from 'modules/user/constants';
import { isEnableBetaFeature } from 'utils/env';
import PermissionContext from './PermissionContext';
import { managerPermissions, defaultPermissions } from './constants';

type ContextProviderProps = {
  user: Object,
  children: React.Node,
};

const PermissionProvider = ({ user, children }: ContextProviderProps) => {
  const permissions =
    !isEnableBetaFeature || user.role === ROLE_MANAGER ? managerPermissions : defaultPermissions;
  return (
    <PermissionContext.Provider value={{ permissions }}>{children}</PermissionContext.Provider>
  );
};

export default PermissionProvider;
