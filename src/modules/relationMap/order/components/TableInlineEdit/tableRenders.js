// @flow
import { range, flattenDeep, slice } from 'lodash';
import orderValidator from 'modules/order/form/validator';
import batchValidator from 'modules/batch/form/validator';
import shipmentValidator from 'modules/shipment/form/validator';
import productValidator from 'modules/product/form/validator';
import { totalLinePerOrder } from './helpers';

export function totalRow({
  mappingObjects,
  targetIds,
  orderItemIds,
  orderIds,
  batchIds,
}: {
  mappingObjects: Object,
  targetIds: Object,
  orderIds: Array<string>,
  orderItemIds: Array<string>,
  batchIds: Array<string>,
}) {
  let total = 0;
  orderIds.forEach(orderId => {
    const order = mappingObjects.order[orderId];
    if (!order) return;
    const orderItems = (Object.values(mappingObjects.orderItem || {}): any).filter(
      item => order.relation.orderItem[item.data.id] && orderItemIds.includes(item.data.id)
    );
    total += totalLinePerOrder(orderItems, batchIds);
  });
  return (
    total +
    Object.entries(mappingObjects.shipmentNoRelation || {}).length +
    Object.entries(mappingObjects.shipment || {})
      .filter(
        ([shipmentId]) =>
          targetIds.shipmentIds.includes(shipmentId) &&
          !mappingObjects.shipmentNoRelation[shipmentId]
      )
      .map(([shipmentId]) =>
        mappingObjects.shipment[shipmentId].data.containers.filter(
          item => item.batches.length === 0
        )
      ).length
  );
}

export function findColumns({
  fields,
  templateColumns,
  showAll,
}: {
  fields: Array<Object>,
  templateColumns: Array<string>,
  showAll: boolean,
}) {
  if (templateColumns.length) {
    return showAll
      ? fields
      : (fields.filter(item => templateColumns.includes(item.columnName)): Array<any>);
  }
  return fields;
}

export function findColumnsForCustomFields({
  showAll,
  fields: customFields,
  templateColumns,
}: {
  fields: Array<Object>,
  templateColumns: Array<string>,
  showAll: boolean,
}) {
  if (templateColumns && templateColumns.length > 0) {
    return showAll
      ? customFields
      : (customFields.filter(field =>
          templateColumns.includes(`customFields.${field.id}`)
        ): Array<any>);
  }
  return customFields;
}

export function generateEmptyShipmentsData({
  mappingObjects,
  columns,
  editData,
}: {
  mappingObjects: Object,
  columns: Object,
  editData: Object,
}) {
  return (flattenDeep(
    Object.entries(mappingObjects.shipmentNoRelation || {}).map(([shipmentId]) => ({
      type: 'shipment',
      id: shipmentId,
      values: [
        ...columns.orderColumnFieldsFilter.map(() => null),
        ...columns.orderCustomFieldsFilter.map(() => null),
        ...columns.orderItemColumnFieldsFilter.map(() => null),
        ...columns.orderItemCustomFieldsFilter.map(() => null),
        ...columns.batchColumnFieldsFilter.map(() => null),
        ...columns.batchCustomFieldsFilter.map(() => null),
        ...columns.containerColumnFieldsFilter.map(() => null),
        ...columns.shipmentColumnFieldsFilter.map(field => ({
          ...field,
          values: editData.shipments[shipmentId],
          cell: `shipments.${shipmentId}`,
          validator: shipmentValidator,
          editData,
        })),
        ...columns.shipmentCustomFieldsFilter.map(field => ({
          ...field,
          type: 'customFields',
          cell: `shipments.${shipmentId}`,
          values: editData.shipments[shipmentId],
          validator: shipmentValidator,
          editData,
        })),
        ...columns.productCustomFieldsFilter.map(() => null),
      ],
    }))
  ): Array<{
    type: string,
    id: string,
    values: Array<Object>,
  }>);
}

