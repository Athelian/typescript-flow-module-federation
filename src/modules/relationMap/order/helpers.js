// @flow
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/constants';

/**
 * Check the result has next page or not
 * @param {Object} data result from graphql server
 * @param {string} model which nested field we want to select
 * @returns boolean true if has more page to load
 */
export const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

/**
 * Find the high light entities by selected entity
 * @param {Object} highlight
 * @param {Object} item
 * @returns list of entities with format `TYPE-ID`
 */
export function findHighLightEntities(
  highlight: {
    type: string,
    selectedId: string,
  },
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
  }
) {
  const highLightIds = [];
  switch (highlight.type) {
    case SHIPMENT: {
      const { shipments, orders, orderItems } = entities;
      highLightIds.push(`${SHIPMENT}-${highlight.selectedId}`);
      const { batches = [] } = shipments[highlight.selectedId] || {};
      batches.forEach(id => {
        highLightIds.push(`${BATCH}-${id}`);
        const [orderItemId] =
          (Object.entries(orderItems || {}): Array<any>).find(
            ([, orderItem]) => orderItem.batches && orderItem.batches.includes(id)
          ) || [];
        if (orderItemId) {
          highLightIds.push(`${ORDER_ITEM}-${orderItemId}`);
          const [orderId] =
            (Object.entries(orders || {}): Array<any>).find(
              ([, order]) => order.orderItems && order.orderItems.includes(orderItemId)
            ) || [];
          if (orderId) highLightIds.push(`${ORDER}-${orderId}`);
        }
      });
      break;
    }

    case ORDER: {
      const { orders, orderItems } = entities;
      highLightIds.push(`${ORDER}-${highlight.selectedId}`);
      const { orderItems: orderItemIds = [], shipments: shipmentsIds = [] } =
        orders[highlight.selectedId] || {};
      orderItemIds.forEach(orderItemId => {
        const orderItem = orderItems[orderItemId];
        highLightIds.push(`${ORDER_ITEM}-${orderItem.id}`);
        const { batches } = orderItem;
        batches.forEach(id => {
          highLightIds.push(`${BATCH}-${id}`);
        });
      });
      shipmentsIds.forEach(id => {
        highLightIds.push(`${SHIPMENT}-${id}`);
      });
      break;
    }

    case ORDER_ITEM: {
      const { orders, orderItems, shipments } = entities;
      highLightIds.push(`${ORDER_ITEM}-${highlight.selectedId}`);
      const orderItem = orderItems[highlight.selectedId];
      const { batches = [] } = orderItem || {};
      batches.forEach(id => {
        highLightIds.push(`${BATCH}-${id}`);
        const [shipmentId] =
          (Object.entries(shipments || {}): Array<any>).find(
            ([, shipment]) => shipment.batches && shipment.batches.includes(id)
          ) || [];
        if (shipmentId) highLightIds.push(`${SHIPMENT}-${shipmentId}`);
      });
      const [orderId] =
        (Object.entries(orders || {}): Array<any>).find(
          ([, order]) => order.orderItems && order.orderItems.includes(highlight.selectedId)
        ) || [];
      if (orderId) highLightIds.push(`${ORDER}-${orderId}`);
      break;
    }

    case BATCH: {
      const { shipments, orders, orderItems } = entities;
      highLightIds.push(`${BATCH}-${highlight.selectedId}`);
      const [shipmentId] =
        (Object.entries(shipments || {}): Array<any>).find(
          ([, shipment]) => shipment.batches && shipment.batches.includes(highlight.selectedId)
        ) || [];
      if (shipmentId) highLightIds.push(`${SHIPMENT}-${shipmentId}`);
      const [orderItemId] =
        (Object.entries(orderItems || {}): Array<any>).find(
          ([, orderItem]) => orderItem.batches && orderItem.batches.includes(highlight.selectedId)
        ) || [];
      if (orderItemId) {
        highLightIds.push(`${ORDER_ITEM}-${orderItemId}`);
        const [orderId] =
          (Object.entries(orders || {}): Array<any>).find(
            ([, order]) => order.orderItems && order.orderItems.includes(orderItemId)
          ) || [];
        if (orderId) highLightIds.push(`${ORDER}-${orderId}`);
      }
      break;
    }

    default:
      break;
  }

  return highLightIds;
}

export default hasMoreItems;
