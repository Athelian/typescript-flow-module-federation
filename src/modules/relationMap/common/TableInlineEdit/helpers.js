// @flow
import { intersection } from 'lodash';
import { removeTypename } from 'utils/data';
import logger from 'utils/logger';
import { getByPathWithDefault, compose } from 'utils/fp';
import { formatToDateLabel } from 'utils/date';
import { prepareCustomFieldsData, list2Map } from 'utils/customFields';
import {
  formatTimeline,
  formatContainerGroups,
  formatVoyages,
} from 'modules/shipment/form/mutation';

type MappingObject = {
  data: {
    id: string,
  },
  relation: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  },
};

export const findAllPossibleOrders = (
  selected: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  },
  mappingObjects: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  }
): {
  orderIds: Array<string>,
  orderItemsIds: Array<string>,
  batchIds: Array<string>,
  shipmentIds: Array<string>,
} => {
  const orderIds = selected.order ? Object.keys(selected.order) : [];
  const orderItemsIds = selected.orderItem ? Object.keys(selected.orderItem) : [];
  const batchIds = selected.batch ? Object.keys(selected.batch) : [];
  const shipmentIds = selected.shipment ? Object.keys(selected.shipment) : [];

  // find all orders from selected order
  if (orderIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.order): any).forEach((item: [string, MappingObject]) => {
      const [orderId, order] = item;
      if (selected.order && selected.order[orderId]) {
        orderItemsIds.push(...Object.keys(order.relation.orderItem));
        batchIds.push(...Object.keys(order.relation.batch));
        shipmentIds.push(...Object.keys(order.relation.shipment));
      }
    });
  }

  if (orderItemsIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.orderItem): any).forEach((item: [string, MappingObject]) => {
      const [orderItemId, orderItem] = item;
      if (selected.orderItem && selected.orderItem[orderItemId]) {
        orderIds.push(...Object.keys(orderItem.relation.order));
        batchIds.push(...Object.keys(orderItem.relation.batch));
        shipmentIds.push(...Object.keys(orderItem.relation.shipment));
      }
    });
  }

  if (shipmentIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.shipment): any).forEach((item: [string, MappingObject]) => {
      const [shipmentId, shipment] = item;
      if (selected.shipment && selected.shipment[shipmentId]) {
        orderIds.push(...Object.keys(shipment.relation.order));
        orderItemsIds.push(...Object.keys(shipment.relation.orderItem));
        batchIds.push(...Object.keys(shipment.relation.batch));
      }
    });
  }

  if (batchIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.batch): any).forEach((item: [string, MappingObject]) => {
      const [batchId, batch] = item;
      if (selected.batch && selected.batch[batchId]) {
        orderIds.push(...Object.keys(batch.relation.order));
        orderItemsIds.push(...Object.keys(batch.relation.orderItem));
        shipmentIds.push(...Object.keys(batch.relation.shipment));
      }
    });
  }

  return {
    orderIds: [...new Set(orderIds)],
    orderItemsIds: [...new Set(orderItemsIds)],
    batchIds: [...new Set(batchIds)],
    shipmentIds: [...new Set(shipmentIds)],
  };
};

export const getOrderItemIdsByOrderId = (
  orderId: string,
  mappingObjects: {
    order: Object,
  }
): Array<string> => [...Object.keys(mappingObjects.order[orderId].relation.orderItem)];

export const totalLinePerOrder = (orderItems: Array<Object>, batchIds: Array<string>) => {
  let totalLines = 0;
  if (orderItems.length === 0) {
    totalLines = 1;
  } else {
    totalLines = orderItems.reduce((result, orderItem) => {
      const totalBatches = intersection(Object.keys(orderItem.relation.batch), batchIds).length;
      if (totalBatches === 0) {
        return result + 1;
      }
      return result + totalBatches;
    }, 0);
  }
  return totalLines;
};

