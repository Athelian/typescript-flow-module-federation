// @flow
import normalize from './normalize';

const array2Object = (inputArray: Array<any>): Object =>
  inputArray.reduce((result, key) => ({ ...result, [key]: true }), {});

export const formatOrders = ({
  orders,
  shipments,
}: {
  orders: Array<Object>,
  shipments: Array<Object>,
}) => {
  const { entities } = normalize({ orders, orderItems: [], batches: [], shipments });
  const order = {};
  const orderItem = {};
  const batch = {};
  const shipment = {};
  (Object.entries(entities.orders || {}): any).forEach(([orderId, orderData]) => {
    const currentOrder = orders.find(item => item.id === orderId);
    if (currentOrder) {
      order[orderId] = {
        data: currentOrder,
        relation: {
          orderItem: array2Object(orderData.orderItems),
          batch: array2Object(
            orderData.orderItems
              .map(orderItemId => entities.orderItems[orderItemId].batches)
              .reduce((result, currentBatches) => result.concat(currentBatches), [])
          ),
          shipment: array2Object(orderData.shipments),
        },
      };
      orderData.shipments.forEach(shipmentId => {
        const currentShipment = shipments.find(item => item.id === shipmentId);
        if (currentShipment) {
          if (!shipment[shipmentId]) {
            shipment[shipmentId] = {
              data: currentShipment,
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

      orderData.orderItems.forEach(orderItemId => {
        const orderItemData = entities.orderItems[orderItemId];
        if (orderItemData) {
          orderItem[orderItemId] = {
            data: {
              ...orderItemData,
              batches: orderItemData.batches
                .map(batchId => entities.batches[batchId])
                .map(batchItem => ({
                  ...batchItem,
                  shipment: batchItem.shipment ? entities.shipments[batchItem.shipment] : null,
                })),
            },
            relation: {
              order: {
                [orderId]: true,
              },
              batch: array2Object(orderItemData.batches || []),
            },
          };
          (orderItemData.batches || []).forEach(batchId => {
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
                  ...(batchData.shipment ? { [batchData.shipment]: true } : {}),
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
