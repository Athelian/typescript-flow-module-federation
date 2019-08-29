// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { getByPathWithDefault } from 'utils/fp';
import { partnerPermissionQuery } from 'components/common/QueryForm/query';

type Context = (organizationId: ?string) => (permissionKey: string) => boolean;

const PermissionsContext = React.createContext<Context>(() => () => false);

const usePermissionContext = (): Context => React.useContext(PermissionsContext);

export const useOrganizationPermissions = (
  organizationId: ?string
): ((permissionKey: string) => boolean) => {
  const permissionContext = usePermissionContext();

  return React.useCallback(permissionContext(organizationId), [permissionContext]);
};

type Props = {
  children: React.Node,
};

export const Permissions = ({ children }: Props) => {
  const [permissions, setPermissions] = React.useState<{ [string]: Array<string> }>({});
  const client = useApolloClient();

  const hasPermissionsByOrganization = React.useCallback(
    (organizationId: ?string) => {
      if (!organizationId) {
        return () => false;
      }

      if (!Object.prototype.hasOwnProperty.call(permissions, organizationId)) {
        setPermissions({
          ...permissions,
          [organizationId]: [],
        });

        client
          .query({
            query: partnerPermissionQuery,
            variables: {
              organizationId,
            },
            fetchPolicy: 'cache-first',
          })
          .then(({ data }) => {
            setPermissions({
              ...permissions,
              [organizationId]: getByPathWithDefault([], 'viewer.permissionsForOrganization', data),
            });
          });

        return () => false;
      }

      return (permissionKey: string) => permissions[organizationId].includes(permissionKey);
    },
    [client, permissions]
  );

  return (
    <PermissionsContext.Provider value={hasPermissionsByOrganization}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default Permissions;