export const parseChangedData = (
  changedData: { orders?: Object, shipments?: Object, orderItems?: Object, batches?: Object },
  editData: Object
) => {
  logger.warn({ changedData, editData });
  const orders = [];
  const batches = [];
  const shipments = [];
  if (changedData.orders) {
    (Object.entries(changedData.orders): any).forEach(item => {
      const [id, order] = item;
      const keys = Object.keys(order);
      const changedOrder = {};
      keys.forEach(key => {
        const updateValue = editData.orders[id][key];
        switch (key) {
          case 'issuedAt': {
            changedOrder[key] = updateValue ? new Date(updateValue) : null;
            break;
          }

          case 'inCharges':
            changedOrder.inChargeIds = updateValue.map(({ id: userId }) => userId);
            break;
          case 'tags':
            changedOrder.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;

          case 'currency':
          case 'incoterm': {
            changedOrder[key] = updateValue && updateValue.length > 0 ? updateValue : null;
            break;
          }
          case 'customFields':
            changedOrder[key] = prepareCustomFieldsData(updateValue);
            break;

          default:
            changedOrder[key] = updateValue;
        }
      });
      orders.push({ input: changedOrder, id });
    });
  }

  if (changedData.shipments) {
    (Object.entries(changedData.shipments): any).forEach(item => {
      const [id, shipment] = item;
      const keys = Object.keys(shipment);
      const changedShipment = {};
      keys.forEach(key => {
        const updateValue = editData.shipments[id][key];
        switch (key) {
          case 'bookingDate':
          case 'blDate': {
            changedShipment[key] = updateValue ? new Date(updateValue) : null;
            break;
          }

          case 'inCharges':
            changedShipment.inChargeIds = updateValue.map(({ id: userId }) => userId);
            break;
          case 'forwarders':
            changedShipment.forwarderIds = updateValue.map(({ id: userId }) => userId);
            break;
          case 'tags':
            changedShipment.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;

          case 'cargoReady': {
            changedShipment[key] = formatTimeline(updateValue);
            break;
          }

          case 'voyages': {
            changedShipment[key] = formatVoyages(updateValue);
            break;
          }

          case 'containerGroups': {
            changedShipment[key] = formatContainerGroups(updateValue);
            break;
          }

          case 'loadType':
          case 'transportType':
          case 'incoterm': {
            changedShipment[key] = updateValue && updateValue.length > 0 ? updateValue : null;
            break;
          }

          case 'customFields':
            changedShipment[key] = prepareCustomFieldsData(updateValue);
            break;

          default:
            changedShipment[key] = updateValue;
        }
      });
      shipments.push({ input: changedShipment, id });
    });
  }

  if (changedData.orderItems) {
    (Object.entries(changedData.orderItems): any).forEach(item => {
      const [id, orderItem] = item;
      const keys = Object.keys(orderItem);
      const changedOrderItem = {};
      keys.forEach(key => {
        const updateValue = editData.orderItems[id][key];
        switch (key) {
          case 'productProvider':
            changedOrderItem.productProviderId = updateValue.id;
            break;
          case 'price':
            changedOrderItem[key] = removeTypename(updateValue);
            break;

          default:
            changedOrderItem[key] = updateValue;
        }
      });
      const orderId = editData.orderItems[id].order;
      const existUpdateOrder = orders.find(order => order.id === orderId);
      const order = editData.orders[orderId];
      if (existUpdateOrder) {
        if (existUpdateOrder.input && existUpdateOrder.input.orderItems) {
          orders.splice(orders.findIndex(currentOrder => currentOrder.id === orderId), 1, {
            input: {
              ...existUpdateOrder.input,
              orderItems: [
                ...existUpdateOrder.input.orderItems.filter(orderItemId => orderItemId.id !== id),
                {
                  ...existUpdateOrder.input.orderItems.find(orderItemId => orderItemId.id === id),
                  ...changedOrderItem,
                },
              ],
            },
            id: orderId,
          });
        } else {
          orders.splice(orders.findIndex(currentOrder => currentOrder.id === orderId), 1, {
            input: {
              ...existUpdateOrder.input,
              orderItems: [
                ...order.orderItems
                  .filter(orderItemId => orderItemId !== id)
                  .map(orderItemId => ({ id: orderItemId })),
                {
                  ...changedOrderItem,
                  id,
                },
              ],
            },
            id: orderId,
          });
        }
      } else {
        orders.push({
          input: {
            orderItems: [
              ...order.orderItems
                .filter(orderItemId => orderItemId !== id)
                .map(orderItemId => ({ id: orderItemId })),
              {
                ...changedOrderItem,
                id,
              },
            ],
          },
          id: orderId,
        });
      }
    });
  }

  if (changedData.batches) {
    (Object.entries(changedData.batches): any).forEach(item => {
      const [id, batch] = item;
      const keys = Object.keys(batch);
      const changedBatch = {};
      keys.forEach(key => {
        const updateValue = editData.batches[id][key];
        switch (key) {
          case 'deliveredAt':
          case 'expiredAt':
          case 'producedAt': {
            changedBatch[key] = updateValue ? new Date(updateValue) : null;
            break;
          }

          case 'packageSize': {
            const packageSize = removeTypename(updateValue);
            if (!packageSize.width) {
              packageSize.width = {
                value: 0,
                metric: '',
              };
            }
            if (!packageSize.height) {
              packageSize.height = {
                value: 0,
                metric: '',
              };
            }
            if (!packageSize.length) {
              packageSize.length = {
                value: 0,
                metric: '',
              };
            }

            changedBatch[key] = packageSize;
            break;
          }

          case 'tags':
            changedBatch.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;

          case 'customFields':
            changedBatch[key] = prepareCustomFieldsData(updateValue);
            break;

          default:
            changedBatch[key] = updateValue;
        }
      });
      batches.push({ input: changedBatch, id });
    });
  }

  return {
    orders,
    batches,
    shipments,
    warehouses: [],
    products: [],
  };
};

