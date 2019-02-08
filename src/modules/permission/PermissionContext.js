// @flow
import * as React from 'react';

type ContextProps = {
  permissions: Array<string>,
};

const PermissionContext: React.Context<ContextProps> = React.createContext({
  permissions: [],
});

export default PermissionContext;
