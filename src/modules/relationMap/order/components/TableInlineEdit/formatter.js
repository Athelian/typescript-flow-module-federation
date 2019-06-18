// @flow
const array2Object = (inputArray: Array<any>): Object =>
  inputArray.reduce((result, key) => ({ ...result, [key]: true }), {});

export const formatOrders = ({
  orders,
  shipments,
  entities,
}: {
  orders: Array<Object>,
  shipments: Array<Object>,
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    products: Object,
    shipments: Object,
    containers: Object,
  },
}) => {
  const order = {};
  const orderItem = {};
  const batch = {};
  const shipment = {};
  (Object.entries(entities.orders || {}): any).forEach(([orderId]) => {
    const currentOrder = orders.find(item => item.id === orderId);
    if (currentOrder) {
      const orderItemIds = Object.keys(entities.orderItems || {}).filter(
        itemId => entities.orderItems[itemId].order === orderId
      );
      const allBatchIds = Object.keys(entities.batches || {}).filter(batchId =>
        orderItemIds.includes(entities.batches[batchId].orderItem)
      );
      const shipmentIds = allBatchIds
        .map(batchId => entities.batches[batchId] && entities.batches[batchId].mainShipment)
        .filter(Boolean);

      order[orderId] = {
        data: {
          ...currentOrder,
          orderItems: orderItemIds.map(orderItemId => entities.orderItems[orderItemId]),
        },
        relation: {
          orderItem: array2Object(orderItemIds),
          batch: array2Object(allBatchIds),
          shipment: array2Object(shipmentIds),
        },
      };

      shipmentIds.forEach(shipmentId => {
        const currentShipment = shipments.find(item => item.id === shipmentId);
        if (currentShipment) {
          if (!shipment[shipmentId]) {
            shipment[shipmentId] = {
              data: {
                ...currentShipment,
                containers: Object.keys(entities.containers || {})
                  .filter(containerId => entities.containers[containerId].shipment === shipmentId)
                  .map(containerId => ({
                    ...entities.containers[containerId],
                    batches: Object.keys(entities.batches || {})
                      .filter(batchId => entities.batches[batchId].container === containerId)
                      .map(batchId => entities.batches[batchId]),
                  })),
              },
              relation: {
                order: {
                  [orderId]: true,
                },
              },
            };
          } else {
            shipment[shipmentId].relation.order[orderId] = true;
          }
        }
      });

      orderItemIds.forEach(orderItemId => {
        const orderItemData = entities.orderItems[orderItemId];
        const batchIds = Object.keys(entities.batches || {}).filter(
          batchId => entities.batches[batchId].orderItem === orderItemId
        );
        if (orderItemData) {
          orderItem[orderItemId] = {
            data: {
              ...orderItemData,
              batches: batchIds
                .map(batchId => entities.batches[batchId])
                .map(batchItem => ({
                  ...batchItem,
                  shipment: batchItem.mainShipment
                    ? entities.shipments[batchItem.mainShipment]
                    : null,
                })),
            },
            relation: {
              order: {
                [orderId]: true,
              },
              batch: array2Object(batchIds),
            },
          };
          batchIds.forEach(batchId => {
            const batchData = entities.batches[batchId];
            batch[batchId] = {
              data: batchData,
              relation: {
                order: {
                  [orderId]: true,
                },
                orderItem: {
                  [orderItemId]: true,
                },
                shipment: {
                  ...(batchData.mainShipment ? { [batchData.mainShipment]: true } : {}),
                },
              },
            };
          });
        }
      });
    }
  });

  // Tracking all shipment which has no order/item/batch
  const shipmentNoRelation = {};
  shipments
    .filter(item => !shipment[item.id])
    .forEach(item => {
      shipment[item.id] = {
        data: item,
        relation: {
          batch: {},
          orderItem: {},
          order: {},
        },
      };
      shipmentNoRelation[item.id] = {
        data: item,
        relation: {
          batch: {},
          orderItem: {},
          order: {},
        },
      };
    });
  return {
    order,
    orderItem,
    batch,
    shipment,
    shipmentNoRelation,
  };
};

export default formatOrders;