export function getExportColumns({
  orderColumnFieldsFilter,
  orderItemColumnFieldsFilter,
  batchColumnFieldsFilter,
  shipmentColumnFieldsFilter,
  orderCustomFieldsFilter,
  orderItemCustomFieldsFilter,
  batchCustomFieldsFilter,
  shipmentCustomFieldsFilter,
}: Object): Array<string> {
  const allColumns = [
    ...orderColumnFieldsFilter,
    ...orderCustomFieldsFilter,
    ...orderItemColumnFieldsFilter,
    ...orderItemCustomFieldsFilter,
    ...batchColumnFieldsFilter,
    ...batchCustomFieldsFilter,
    ...shipmentColumnFieldsFilter,
    ...shipmentCustomFieldsFilter,
  ].map(column => column.name);
  return allColumns;
}

export const getFieldValueByType = (type: string) => (value: any) => {
  switch (type) {
    case 'date':
    case 'timeline':
      return value ? formatToDateLabel(value) : '';
    case 'number':
      return `${value}`;
    default:
      return value;
  }
};
export function getFieldValues(fields: Array<Object>, values: Array<Object>) {
  const fieldValues: Array<string> = (fields: Array<Object>).map(
    ({ name, type, getExportValue }): any => {
      const value = getExportValue
        ? compose(
            getFieldValueByType(type),
            getExportValue
          )(values)
        : compose(
            getFieldValueByType(type),
            getByPathWithDefault('', name)
          )(values);
      return `${value}`;
    }
  );
  return fieldValues;
}

export function getEmptyValues(fields: Array<Object>) {
  return (fields.map(() => ''): Array<string>);
}

