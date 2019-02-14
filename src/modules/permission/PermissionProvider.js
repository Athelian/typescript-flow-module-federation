// @flow
import * as React from 'react';
import { ROLE_MANAGER } from 'modules/user/constants';
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

const order = {
  default: ['order.orders.list', 'order.orders.get'],
  manager: ['order.orders.list', 'order.orders.get', 'order.orders.create', 'order.orders.update'],
};

// just for hard code develop, I will remove these after api is ready.
const defaultPermissions = [...product.default, ...order.default];

const managerPermissions = [...product.manager, ...order.manager];

type ContextProviderProps = {
  user: Object,
  children: React.Node,
};

const PermissionProvider = ({ user, children }: ContextProviderProps) => {
  const permissions =
    !isEnableBetaFeature || user.role === ROLE_MANAGER ? managerPermissions : defaultPermissions;
  return (
    <PermissionContext.Provider value={{ permissions }}>{children}</PermissionContext.Provider>
  );
};

export default PermissionProvider;