export function generateEmptyContainerShipmentsData({
  mappingObjects,
  columns,
  editData,
  targetIds,
}: {
  mappingObjects: Object,
  columns: Object,
  editData: Object,
  targetIds: Object,
}) {
  return (flattenDeep(
    Object.entries(mappingObjects.shipment || {})
      .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
      .map(([shipmentId]) =>
        mappingObjects.shipment[shipmentId].data.containers
          .filter(item => item.batches.length === 0)
          .map(container => ({
            type: 'shipment',
            id: shipmentId,
            container,
            values: [
              ...columns.orderColumnFieldsFilter.map(() => null),
              ...columns.orderCustomFieldsFilter.map(() => null),
              ...columns.orderItemColumnFieldsFilter.map(() => null),
              ...columns.orderItemCustomFieldsFilter.map(() => null),
              ...columns.batchColumnFieldsFilter.map(() => null),
              ...columns.batchCustomFieldsFilter.map(() => null),
              ...columns.containerColumnFieldsFilter.map(field => ({
                ...field,
                cell: `containers.${container.id}`,
                values: editData.containers[container.id],
                editData,
              })),
              ...columns.shipmentColumnFieldsFilter.map(field => ({
                ...field,
                cell: `shipments.${shipmentId}`,
                values: editData.shipments[shipmentId],
                validator: shipmentValidator,
                editData,
              })),
              ...columns.shipmentCustomFieldsFilter.map(field => ({
                ...field,
                type: 'customFields',
                cell: `shipments.${shipmentId}`,
                values: editData.shipments[shipmentId],
                validator: shipmentValidator,
                editData,
              })),
              ...columns.productCustomFieldsFilter.map(() => null),
            ],
          }))
      )
  ): Array<{
    type: string,
    id: string,
    container: Object,
    values: Array<Object>,
  }>);
}

function orderColumns({
  columns,
  editData,
  batchIds,
  orderItems,
  orderId,
  isCustomField,
}: {
  columns: Array<Object>,
  orderItems: Array<Object>,
  editData: Object,
  batchIds: Array<string>,
  orderId: string,
  isCustomField: boolean,
}) {
  return orderItems.length === 0
    ? columns.map(field => ({
        ...field,
        type: isCustomField ? 'customFields' : field.type,
        cell: `orders.${orderId}`,
        validator: orderValidator,
        values: editData.orders[orderId],
      }))
    : flattenDeep(
        orderItems.map(orderItem =>
          Object.keys(orderItem.relation.batch || {}).length === 0
            ? columns.map(field => ({
                ...field,
                type: isCustomField ? 'customFields' : field.type,
                cell: `orders.${orderId}`,
                values: editData.orders[orderId],
                validator: orderValidator,
                editData,
              }))
            : Object.keys(orderItem.relation.batch || {})
                .filter(batchId => batchIds.includes(batchId))
                .map(() =>
                  columns.map(field => ({
                    ...field,
                    type: isCustomField ? 'customFields' : field.type,
                    cell: `orders.${orderId}`,
                    values: editData.orders[orderId],
                    validator: orderValidator,
                    editData,
                  }))
                )
        )
      );
}

function orderItemColumns({
  columns,
  editData,
  batchIds,
  orderItems,
  isCustomField,
}: {
  columns: Array<Object>,
  orderItems: Array<Object>,
  editData: Object,
  batchIds: Array<string>,
  isCustomField: boolean,
}) {
  return flattenDeep(
    orderItems.length === 0
      ? columns.map(() => null)
      : orderItems.map(orderItem =>
          Object.keys(orderItem.relation.batch || {}).length === 0
            ? columns.map(field => ({
                ...field,
                type: isCustomField ? 'customFields' : field.type,
                cell: `orderItems.${orderItem.data.id}`,
                values: editData.orderItems[orderItem.data.id],
                editData,
              }))
            : Object.keys(orderItem.relation.batch || {})
                .filter(batchId => batchIds.includes(batchId))
                .map(() =>
                  columns.map(field => ({
                    ...field,
                    type: isCustomField ? 'customFields' : field.type,
                    cell: `orderItems.${orderItem.data.id}`,
                    values: editData.orderItems[orderItem.data.id],
                    editData,
                  }))
                )
        )
  );
}

