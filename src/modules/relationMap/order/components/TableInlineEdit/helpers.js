// @flow
import { cloneDeep, intersection } from 'lodash';
import type { IntlShape } from 'react-intl';
// $FlowFixMe missing define for partialRight
import { partialRight } from 'ramda';
import { removeTypename } from 'utils/data';
import { getByPathWithDefault, compose } from 'utils/fp';
import { formatToDateLabel } from 'utils/date';
import logger from 'utils/logger';
import { prepareCustomFieldsData, list2Map } from 'utils/customFields';

const formatTimeline = (timeline: Object) => {
  if (!timeline) return null;

  const { assignedTo, memo, approvedBy, date, timelineDateRevisions } = timeline;

  return {
    memo,
    date: date ? new Date(date) : null,
    ...(Array.isArray(assignedTo) ? { assignedToIds: assignedTo.map(({ id }) => id) } : {}),
    ...(Array.isArray(timelineDateRevisions)
      ? {
          timelineDateRevisions: timelineDateRevisions
            .filter(item => item && (item.date || item.memo))
            .map(({ id, date: dateRevision, type, memo: memoRevision }) => ({
              id: id && id.includes('-') ? null : id,
              type,
              memo: memoRevision,
              date: dateRevision ? new Date(dateRevision) : null,
            })),
        }
      : {}),
    approvedById: approvedBy && approvedBy.id,
  };
};

const formatVoyages = (voyages: Array<Object>): Array<Object> =>
  voyages.map(({ id, departure, arrival, arrivalPort, departurePort, vesselName, vesselCode }) => ({
    ...(id && id.includes('-') ? {} : { id }),
    vesselCode,
    vesselName,
    departurePort: !departurePort
      ? null
      : {
          airport: departurePort && departurePort.airport ? departurePort.airport : null,
          seaport: departurePort && departurePort.seaport ? departurePort.seaport : null,
        },
    departure: !departure ? null : formatTimeline(departure),
    arrivalPort: !arrivalPort
      ? null
      : {
          airport: arrivalPort && arrivalPort.airport ? arrivalPort.airport : null,
          seaport: arrivalPort && arrivalPort.seaport ? arrivalPort.seaport : null,
        },
    arrival: !arrival ? null : formatTimeline(arrival),
  }));

const formatContainerGroups = (voyages: Array<Object>): Array<Object> =>
  voyages.map(({ id, warehouse, customClearance, warehouseArrival, deliveryReady }) => ({
    ...(id && id.includes('-') ? {} : { id }),
    warehouseId: warehouse && warehouse.id,
    customClearance: !customClearance ? null : formatTimeline(customClearance),
    warehouseArrival: !warehouseArrival ? null : formatTimeline(warehouseArrival),
    deliveryReady: !deliveryReady ? null : formatTimeline(deliveryReady),
  }));

/**
 *
 * @param {*} targets selected cards
 * @param {*} entities data from API
 */