export function getCustomFieldValues(fields: Array<Object>, values: Array<Object>) {
  const customFields = getByPathWithDefault(
    {
      mask: null,
      fieldDefinitions: [],
      fieldValues: [],
    },
    'customFields',
    values
  );
  const { fieldValues } = customFields;
  const fieldValueMap = list2Map(fieldValues);
  const customFieldValues: Array<string> = fields.map(({ id }) => {
    const fieldValue = fieldValueMap.get(id);
    return fieldValue ? fieldValue.value.string : '';
  });
  return customFieldValues;
}

export function getExportRows(info: Object): Array<Array<?string>> {
  const {
    data: { editData, mappingObjects },
    ids: { orderIds, orderItemsIds, batchIds },
    columns: {
      orderColumnFieldsFilter,
      orderItemColumnFieldsFilter,
      batchColumnFieldsFilter,
      shipmentColumnFieldsFilter,
      orderCustomFieldsFilter,
      orderItemCustomFieldsFilter,
      batchCustomFieldsFilter,
      shipmentCustomFieldsFilter,
    },
  } = info;
  const rows = [];
  orderIds.forEach(orderId => {
    const order = mappingObjects.order[orderId];
    if (!order) return null;
    const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
      item => order.relation.orderItem[item.data.id] && orderItemsIds.includes(item.data.id)
    );
    const orderData = editData.orders[orderId];
    const orderValues = getFieldValues(orderColumnFieldsFilter, orderData);
    const orderCustomValues = getCustomFieldValues(orderCustomFieldsFilter, orderData);
    const orderRow = [...orderValues, ...orderCustomValues];
    if (orderItems.length === 0) {
      const emptyRow = getEmptyValues([
        ...orderItemColumnFieldsFilter,
        ...orderItemCustomFieldsFilter,
        ...batchColumnFieldsFilter,
        ...batchCustomFieldsFilter,
        ...shipmentColumnFieldsFilter,
        ...shipmentCustomFieldsFilter,
      ]);
      const currentRow = [...orderRow, ...emptyRow];
      return rows.push(currentRow);
    }
    return orderItems.forEach(orderItem => {
      const notHaveBatches = Object.keys(orderItem.relation.batch).length === 0;
      const orderItemData = editData.orderItems[orderItem.data.id];
      const orderItemValues = getFieldValues(orderItemColumnFieldsFilter, orderItemData);
      const orderItemCustomValues = getCustomFieldValues(
        orderItemCustomFieldsFilter,
        orderItemData
      );
      const orderItemRow = [...orderItemValues, ...orderItemCustomValues];
      if (notHaveBatches) {
        const emptyRow = getEmptyValues([
          ...batchColumnFieldsFilter,
          ...batchCustomFieldsFilter,
          ...shipmentColumnFieldsFilter,
          ...shipmentCustomFieldsFilter,
        ]);
        const currentRow = [...orderRow, ...orderItemRow, ...emptyRow];
        return rows.push(currentRow);
      }
      return orderItem.data.batches
        .filter(batch => batchIds.includes(batch.id))
        .forEach(batch => {
          const batchData = editData.batches[batch.id];
          const batchValues = getFieldValues(batchColumnFieldsFilter, batchData);
          const batchCustomValues = getCustomFieldValues(batchCustomFieldsFilter, batchData);
          const batchRow = [...batchValues, ...batchCustomValues];
          let shipmentRow = [];
          if (!batch.shipment) {
            shipmentRow = getEmptyValues([
              ...shipmentColumnFieldsFilter,
              ...shipmentCustomFieldsFilter,
            ]);
          } else {
            const shipment = mappingObjects.shipment[batch.shipment.id];
            const shipmentData = editData.shipments[shipment.data.id];
            const shipmentValues = getFieldValues(shipmentColumnFieldsFilter, shipmentData);
            const shipmentCustomValues = getCustomFieldValues(
              shipmentCustomFieldsFilter,
              shipmentData
            );
            shipmentRow = [...shipmentValues, ...shipmentCustomValues];
          }
          const currentRow = [...orderRow, ...orderItemRow, ...batchRow, ...shipmentRow];
          rows.push(currentRow);
        });
    });
  });
  return rows;
}
