// @flow
import * as React from 'react';

type ContextProps = {
  permissions: Array<string>,
  isOwner: boolean,
};

/**
 * @deprecated This context is not necessary for the form, Use instead the hook useHasPermissions directly
 */
const QueryFormPermissionContext: React.Context<ContextProps> = React.createContext({
  permissions: [],
  isOwner: true,
});

export default QueryFormPermissionContext;
