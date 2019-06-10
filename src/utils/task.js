// @flow
import { getByPath } from 'utils/fp';

export const parseGroupIds = (task: Object) => {
  const entity = getByPath('entity.__typename', task);

  switch (entity) {
    case 'Batch':
      return [
        getByPath('batch.orderItem.order.importer.id', task),
        getByPath('batch.orderItem.order.exporter.id', task),
      ].filter(Boolean);

    case 'OrderItem':
      return [
        getByPath('orderItem.order.importer.id', task),
        getByPath('orderItem.order.exporter.id', task),
      ].filter(Boolean);

    case 'Order':
      return [getByPath('order.importer.id', task), getByPath('order.exporter.id', task)].filter(
        Boolean
      );

    case 'Shipment':
      return [
        getByPath('shipment.importer.id', task),
        getByPath('shipment.exporter.id', task),
      ].filter(Boolean);

    case 'ProductProvider':
      return [
        getByPath('productProvider.product.importer.id', task),
        getByPath('productProvider.exporter.id', task),
      ].filter(Boolean);

    default:
      return [];
  }
};

export default parseGroupIds;