function batchColumns({
  columns,
  editData,
  batchIds,
  orderItems,
  totalLines,
  batches,
  isCustomField,
}: {
  columns: Array<Object>,
  batches: Array<Object>,
  orderItems: Array<Object>,
  editData: Object,
  batchIds: Array<string>,
  totalLines: number,
  isCustomField: boolean,
}) {
  return flattenDeep(
    batchIds.length === 0
      ? range(totalLines).map(() => columns.map(() => null))
      : [
          ...orderItems.map(orderItem =>
            orderItem.data.batches
              .filter(batch => batchIds.includes(batch.id))
              .map(batch =>
                columns.map(field => ({
                  ...field,
                  type: isCustomField ? 'customFields' : field.type,
                  cell: `batches.${batch.id}`,
                  values: editData.batches[batch.id],
                  validator: batchValidator,
                  editData,
                }))
              )
          ),
          ...range(totalLines - batches.length).map(() => columns.map(() => null)),
        ]
  );
}

function containerColumns({
  columns,
  editData,
  batchIds,
  orderItems,
  totalLines,
  batches,
}: {
  columns: Array<Object>,
  batches: Array<Object>,
  orderItems: Array<Object>,
  editData: Object,
  batchIds: Array<string>,
  totalLines: number,
}) {
  return flattenDeep([
    ...orderItems.map(orderItem =>
      orderItem.data.batches
        .filter(batch => batchIds.includes(batch.id))
        .map(batch => {
          const containerId = batch.container;
          if (!containerId) return columns.map(() => null);
          return columns.map(field => ({
            ...field,
            cell: `containers.${containerId}`,
            values: editData.containers[containerId],
            editData,
          }));
        })
    ),
    ...range(totalLines - batches.length).map(() => columns.map(() => null)),
  ]);
}

function shipmentColumns({
  columns,
  editData,
  mappingObjects,
  batchIds,
  orderItems,
  totalLines,
  batches,
  isCustomField,
}: {
  columns: Array<Object>,
  batches: Array<Object>,
  orderItems: Array<Object>,
  editData: Object,
  mappingObjects: Object,
  batchIds: Array<string>,
  totalLines: number,
  isCustomField: boolean,
}) {
  return flattenDeep([
    ...orderItems.map(orderItem =>
      orderItem.data.batches
        .filter(batch => batchIds.includes(batch.id))
        .map(batch => {
          const shipmentId = batch.shipment && batch.shipment.id;
          const shipment = mappingObjects.shipment[shipmentId];
          if (!shipmentId || !shipment) return columns.map(() => null);
          return columns.map(field => ({
            ...field,
            type: isCustomField ? 'customFields' : field.type,
            cell: `shipments.${shipmentId || shipment.data.id}`,
            values: editData.shipments[shipmentId || shipment.data.id],
            validator: shipmentValidator,
            editData,
          }));
        })
    ),
    ...range(totalLines - batches.length).map(() => columns.map(() => null)),
  ]);
}

