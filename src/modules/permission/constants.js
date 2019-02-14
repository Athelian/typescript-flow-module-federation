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

const relationMap = ['relationMap.update'];

// just for hard code develop, I will remove these after api is ready.
export const defaultPermissions = [...product.default];
export const managerPermissions = [...product.manager, ...relationMap];
