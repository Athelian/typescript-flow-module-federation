// @flow
import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import { orderFormQuery } from 'modules/order/form/query';
import { createOrderWithReturnDataMutation } from 'modules/order/form/mutation';
// import { orderListQuery } from 'modules/relationMap/orderFocused/query';
import { getByPathWithDefault as get } from 'utils/fp';
import { createMutationRequest } from './index';

export const cloneTree = async ({ client, target }: { client: any, target: Object }) => {
  const mutationRequest = createMutationRequest(client);
  const { shipment, order, orderItem, batch } = target;
  const shipmentIds = Object.keys(shipment);
  const shipmentRequests = shipmentIds.map(shipmentId => {
    const currentShipment = shipment[shipmentId];
    const request = mutationRequest(
      {
        mutation: createShipmentWithReturnDataMutation,
        variables: {
          input: {
            no: `[cloned] ${currentShipment.no}`,
            containerGroups:
              currentShipment.containerGroups &&
              currentShipment.containerGroups.map(group => ({
                warehouseId: get('1', 'warehouse.id', group),
              })),
            voyages:
              currentShipment.voyages &&
              currentShipment.voyages.map(voyage => ({ vesselName: voyage.vesselName })),
          },
        },
      },
      shipmentId
    );
    return request;
  });
  const newShipments = await Promise.all(shipmentRequests);

  const shipmentResults: Array<Object> = newShipments.map(newShipment =>
    get({}, 'data.shipmentCreate.shipment', newShipment)
  );
  const shipmentFocus = shipmentResults.reduce(
    (focus, shipmentResult) =>
      Object.assign(focus, {
        [shipmentResult.id]: true,
      }),
    {}
  );

  const mappedNewShipment = newShipments.reduce((mappedObj, newShipment) => {
    const newShipmentId = get(null, 'data.shipmentCreate.shipment.id', newShipment);
    const oldShipmentId = newShipment.refId;
    const oldShipmentRef = oldShipmentId ? { [oldShipmentId]: newShipmentId } : {};
    return Object.assign(mappedObj, oldShipmentRef);
  }, {});

  const orderIds = Object.keys(order);
  const orderQueries = orderIds.map(orderId =>
    client.query({
      query: orderFormQuery,
      variables: { id: orderId },
    })
  );
  const orderData = await Promise.all(orderQueries);
  const orderCreateInputs = orderData.map(orderDatum => {
    const currentOrder = get({}, 'data.order', orderDatum);
    const formattedOrderItems = (currentOrder.orderItems || [])
      .filter(({ id: orderItemId }) => orderItem[orderItemId])
      .map(currentOrderItem => {
        const formattedBatches = (currentOrderItem.batches || [])
          .filter(({ id: batchId }) => batch[batchId])
          .map(currentBatch => ({
            no: currentBatch.no,
            quantity: currentBatch.quantity,
            shipmentId: mappedNewShipment[get('', 'shipment.id', currentBatch)] || null,
          }));
        return {
          batches: formattedBatches,
          quantity: currentOrderItem.quantity,
          productProviderId: get(null, 'productProvider.id', currentOrderItem),
          price: {
            amount: get(0, 'price.amount', currentOrderItem),
            currency: get('All', 'price.currency', currentOrderItem),
          },
        };
      });
    return {
      poNo: `[cloned] ${currentOrder.poNo}`,
      exporterId: currentOrder.exporter && currentOrder.exporter.id,
      currency: currentOrder.currency,
      orderItems: formattedOrderItems,
    };
  });

  const orderCreateMutates = orderCreateInputs.map(input =>
    client.mutate({
      mutation: createOrderWithReturnDataMutation,
      variables: { input },
    })
  );
  const newOrders = await Promise.all(orderCreateMutates);
  const orderResults: Array<Object> = newOrders.map(newOrder =>
    get({}, 'data.orderCreate.order', newOrder)
  );
  const orderFocus = orderResults.reduce(
    (focus, orderResult) =>
      Object.assign(focus, {
        [orderResult.id]: {
          orderItems: (orderResult.orderItems || []).map(({ id: orderItemId, batches }) => ({
            id: orderItemId,
            batches: batches.map(({ id }) => ({ id })),
          })),
        },
      }),
    {}
  );

  const result = {
    order: orderResults,
    shipment: shipmentResults,
    orderItem: {},
    batch: {},
  };
  const focus = {
    order: orderFocus,
    shipment: shipmentFocus,
    orderItem: {},
    batch: {},
  };
  return [result, focus];
};

export default null;
