// @flow
import * as React from 'react';
import PermissionContext from './PermissionContext';

type ContextProviderProps = {
  permissions: Array<string>,
  children: React.Node,
};

const PermissionProvider = ({ permissions, children }: ContextProviderProps) => (
  <PermissionContext.Provider value={{ permissions }}>{children}</PermissionContext.Provider>
);

export default PermissionProvider;
