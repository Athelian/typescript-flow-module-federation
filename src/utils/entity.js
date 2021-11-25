// @flow

const mappingRoutes = {
  orderItem: 'order-item',
  OrderItem: 'order-item',
};

const mappingIcon = {
  OrderItem: 'ORDER_ITEM',
  orderItem: 'ORDER_ITEM',
  productProvider: 'PRODUCT_PROVIDER',
  ProductProvider: 'PRODUCT_PROVIDER',
  File: 'DOCUMENT',
};

export const parseRoute = (entityType: string) => {
  return mappingRoutes?.[entityType] ?? entityType;
};

export const parseIcon = (entityType: string) => {
  return mappingIcon?.[entityType] ?? entityType?.toUpperCase() ?? 'ORDER';
};

const getOrgIdsFromValue = (entity: any) => {
  if (!entity) {
    return [];
  }

  const organizationIds = new Set();

  organizationIds.add(entity.ownedBy?.id);
  organizationIds.add(entity.exporter?.id);
  organizationIds.add(entity.importer?.id);

  // eslint-disable-next-line
  entity.forwarders?.forEach(forwarder => {
    organizationIds.add(forwarder?.id);
  });

  // shared partners
  // eslint-disable-next-line
  entity.organizations?.forEach(organization => {
    organizationIds.add(organization?.id);
  });

  return [...organizationIds];
};
/**
 * Retrieves related organizations of an entity
 */
export const getEntityRelatedOrganizations = ({
  entity,
  userOrganizationId,
  formState,
}: {
  entity: any,
  userOrganizationId?: string,
  formState?: any,
}) => {
  if (!entity) {
    return [];
  }

  const entityIds = getOrgIdsFromValue(entity);
  const formStateIds = getOrgIdsFromValue(formState);
  const formStateOrderIds = getOrgIdsFromValue(formState?.order);
  // in case of order item
  const entityOrderIds = getOrgIdsFromValue(entity?.order);

  const organizationIds = new Set([
    userOrganizationId,
    ...entityIds,
    ...entityOrderIds,
    ...formStateIds,
    ...formStateOrderIds,
  ]);

  return [...organizationIds].filter(Boolean);
};
