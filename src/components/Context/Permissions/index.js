// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { intersection } from 'lodash';
import { getByPathWithDefault } from 'utils/fp';
import { useAuthenticated } from 'components/Context/Viewer';
import { permissionsForOrganization } from './query';

type Permissions = {
  loading: boolean,
  permissions: Array<string>,
};

type Context = {
  getPermissionsByOrganization: (organizationId: ?string) => Permissions,
  hasPermissionsByOrganization: (
    organizationId: ?string
  ) => (permissionKey: string | Array<string>) => boolean,
};

export const PermissionsContext = React.createContext<Context>({
  getPermissionsByOrganization: () => ({ loading: false, permissions: [] }),
  hasPermissionsByOrganization: () => () => false,
});

const usePermissionContext = (): Context => React.useContext(PermissionsContext);

export const usePermissions = (organizationId: ?string): Permissions => {
  const { getPermissionsByOrganization } = usePermissionContext();

  return getPermissionsByOrganization(organizationId);
};

export const useHasPermissions = (
  organizationId: ?string
): ((permissionKey: string | Array<string>) => boolean) => {
  const { hasPermissionsByOrganization } = usePermissionContext();

  return React.useCallback(hasPermissionsByOrganization(organizationId), [
    organizationId,
    hasPermissionsByOrganization,
  ]);
};

type Props = {
  children: React.Node,
};

type State = {
  [string]: Permissions,
};

const PermissionsProvider = ({ children }: Props) => {
  const client = useApolloClient();
  const { authenticated } = useAuthenticated();
  const [permissions, setPermissions] = React.useState<State>({});

  React.useEffect(() => {
    if (!authenticated) {
      setPermissions({});
    }
  }, [authenticated]);

  const getPermissionsByOrganization = React.useCallback(
    (organizationId: ?string): Permissions => {
      if (!organizationId) {
        return {
          loading: false,
          permissions: [],
        };
      }

      if (!Object.prototype.hasOwnProperty.call(permissions, organizationId)) {
        setPermissions({
          ...permissions,
          [organizationId]: {
            loading: true,
            permissions: [],
          },
        });

        client
          .query({
            query: permissionsForOrganization,
            variables: {
              organizationId,
            },
            fetchPolicy: 'network-only',
          })
          .then(({ data }) => {
            setPermissions({
              ...permissions,
              [organizationId]: {
                loading: false,
                permissions: getByPathWithDefault([], 'viewer.permissionsForOrganization', data),
              },
            });
          });

        return {
          loading: true,
          permissions: [],
        };
      }

      return permissions[organizationId];
    },
    [client, permissions, setPermissions]
  );

  const hasPermissionsByOrganization = React.useCallback(
    (organizationId: ?string) => {
      const permissionsByOrganization = getPermissionsByOrganization(organizationId);

      return (permissionKey: string | Array<string>) => {
        if (permissionsByOrganization.loading) {
          return false;
        }

        if (Array.isArray(permissionKey)) {
          return intersection(permissionsByOrganization.permissions, permissionKey).length > 0;
        }

        return permissionsByOrganization.permissions.includes(permissionKey);
      };
    },
    [getPermissionsByOrganization]
  );

  return (
    <PermissionsContext.Provider
      value={{ getPermissionsByOrganization, hasPermissionsByOrganization }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

type DevProps = {
  permissions?: Array<string>,
} & Props;

export const PermissionsProviderDev = ({ permissions, children }: DevProps) => {
  const getPermissionsByOrganization = (): Permissions => {
    return {
      loading: false,
      permissions: permissions || [],
    };
  };

  const hasPermissionsByOrganization = () => (permissionKey: string | Array<string>) => {
    if (Array.isArray(permissionKey)) {
      return intersection(getPermissionsByOrganization().permissions, permissionKey).length > 0;
    }

    return getPermissionsByOrganization().permissions.includes(permissionKey);
  };

  return (
    <PermissionsContext.Provider
      value={{ getPermissionsByOrganization, hasPermissionsByOrganization }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider;