export const findAllPossibleIds = (
  selected: {
    orderIds: Array<string>,
    orderItemIds: Array<string>,
    batchIds: Array<string>,
    shipmentIds: Array<string>,
  },
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
    products: Object,
    containers: Object,
  }
): {
  orderIds: Array<Object>,
  orderItemIds: Array<Object>,
  batchIds: Array<Object>,
  shipmentIds: Array<Object>,
  productIds: Array<Object>,
  containerIds: Array<Object>,
} => {
  logger.warn({
    selected,
    entities,
  });
  const { orderIds, orderItemIds, batchIds, shipmentIds } = cloneDeep(selected);
  // If Order is selected, the entire Order tree (Order, Items, Product, and Batches)
  // plus all related Shipments go to the Edit view
  (Object.values(entities.orders || {}): any).forEach(order => {
    if (selected.orderIds.includes(order.id)) {
      if (order.orderItems) {
        orderItemIds.push(...order.orderItems);
        order.orderItems.forEach(orderItemId => {
          const orderItem = entities.orderItems[orderItemId];
          if (orderItem && orderItem.batches) {
            batchIds.push(...orderItem.batches);
          }
        });
      }

      if (order.shipments) {
        shipmentIds.push(...order.shipments);
      }
    }
  });

  // If Shipment is selected, the Shipment itself, all of its Batches,
  // all of the Item parents of those Batches, all of the Product base Items
  // and all of the Order parents of those Items go to the Edit view
  (Object.entries(entities.shipments || {}): any).forEach((item: [string, Object]) => {
    const [shipmentId, shipment] = item;
    if (selected.shipmentIds.includes(shipmentId)) {
      if (shipment.batches) {
        batchIds.push(...shipment.batches);
        shipment.batches.forEach(batchId => {
          const batch = entities.batches[batchId];
          if (batch && batch.orderItem) {
            orderItemIds.push(batch.orderItem);
            const orderItem = entities.orderItems[batch.orderItem];
            if (orderItem && orderItem.order) {
              orderIds.push(orderItem.order);
            }
          }
        });
      }
    }
  });

  // If Item is selected, the Order parent, the Item and its Product and all of its Batches
  // with all the related Shipments, go to the Edit view
  (Object.entries(entities.orderItems || {}): Array<any>).forEach(([orderItemId, orderItem]) => {
    if (selected.orderItemIds.includes(orderItemId)) {
      orderIds.push(orderItem.order);
      if (orderItem && orderItem.batches) {
        batchIds.push(...orderItem.batches);
        orderItem.batches.forEach(batchId => {
          const batch = entities.batches[batchId];
          const shipmentId = batch.shipment;
          if (shipmentId && !shipmentIds.includes(shipmentId)) {
            shipmentIds.push(shipmentId);
          }
        });
      }
    }
  });

  // If Batch is selected, the Order, Item and Product parent and the Batch itself
  // and the related Shipment go to the Edit view
  (Object.entries(entities.batches || {}): Array<any>).forEach(([batchId, batch]) => {
    if (selected.batchIds.includes(batchId)) {
      if (!orderItemIds.includes(batch.orderItem)) {
        orderItemIds.push(batch.orderItem);
        const orderItem = entities.orderItems[batch.orderItem];
        if (orderItem && orderItem.order) {
          orderIds.push(orderItem.order);
        }
      }
      if (batch.shipment && !shipmentIds.includes(batch.shipment)) {
        shipmentIds.push(batch.shipment);
      }
    }
  });

  const productIds = Object.keys(entities.products || {});
  const containerIds = Object.keys(entities.containers || {});
  return {
    productIds,
    orderIds: [...new Set(orderIds)],
    orderItemIds: [...new Set(orderItemIds)],
    batchIds: [...new Set(batchIds)],
    shipmentIds: [...new Set(shipmentIds)],
    containerIds,
  };
};

