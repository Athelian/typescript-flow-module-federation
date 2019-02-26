// @flow
import * as React from 'react';

type ContextProps = {
  permissions: Array<string>,
  isOwner: boolean,
};

const QueryFormPermissionContext: React.Context<ContextProps> = React.createContext({
  permissions: [],
  isOwner: true,
});

export default QueryFormPermissionContext;
