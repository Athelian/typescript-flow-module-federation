// @flow

const mappingRoutes = {
  orderItem: 'order-item',
  OrderItem: 'order-item',
};

const mappingIcon = {
  OrderItem: 'ORDER_ITEM',
  orderItem: 'ORDER_ITEM',
  productProvider: 'PRODUCT_PROVIDER',
  File: 'DOCUMENT',
};

export const parseRoute = (entityType: string) => {
  return mappingRoutes?.[entityType] ?? entityType;
};

export const parseIcon = (entityType: string) => {
  return mappingIcon?.[entityType] ?? entityType?.toUpperCase() ?? 'ORDER';
};

/**
 * Retrieves related organizations of an entity
 */
export const getEntityRelatedOrganizations = (entity: any) => {
  if (!entity) {
    return [];
  }

  const organizationIds = new Set();

  switch (entity.__typename) {
    case 'Batch':
      organizationIds.add(entity.ownedBy?.id);
      organizationIds.add(entity.exporter?.id);
      organizationIds.add(entity.importer?.id);

      // eslint-disable-next-line
      entity.forwarders?.forEach(forwarder => {
        organizationIds.add(forwarder?.id);
      });
      break;
    case 'Order':
      organizationIds.add(entity.ownedBy?.id);
      organizationIds.add(entity.exporter?.id);
      organizationIds.add(entity.importer?.id);

      // eslint-disable-next-line
      entity.organizations?.forEach(organization => {
        organizationIds.add(organization?.id);
      });

      break;
    case 'OrderItem':
      organizationIds.add(entity.order?.ownedBy?.id);
      organizationIds.add(entity.order?.exporter?.id);
      organizationIds.add(entity.order?.importer?.id);

      // eslint-disable-next-line
      entity.order?.organizations?.forEach(organization => {
        organizationIds.add(organization?.id);
      });
      break;
    case 'Product':
      organizationIds.add(entity.ownedBy?.id);
      organizationIds.add(entity.importer?.id);

      // eslint-disable-next-line
      entity.organizations?.forEach(organization => {
        organizationIds.add(organization?.id);
      });
      break;
    case 'Shipment':
      organizationIds.add(entity.ownedBy?.id);
      organizationIds.add(entity.exporter?.id);
      organizationIds.add(entity.importer?.id);

      entity.forwarders.forEach(organization => {
        organizationIds.add(organization?.id);
      });

      // eslint-disable-next-line
      entity.organizations?.forEach(organization => {
        organizationIds.add(organization?.id);
      });
      break;
    case 'Project':
      organizationIds.add(entity.ownedBy?.id);

      entity.organizations.forEach(organization => {
        organizationIds.add(organization?.id);
      });
      break;
    default:
  }

  return [...organizationIds].filter(Boolean);
};