export function findOrderAndShipmentIds(
  selectedItem: {
    type: 'orderItem' | 'batch' | 'order' | 'shipment',
    selectedId: string,
  },
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
  }
) {
  const result = {
    orders: [],
    shipments: [],
  };
  switch (selectedItem.type) {
    case 'order': {
      const { orders } = entities;

      const selectedOrder = orders[selectedItem.selectedId];

      result.shipments.push(...(selectedOrder.shipments || []));

      if (selectedOrder && selectedOrder.orderItems) {
        selectedOrder.orderItems.forEach(id => {
          const orderItemResult = findOrderAndShipmentIds(
            {
              type: 'orderItem',
              selectedId: id,
            },
            entities
          );
          result.orders.push(...orderItemResult.orders);
          result.shipments.push(...orderItemResult.shipments);
        });
      }
      break;
    }

    case 'shipment': {
      const { orderItems, shipments, batches } = entities;

      const selectedShipment = shipments[selectedItem.selectedId];

      if (selectedShipment && selectedShipment.batches) {
        selectedShipment.batches.forEach(id => {
          const selectedBatch = batches[id];
          if (selectedBatch.orderItem) {
            const selectedOrderItem = orderItems[selectedBatch.orderItem];
            result.orders.push(selectedOrderItem.order);
          }

          const batchResult = findOrderAndShipmentIds(
            {
              type: 'batch',
              selectedId: id,
            },
            entities
          );
          result.orders.push(...batchResult.orders);
          result.shipments.push(...batchResult.shipments);
        });
      }
      break;
    }

    case 'orderItem': {
      const { orders, orderItems } = entities;

      const [orderId] =
        (Object.entries(orders || {}): Array<any>).find(
          ([, order]) => order.orderItems && order.orderItems.includes(selectedItem.selectedId)
        ) || [];
      if (orderId) result.orders.push(orderId);

      const selectedOrderItem = orderItems[selectedItem.selectedId];
      if (selectedOrderItem && selectedOrderItem.batches) {
        selectedOrderItem.batches.forEach(batchId => {
          const batchResult = findOrderAndShipmentIds(
            {
              type: 'batch',
              selectedId: batchId,
            },
            entities
          );
          result.orders.push(...batchResult.orders);
          result.shipments.push(...batchResult.shipments);
        });
      }

      break;
    }

    case 'batch': {
      const { shipments, orders, orderItems, batches } = entities;
      const selectedBatch = batches[selectedItem.selectedId];
      if (selectedBatch && selectedBatch.shipment) {
        const {
          shipment: { id: shipmentId },
        } = selectedBatch;
        if (shipmentId) result.shipments.push(shipmentId);
      }

      const [shipmentId] =
        (Object.entries(shipments || {}): Array<any>).find(
          ([, shipment]) => shipment.batches && shipment.batches.includes(selectedItem.selectedId)
        ) || [];
      if (shipmentId) result.shipments.push(shipmentId);
      const [orderItemId] =
        (Object.entries(orderItems || {}): Array<any>).find(
          ([, orderItem]) =>
            orderItem.batches && orderItem.batches.includes(selectedItem.selectedId)
        ) || [];
      if (orderItemId) {
        const [orderId] =
          (Object.entries(orders || {}): Array<any>).find(
            ([, order]) => order.orderItems && order.orderItems.includes(orderItemId)
          ) || [];
        if (orderId) result.orders.push(orderId);
      }
      break;
    }

    default:
      break;
  }

  return result;
}

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
      const totalBatches = intersection(Object.keys(orderItem.relation.batch || {}), batchIds)
        .length;
      if (totalBatches === 0) {
        return result + 1;
      }
      return result + totalBatches;
    }, 0);
  }
  return totalLines;
};

