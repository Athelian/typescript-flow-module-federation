// @flow
import type { OrderItemPayload, BatchPayload } from 'generated/graphql';
import { getByPathWithDefault } from './fp';
import { getBatchLatestQuantity } from './batch';

export const getItemQuantityChartData = ({
  orderItem,
  batches,
}: {
  orderItem: OrderItemPayload,
  batches: Array<BatchPayload>,
}) => {
  const orderedQuantity = getByPathWithDefault(0, 'quantity', orderItem);
  const totalBatched = getByPathWithDefault(0, 'totalBatched', orderItem);
  const totalShipped = getByPathWithDefault(0, 'totalShipped', orderItem);
  const batchCount = getByPathWithDefault(0, 'batchCount', orderItem);
  const batchShippedCount = getByPathWithDefault(0, 'batchShippedCount', orderItem);
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let batched = 0;
  let shipped = 0;

  if (batches && batches.length > 0) {
    batches.forEach(batch => {
      const shipment = getByPathWithDefault(null, 'shipment', batch);
      const quantity = getByPathWithDefault(0, 'quantity', batch);
      const batchQuantityRevisions = getByPathWithDefault([], 'batchQuantityRevisions', batch);
      const latestQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });
      batchedQuantity += latestQuantity;
      batched += 1;
      if (shipment) {
        shippedQuantity += latestQuantity;
        shipped += 1;
      }
    });
  } else {
    batchedQuantity += totalBatched;
    shippedQuantity += totalShipped;
    batched += batchCount;
    shipped += batchShippedCount;
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    batched,
    shipped,
  };
};

export const spreadOrderItem = (item: Object): Object => {
  if (!item) {
    return {
      orderItem: null,
      productProvider: null,
      product: null,
      order: null,
    };
  }

  const {
    id,
    archived,
    no,
    quantity,
    price,
    tags,
    todo,
    totalBatched,
    totalShipped,
    batchCount,
    batchShippedCount,
    productProvider,
    order,
    timeline,
  } = item;
  const compiledOrderItem = {
    id,
    archived,
    no,
    quantity,
    price,
    tags,
    todo,
    totalBatched,
    totalShipped,
    batchCount,
    batchShippedCount,
    timeline,
  };

  const { name: productProviderName, product } = productProvider || {};
  const compiledProductProvider = { name: productProviderName };

  const { id: productId, name, serial, tags: productTags, files } = product || {};
  const compiledProduct = {
    id: productId,
    name,
    serial,
    tags: productTags,
    files,
  };

  const { id: orderId, poNo, importer, exporter } = order || {};
  const compiledOrder = {
    id: orderId,
    poNo,
    importer,
    exporter,
  };

  return {
    orderItem: compiledOrderItem,
    productProvider: compiledProductProvider,
    product: compiledProduct,
    order: compiledOrder,
  };
};
