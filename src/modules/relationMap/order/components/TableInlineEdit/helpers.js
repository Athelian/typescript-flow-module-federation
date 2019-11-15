// @flow
import type { IntlShape } from 'react-intl';
import { flatten, intersection } from 'lodash';
// $FlowFixMe missing define for partialRight
import { partialRight } from 'ramda';
import { removeTypename } from 'utils/data';
import { getByPathWithDefault, compose } from 'utils/fp';
import { formatToDateLabel } from 'utils/date';
import logger from 'utils/logger';
import { prepareCustomFieldsData, list2Map } from 'utils/customFields';

const isExpandRow = (field: Object) =>
  getByPathWithDefault('', 'type', field) === 'metric' ||
  getByPathWithDefault(false, 'meta.expandRow', field);

const formatTimeline = (timeline: Object) => {
  if (!timeline) return null;

  const { assignedTo, memo, approvedBy, date, timelineDateRevisions } = timeline;

  return {
    memo,
    date: date ? new Date(date) : null,
    /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
     * v0.111.0. To view the error, delete this comment and run Flow. */
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
          case 'deliveryDate': {
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
          case 'tags':
            changedOrderItem.tagIds = updateValue.map(({ id: tagId }) => tagId);
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
          orders.splice(
            orders.findIndex(currentOrder => currentOrder.id === orderId),
            1,
            {
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
            }
          );
        } else {
          orders.splice(
            orders.findIndex(currentOrder => currentOrder.id === orderId),
            1,
            {
              input: {
                ...existUpdateOrder.input,
                orderItems: [
                  ...(order.orderItems || [])
                    .filter(orderItemId => orderItemId !== id)
                    .map(orderItemId => ({ id: orderItemId })),
                  {
                    ...changedOrderItem,
                    id,
                  },
                ],
              },
              id: orderId,
            }
          );
        }
      } else {
        orders.push({
          input: {
            orderItems: [
              ...(order.orderItems || [])
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

const getFieldValueByType = (type: string) => (value: any) => {
  switch (type) {
    case 'date':
    case 'timeline':
      return value ? formatToDateLabel(value) : '';
    case 'number':
    default:
      return `${value}` || '';
  }
};

function getFieldValues(fields: Array<Object>, values: Array<Object>, editData: Object) {
  const fieldValues: Array<string | Array<string>> = (fields: Array<Object>).map(field => {
    const { name, type, getExportValue } = field;
    // return a function
    const getValueFunction =
      typeof getExportValue === 'function'
        ? partialRight(getExportValue, [editData])
        : getByPathWithDefault('', name);
    const value = compose(getFieldValueByType(type), getValueFunction)(values);
    if (isExpandRow(field)) {
      return value.split(',');
    }
    return value;
  });
  return flatten(fieldValues);
}

export function getEmptyValues(fields: Array<Object>) {
  const expandRows = fields.filter(isExpandRow);
  return ([...fields, ...expandRows].map(() => ''): Array<string>);
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

const parseQuantityFromValue = (value: string) => {
  const [, quantity] = value.split('-') || [];
  return quantity || '';
};

const parseTypeFromValue = (value: string) => {
  const [type] = value.split('-') || [];
  return type || '';
};

const expandQuantityColumn = (batchColumnFieldsFilter: Array<Object>) => {
  const columns = batchColumnFieldsFilter.map(batchField =>
    batchField.messageId.includes('newQuantity')
      ? [
          {
            ...batchField,
            getExportValue: compose(parseTypeFromValue, batchField.getExportValue),
            messageId: `${batchField.messageId}.type`,
          },
          {
            ...batchField,
            getExportValue: compose(parseQuantityFromValue, batchField.getExportValue),
            messageId: `${batchField.messageId}.quantity`,
          },
        ]
      : batchField
  );
  return flatten(columns);
};

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
    ...expandQuantityColumn(batchColumnFieldsFilter),
    ...batchCustomFieldsFilter,
    ...containerColumnFieldsFilter,
    ...shipmentColumnFieldsFilter,
    ...shipmentCustomFieldsFilter,
    ...productColumnFieldsFilter,
    ...productCustomFieldsFilter,
  ].map(column => {
    if (isExpandRow(column)) {
      return [
        column.messageId ? intl.formatMessage({ id: column.messageId }) : column.name,
        column.type === 'metric' || (column.meta && column.meta.type === 'metric')
          ? intl.formatMessage({ id: 'modules.RelationMaps.filter.metric' })
          : intl.formatMessage({ id: 'modules.RelationMaps.filter.currency' }),
      ];
    }
    return column.messageId ? intl.formatMessage({ id: column.messageId }) : column.name;
  });
  return flatten(allColumns);
}

export function getExportRows(info: Object): Array<Array<?string>> {
  const {
    data: { editData, mappingObjects },
    ids: { orderIds, orderItemIds, batchIds },
    columns: {
      orderColumnFieldsFilter,
      orderItemColumnFieldsFilter,
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
  const batchColumnFieldsFilter = expandQuantityColumn(info.columns.batchColumnFieldsFilter);
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
