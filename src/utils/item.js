// @flow
import type { OrderItemPayload, BatchPayload } from 'generated/graphql';
import { uuid } from './id';
import { getBatchLatestQuantity } from './batch';

export const getItemQuantityChartData = ({
  orderItem,
  batches,
}: {
  orderItem: OrderItemPayload,
  batches: Array<BatchPayload>,
}) => {
  const orderedQuantity = orderItem?.quantity ?? 0;
  const totalBatched = orderItem?.totalBatched ?? 0;
  const totalShipped = orderItem?.totalShipped ?? 0;
  const batchCount = orderItem?.batchCount ?? 0;
  const batchShippedCount = orderItem?.batchShippedCount ?? 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let batched = 0;
  let shipped = 0;

  if (batches && batches.length > 0) {
    batches.forEach(batch => {
      const shipment = batch?.shipment;
      const latestQuantity = getBatchLatestQuantity(batch);
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

export const generateItemForMovedBatch = (
  orderItem: OrderItemPayload,
  batch: BatchPayload
): OrderItemPayload => {
  const item = {
    ...orderItem,
    customFields: {
      mask: null,
      fieldValues: [],
    },
    todo: {
      tasks: [],
    },
    tags: [],
    followers: [],
    files: [],
    memo: '',
    no: `[auto] ${orderItem.no}`,
    quantity: getBatchLatestQuantity(batch),
    isNew: true,
    id: uuid(),
    price: {
      amount: orderItem?.price?.currency === 'USD' ? orderItem?.price?.amount ?? 0 : 0,
      currency: orderItem?.price?.currency ?? 'USD',
    },
  };
  return {
    ...item,
    batches: [{ ...batch, orderItem: item }],
  };
};