export const parseChangedData = ({
  changedData,
  editData,
  mappingObjects,
}: {
  changedData: {
    orders?: Object,
    shipments?: Object,
    orderItems?: Object,
    batches?: Object,
    products?: Object,
    containers?: Object,
  },
  editData: Object,
  mappingObjects: Object,
}) => {
  logger.warn({ changedData, editData });
  const orders = [];
  const batches = [];
  const shipments = [];
  const products = [];
  const containers = [];
  if (changedData.orders) {
    (Object.entries(changedData.orders || {}): any).forEach(item => {
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
    (Object.entries(changedData.shipments || {}): any).forEach(item => {
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
    (Object.entries(changedData.orderItems || {}): any).forEach(item => {
      const [id, orderItem] = item;
      const keys = Object.keys(orderItem || {});
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

      const [orderId] = Object.keys(mappingObjects.orderItem[id].relation.order || {});
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
    (Object.entries(changedData.batches || {}): any).forEach(item => {
      const [id, batch] = item;
      const keys = Object.keys(batch);
      const changedBatch = {};
      keys.forEach(key => {
        const updateValue = editData.batches[id][key];
        switch (key) {
          case 'deliveredAt':
          case 'desiredAt':
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
          case 'batchQuantityRevisions':
            changedBatch.batchQuantityRevisions = updateValue.map(revision => ({
              id: revision.id,
              quantity: revision.quantity,
              type: revision.type,
            }));
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

  if (changedData.products) {
    (Object.entries(changedData.products || {}): any).forEach(item => {
      const [id, product] = item;
      const keys = Object.keys(product);
      const changedProduct = {};
      keys.forEach(key => {
        const updateValue = editData.products[id][key];
        switch (key) {
          case 'tags':
            changedProduct.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;
          case 'customFields':
            changedProduct[key] = prepareCustomFieldsData(updateValue);
            break;
          default:
            changedProduct[key] = updateValue;
        }
      });
      products.push({ input: changedProduct, id });
    });
  }

  if (changedData.containers) {
    (Object.entries(changedData.containers || {}): any).forEach(item => {
      const [id, container] = item;
      const keys = Object.keys(container);
      const changedContainer = {};
      keys.forEach(key => {
        const updateValue = editData.containers[id][key];
        switch (key) {
          case 'warehouseArrivalAgreedDateApprovedBy':
            changedContainer.warehouseArrivalAgreedDateApprovedById = updateValue && updateValue.id;
            break;
          case 'warehouseArrivalActualDateApprovedBy':
            changedContainer.warehouseArrivalActualDateApprovedById = updateValue && updateValue.id;
            break;
          case 'warehouseArrivalAgreedDateAssignedTo':
            changedContainer.warehouseArrivalAgreedDateAssignedToIds = updateValue.map(
              ({ id: userId }) => userId
            );
            break;
          case 'warehouseArrivalActualDateAssignedTo':
            changedContainer.warehouseArrivalActualDateAssignedToIds = updateValue.map(
              ({ id: userId }) => userId
            );
            break;
          case 'tags':
            changedContainer.tagIds = updateValue.map(({ id: tagId }) => tagId);
            break;
          case 'warehouse':
            changedContainer.warehouseId = updateValue && updateValue.id;
            break;

          case 'containerOption':
            changedContainer[key] = updateValue && updateValue.length > 0 ? updateValue : null;
            break;

          default:
            changedContainer[key] = updateValue;
        }
      });
      containers.push({ input: changedContainer, id });
    });
  }

  return {
    orders,
    batches,
    shipments,
    warehouses: [],
    products,
    containers,
  };
};

export const getFieldValueByType = (type: string) => (value: any) => {
  switch (type) {
    case 'date':
    case 'timeline':
      return value ? formatToDateLabel(value) : '';
    case 'number':
    default:
      return `${value}` || '';
  }
};

export function getFieldValues(fields: Array<Object>, values: Array<Object>, editData: Object) {
  const fieldValues: Array<string> = (fields: Array<Object>).map(
    ({ name, type, getExportValue }): any => {
      const getValueFunction =
        typeof getExportValue === 'function'
          ? partialRight(getExportValue, [editData])
          : getByPathWithDefault('', name);
      const value = compose(
        getFieldValueByType(type),
        getValueFunction
      )(values);
      return value;
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

export function getExportColumns(
  intl: IntlShape,
  {
    orderColumnFieldsFilter,
    orderItemColumnFieldsFilter,
    batchColumnFieldsFilter,
    shipmentColumnFieldsFilter,
    orderCustomFieldsFilter,
    orderItemCustomFieldsFilter,
    containerColumnFieldsFilter,
    batchCustomFieldsFilter,
    shipmentCustomFieldsFilter,
    productColumnFieldsFilter,
    productCustomFieldsFilter,
  }: Object
): Array<string> {
  const allColumns = [
    ...orderColumnFieldsFilter,
    ...orderCustomFieldsFilter,
    ...orderItemColumnFieldsFilter,
    ...orderItemCustomFieldsFilter,
    ...batchColumnFieldsFilter,
    ...batchCustomFieldsFilter,
    ...containerColumnFieldsFilter,
    ...shipmentColumnFieldsFilter,
    ...shipmentCustomFieldsFilter,
    ...productColumnFieldsFilter,
    ...productCustomFieldsFilter,
  ].map(column => (column.messageId ? intl.formatMessage({ id: column.messageId }) : column.name));
  return allColumns;
}

export function getExportRows(info: Object): Array<Array<?string>> {
  const {
    data: { editData, mappingObjects },
    ids: { orderIds, orderItemIds, batchIds },
    targetIds,
    columns: {
      orderColumnFieldsFilter,
      orderItemColumnFieldsFilter,
      batchColumnFieldsFilter,
      containerColumnFieldsFilter,
      shipmentColumnFieldsFilter,
      orderCustomFieldsFilter,
      orderItemCustomFieldsFilter,
      batchCustomFieldsFilter,
      shipmentCustomFieldsFilter,
      productColumnFieldsFilter,
      productCustomFieldsFilter,
    },
  } = info;
  const rows = [];
  // Shipment which has no relation
  (Object.entries(mappingObjects.shipmentNoRelation): Array<any>).forEach(([shipmentId]) => {
    const emptyRow = getEmptyValues([
      ...orderColumnFieldsFilter,
      ...orderCustomFieldsFilter,
      ...orderItemColumnFieldsFilter,
      ...orderItemCustomFieldsFilter,
      ...batchColumnFieldsFilter,
      ...batchCustomFieldsFilter,
      ...containerColumnFieldsFilter,
    ]);
    const shipmentData = editData.shipments[shipmentId];
    const shipmentValues = getFieldValues(shipmentColumnFieldsFilter, shipmentData, editData);
    const shipmentCustomValues = getCustomFieldValues(shipmentCustomFieldsFilter, shipmentData);
    const shipmentRow = [...shipmentValues, ...shipmentCustomValues];
    const emptyRowOfProduct = getEmptyValues([
      ...productColumnFieldsFilter,
      ...productCustomFieldsFilter,
    ]);
    const currentRow = [...emptyRow, ...shipmentRow, ...emptyRowOfProduct];

    rows.push(currentRow);
  });
  // render the empty container row
  (Object.entries(mappingObjects.shipment || {}): any)
    .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
    .forEach(([shipmentId]) => {
      mappingObjects.shipment[shipmentId].data.containers
        .filter(item => item.batches.length === 0)
        .forEach(container => {
          const emptyRow = getEmptyValues([
            ...orderColumnFieldsFilter,
            ...orderCustomFieldsFilter,
            ...orderItemColumnFieldsFilter,
            ...orderItemCustomFieldsFilter,
            ...batchColumnFieldsFilter,
            ...batchCustomFieldsFilter,
          ]);
          const containerData = editData.containers[container.id];
          const containerValues = getFieldValues(
            containerColumnFieldsFilter,
            containerData,
            editData
          );
          const containerRow = [...containerValues];
          const shipmentData = editData.shipments[shipmentId];
          const shipmentValues = getFieldValues(shipmentColumnFieldsFilter, shipmentData, editData);
          const shipmentCustomValues = getCustomFieldValues(
            shipmentCustomFieldsFilter,
            shipmentData
          );
          const shipmentRow = [...shipmentValues, ...shipmentCustomValues];
          const emptyRowOfProduct = getEmptyValues([
            ...productColumnFieldsFilter,
            ...productCustomFieldsFilter,
          ]);
          const currentRow = [...emptyRow, ...containerRow, ...shipmentRow, ...emptyRowOfProduct];

          rows.push(currentRow);
        });
    });

  // render order rows
  orderIds.forEach(orderId => {
    const order = mappingObjects.order[orderId];
    if (!order) return null;
    const orderItems = (Object.values(mappingObjects.orderItem || {}): any).filter(
      item => order.relation.orderItem[item.data.id] && orderItemIds.includes(item.data.id)
    );
    const orderData = editData.orders[orderId];
    const orderValues = getFieldValues(orderColumnFieldsFilter, orderData, editData);
    const orderCustomValues = getCustomFieldValues(orderCustomFieldsFilter, orderData);
    const orderRow = [...orderValues, ...orderCustomValues];
    if (orderItems.length === 0) {
      const emptyRow = getEmptyValues([
        ...orderItemColumnFieldsFilter,
        ...orderItemCustomFieldsFilter,
        ...batchColumnFieldsFilter,
        ...batchCustomFieldsFilter,
        ...containerColumnFieldsFilter,
        ...shipmentColumnFieldsFilter,
        ...shipmentCustomFieldsFilter,
        ...productColumnFieldsFilter,
        ...productCustomFieldsFilter,
      ]);
      const currentRow = [...orderRow, ...emptyRow];
      return rows.push(currentRow);
    }
    return orderItems.forEach(orderItem => {
      const notHaveBatches = Object.keys(orderItem.relation.batch).length === 0;
      const orderItemData = editData.orderItems[orderItem.data.id];
      const orderItemValues = getFieldValues(orderItemColumnFieldsFilter, orderItemData, editData);
      const orderItemCustomValues = getCustomFieldValues(
        orderItemCustomFieldsFilter,
        orderItemData
      );
      const orderItemRow = [...orderItemValues, ...orderItemCustomValues];
      const productData = editData.products[`${orderItemData.productProvider.product}`];
      const productValues = getFieldValues(productColumnFieldsFilter, productData, editData);
      const productCustomValues = getCustomFieldValues(productCustomFieldsFilter, productData);
      const productRow = [...productValues, ...productCustomValues];

      if (notHaveBatches) {
        const emptyRow = getEmptyValues([
          ...batchColumnFieldsFilter,
          ...batchCustomFieldsFilter,
          ...containerColumnFieldsFilter,
          ...shipmentColumnFieldsFilter,
          ...shipmentCustomFieldsFilter,
        ]);
        const currentRow = [...orderRow, ...orderItemRow, ...emptyRow, ...productRow];
        return rows.push(currentRow);
      }
      return orderItem.data.batches
        .filter(batch => batchIds.includes(batch.id))
        .forEach(batch => {
          const batchData = editData.batches[batch.id];
          const batchValues = getFieldValues(batchColumnFieldsFilter, batchData, editData);
          const batchCustomValues = getCustomFieldValues(batchCustomFieldsFilter, batchData);
          const batchRow = [...batchValues, ...batchCustomValues];
          const containerRow = [];
          if (batch.container) {
            const containerData = editData.containers[batch.container];
            const containerValues = getFieldValues(
              containerColumnFieldsFilter,
              containerData,
              editData
            );
            containerRow.push(...containerValues);
          } else {
            containerRow.push(...getEmptyValues([...containerColumnFieldsFilter]));
          }

          const shipmentRow = [];
          if (!batch.shipment) {
            shipmentRow.push(
              ...getEmptyValues([...shipmentColumnFieldsFilter, ...shipmentCustomFieldsFilter])
            );
          } else {
            const shipmentData = editData.shipments[batch.shipment.id];
            const shipmentValues = getFieldValues(
              shipmentColumnFieldsFilter,
              shipmentData,
              editData
            );
            const shipmentCustomValues = getCustomFieldValues(
              shipmentCustomFieldsFilter,
              shipmentData
            );
            shipmentRow.push(...shipmentValues, ...shipmentCustomValues);
          }
          const currentRow = [
            ...orderRow,
            ...orderItemRow,
            ...batchRow,
            ...containerRow,
            ...shipmentRow,
            ...productRow,
          ];
          rows.push(currentRow);
        });
    });
  });
  return rows;
}

export const setPackageBatchData = (batch: Object) => {
  return {
    ...batch,
    packageGrossWeight: batch.packageGrossWeight || { value: 0, metric: 'kg' },
    packageVolume: batch.packageVolume || {
      metric: 'm³',
      value: 0,
    },
    packageSize: batch.packageSize || {
      width: {
        metric: 'cm',
        value: 0,
      },
      height: {
        metric: 'cm',
        value: 0,
      },
      length: {
        metric: 'cm',
        value: 0,
      },
    },
  };
};
