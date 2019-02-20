// @flow
import * as React from 'react';
import PermissionContext from './PermissionContext';

// should get form back-end
const permissions = [
  'tag.list',
  'tag.r',
  // 'tag.w',
  'tag.name.w',
  'product.products.setDocuments',
  'product.productProviders.setDocuments',
  'order.orders.get',
  'order.orders.export',
  'order.orderItems.list',
  'order.orderItems.get',
  'order.orders.list',
  'container.containers.list',
  'container.containers.get',
  'container.batches.list',
  'container.batches.get',
  'warehouse.warehouses.list',
  'warehouse.warehouses.get',
  'network.users.list',
  'network.users.get',
  'network.partners.list',
  'network.partners.get',
  'product.products.list',
  'product.products.get',
  'product.products.export',
  'product.productProviders.list',
  'product.productProviders.get',
  'shipment.containerBatches.get',
  'shipment.batches.get',
  'shipment.containers.list',
  'shipment.containers.get',
  'shipment.batches.list',
  'shipment.containerBatches.list',
  'shipment.shipments.list',
  'shipment.shipments.get',
  'shipment.shipments.export',
  'batch.batches.list',
  'batch.batches.get',
  'customField.masks.list',
  'customField.masks.get',
  'customField.fieldDefinitions.list',
  'customField.fieldDefinitions.get',
  'customField.fieldValues.get',
  'relationMap.orders.list',
  'relationMap.products.list',
];

type ContextProviderProps = {
  children: React.Node,
};

const PermissionProvider = ({ children }: ContextProviderProps) => (
  <PermissionContext.Provider value={{ permissions }}>{children}</PermissionContext.Provider>
);

export default PermissionProvider;