function productColumns({
  columns,
  editData,
  batchIds,
  productIds,
  orderItems,
  isCustomField,
}: {
  columns: Array<Object>,
  orderItems: Array<Object>,
  editData: Object,
  batchIds: Array<string>,
  productIds: Array<string>,
  isCustomField: boolean,
}) {
  return flattenDeep(
    productIds.length === 0
      ? columns.map(() => null)
      : orderItems.map(orderItem =>
          Object.keys(orderItem.relation.batch || {}).length === 0
            ? columns.map(field => ({
                ...field,
                type: isCustomField ? 'customFields' : field.type,
                cell: `products.${orderItem.data.productProvider.product}`,
                values: editData.products[orderItem.data.productProvider.product],
                validator: productValidator,
                editData,
              }))
            : Object.keys(orderItem.relation.batch || {})
                .filter(batchId => batchIds.includes(batchId))
                .map(() =>
                  columns.map(field => ({
                    ...field,
                    type: isCustomField ? 'customFields' : field.type,
                    cell: `products.${orderItem.data.productProvider.product}`,
                    values: editData.products[orderItem.data.productProvider.product],
                    validator: productValidator,
                    editData,
                  }))
                )
        )
  );
}

function generateTableData({
  mappingObjects,
  columns,
  editData,
  totalLines,
  orderId,
  orderItems,
  batches,
  batchIds,
  productIds,
}: {
  mappingObjects: Object,
  columns: Object,
  totalLines: number,
  editData: Object,
  orderId: string,
  orderItems: Array<Object>,
  batches: Array<Object>,
  batchIds: Array<string>,
  productIds: Array<string>,
}) {
  const rows = [];
  const orderRows = orderColumns({
    columns: columns.orderColumnFieldsFilter,
    editData,
    orderId,
    batchIds,
    orderItems,
    isCustomField: false,
  });

  const customOrderRows = orderColumns({
    columns: columns.orderCustomFieldsFilter,
    editData,
    orderId,
    batchIds,
    orderItems,
    isCustomField: true,
  });

  const itemRows = orderItemColumns({
    columns: columns.orderItemColumnFieldsFilter,
    editData,
    batchIds,
    orderItems,
    isCustomField: false,
  });

  const customItemRows = orderItemColumns({
    columns: columns.orderItemCustomFieldsFilter,
    editData,
    batchIds,
    orderItems,
    isCustomField: true,
  });

  const batchRows = batchColumns({
    columns: columns.batchColumnFieldsFilter,
    editData,
    batchIds,
    orderItems,
    totalLines,
    batches,
    isCustomField: false,
  });

  const customBatchRows = batchColumns({
    columns: columns.batchCustomFieldsFilter,
    editData,
    batchIds,
    orderItems,
    totalLines,
    batches,
    isCustomField: true,
  });

  const containerRows = containerColumns({
    columns: columns.containerColumnFieldsFilter,
    editData,
    batchIds,
    orderItems,
    totalLines,
    batches,
  });

  const shipmentRows = shipmentColumns({
    columns: columns.shipmentColumnFieldsFilter,
    editData,
    mappingObjects,
    batchIds,
    orderItems,
    totalLines,
    batches,
    isCustomField: false,
  });

  const customShipmentRows = shipmentColumns({
    columns: columns.shipmentCustomFieldsFilter,
    editData,
    mappingObjects,
    batchIds,
    orderItems,
    totalLines,
    batches,
    isCustomField: true,
  });

  const productRows = productColumns({
    columns: columns.productColumnFieldsFilter,
    editData,
    orderId,
    batchIds,
    productIds,
    orderItems,
    isCustomField: false,
  });

  const customProductRows = productColumns({
    columns: columns.productCustomFieldsFilter,
    editData,
    orderId,
    batchIds,
    productIds,
    orderItems,
    isCustomField: true,
  });

  if (columns.orderColumnFieldsFilter.length) {
    for (
      let index = 0;
      index < orderRows.length / columns.orderColumnFieldsFilter.length;
      index += 1
    ) {
      const row = [];
      const orderRow = slice(
        orderRows,
        index * columns.orderColumnFieldsFilter.length,
        (index + 1) * columns.orderColumnFieldsFilter.length
      );
      row.push(orderRow);

      if (columns.orderCustomFieldsFilter.length) {
        const customOrderRow = slice(
          customOrderRows,
          index * columns.orderCustomFieldsFilter.length,
          (index + 1) * columns.orderCustomFieldsFilter.length
        );
        row.push(customOrderRow);
      }

      if (columns.orderItemColumnFieldsFilter.length) {
        const itemRow = slice(
          itemRows,
          index * columns.orderItemColumnFieldsFilter.length,
          (index + 1) * columns.orderItemColumnFieldsFilter.length
        );
        row.push(itemRow);
      }

      if (columns.orderItemCustomFieldsFilter.length) {
        const customItemRow = slice(
          customItemRows,
          index * columns.orderItemCustomFieldsFilter.length,
          (index + 1) * columns.orderItemCustomFieldsFilter.length
        );
        row.push(customItemRow);
      }

      if (columns.batchColumnFieldsFilter.length) {
        const batchRow = slice(
          batchRows,
          index * columns.batchColumnFieldsFilter.length,
          (index + 1) * columns.batchColumnFieldsFilter.length
        );
        row.push(batchRow);
      }

      if (columns.batchCustomFieldsFilter.length) {
        const customBatchRow = slice(
          customBatchRows,
          index * columns.batchCustomFieldsFilter.length,
          (index + 1) * columns.batchCustomFieldsFilter.length
        );
        row.push(customBatchRow);
      }

      if (columns.containerColumnFieldsFilter.length) {
        const containerRow = slice(
          containerRows,
          index * columns.containerColumnFieldsFilter.length,
          (index + 1) * columns.containerColumnFieldsFilter.length
        );
        row.push(containerRow);
      }

      if (columns.shipmentColumnFieldsFilter.length) {
        const shipmentRow = slice(
          shipmentRows,
          index * columns.shipmentColumnFieldsFilter.length,
          (index + 1) * columns.shipmentColumnFieldsFilter.length
        );
        row.push(shipmentRow);
      }

      if (columns.shipmentCustomFieldsFilter.length) {
        const customShipmentRow = slice(
          customShipmentRows,
          index * columns.shipmentCustomFieldsFilter.length,
          (index + 1) * columns.shipmentCustomFieldsFilter.length
        );
        row.push(customShipmentRow);
      }

      if (columns.productColumnFieldsFilter.length) {
        const productRow = slice(
          productRows,
          index * columns.productColumnFieldsFilter.length,
          (index + 1) * columns.productColumnFieldsFilter.length
        );
        row.push(productRow);
      }

      if (columns.productCustomFieldsFilter.length) {
        const customProductRow = slice(
          customProductRows,
          index * columns.productCustomFieldsFilter.length,
          (index + 1) * columns.productCustomFieldsFilter.length
        );
        row.push(customProductRow);
      }
      rows.push(flattenDeep(row));
    }
  }

  return rows;
}

