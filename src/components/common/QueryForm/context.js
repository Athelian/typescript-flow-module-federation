// @flow
import * as React from 'react';

type ContextProps = {
  permissions: Array<string>,
  ownerGroupId: string,
};

const QueryFormPermissionContext: React.Context<ContextProps> = React.createContext({
  permissions: [],
  ownerGroupId: '',
});

export default QueryFormPermissionContext;
