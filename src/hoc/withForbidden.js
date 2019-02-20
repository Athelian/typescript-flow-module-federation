// @flow
import * as React from 'react';
import usePermission from 'hooks/usePermission';
import NoPermission from 'components/NoPermission';

export default function withForbidden(
  WrappedComponent: React.ComponentType<any>,
  permission: string
) {
  return function ForbiddenWrappedComponent(props: any) {
    const { hasPermission } = usePermission();
    if (hasPermission(permission)) return <WrappedComponent {...props} />;
    return <NoPermission />;
  };
}
