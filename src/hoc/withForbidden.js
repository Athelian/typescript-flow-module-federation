// @flow
import * as React from 'react';
import usePermission from 'hooks/usePermission';
import PageNotFound from 'components/PageNotFound';

export default function withForbidden(
  WrappedComponent: React.ComponentType<any>,
  permission: string | Array<string>
) {
  return function ForbiddenWrappedComponent(props: any) {
    const { hasPermission } = usePermission();
    if (hasPermission(permission)) return <WrappedComponent {...props} />;
    return <PageNotFound />;
  };
}
