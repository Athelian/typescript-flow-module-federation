// @flow
import * as React from 'react';
import { isEnableBetaFeature } from 'utils/env';
import PermissionContext from './PermissionContext';

const product = {
  default: [
    'product.products.list',
    'product.products.get',
    'product.productProviders.get',
    'product.productProviders.setDocuments',
  ],
  manager: [
    'product.products.list',
    'product.products.get',
    'product.products.create',
    'product.products.update',
    'product.productProviders.get',
    'product.productProviders.create',
    'product.productProviders.update',
  ],
};

// just for hardcode develop, I will remove these after api is ready.
const defaultPermissions = [...product.default];

const managerPermissions = [...product.manager];

console.warn(defaultPermissions);
console.warn(managerPermissions);

type ContextProviderProps = {
  user: Object,
  children: React.Node,
};

const PermissionProvider = ({ user, children }: ContextProviderProps) => {
  const permissions =
    !isEnableBetaFeature || user.role === 'manager' ? managerPermissions : defaultPermissions;
  return (
    <PermissionContext.Provider value={{ permissions }}>{children}</PermissionContext.Provider>
  );
};

export default PermissionProvider;