export function generateOrdersData({
  mappingObjects,
  columns,
  editData,
  orderIds,
  orderItemIds,
  batchIds,
  productIds,
}: {
  mappingObjects: Object,
  columns: Object,
  editData: Object,
  orderIds: Array<string>,
  orderItemIds: Array<string>,
  batchIds: Array<string>,
  productIds: Array<string>,
}) {
  return (orderIds
    .filter(orderId => mappingObjects.order[orderId])
    .map(orderId => {
      const order = mappingObjects.order[orderId];
      const orderItems = (Object.values(mappingObjects.orderItem || {}): any).filter(
        item => order.relation.orderItem[item.data.id] && orderItemIds.includes(item.data.id)
      );
      const batches = (Object.values(mappingObjects.batch || {}): any).filter(
        item => order.relation.batch[item.data.id] && batchIds.includes(item.data.id)
      );
      const totalLines = totalLinePerOrder(orderItems, batchIds);
      return {
        type: 'order',
        id: orderId,
        order,
        values: generateTableData({
          mappingObjects,
          columns,
          editData,
          totalLines,
          orderId,
          orderItems,
          batches,
          batchIds,
          productIds,
        }),
      };
    }): Array<{
    type: string,
    id: string,
    order: Object,
    values: Array<Object>,
  }>);
}
