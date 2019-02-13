// @flow
import * as React from 'react';
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
  children: React.Node,
};

const PermissionProvider = ({ children }: ContextProviderProps) => (
  <PermissionContext.Provider value={{ permissions: defaultPermissions }}>
    {children}
  </PermissionContext.Provider>
);

export default PermissionProvider;
