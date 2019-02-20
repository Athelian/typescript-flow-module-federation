export const PRODUCT_LIST = 'product.products.list';
export const PRODUCT_EXPORT_LIST = 'product.products.exportList';
export const PRODUCT_GET = 'product.products.get';
export const PRODUCT_CREATE = 'product.products.create';
export const PRODUCT_UPDATE = 'product.products.update';
export const PRODUCT_PROVIDER_GET = 'product.productProviders.get';
export const PRODUCT_PROVIDER_CREATE = 'product.productProviders.create';
export const PRODUCT_PROVIDER_UPDATE = 'product.productProviders.update';
export const PRODUCT_PROVIDER_SET_DOCUMENTS = 'product.productProviders.setDocuments';
export const PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS = 'product.productProviders.downloadDocuments';

const product = {
  default: [
    PRODUCT_LIST,
    PRODUCT_EXPORT_LIST,
    PRODUCT_GET,
    PRODUCT_PROVIDER_GET,
    PRODUCT_PROVIDER_SET_DOCUMENTS,
    PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
  ],
  weinhaus: [PRODUCT_LIST, PRODUCT_GET, PRODUCT_PROVIDER_GET],
  manager: [
    PRODUCT_LIST,
    PRODUCT_EXPORT_LIST,
    PRODUCT_GET,
    PRODUCT_CREATE,
    PRODUCT_UPDATE,
    PRODUCT_PROVIDER_GET,
    PRODUCT_PROVIDER_CREATE,
    PRODUCT_PROVIDER_UPDATE,
    PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
  ],
};

export default product;
