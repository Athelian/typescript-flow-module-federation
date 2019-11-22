// @flow
import { IntlShape } from 'react-intl';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import { transformActionField } from 'components/Sheet';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetOrderItem from 'modules/sheet/orderItem/transformer';
import transformSheetBatch from 'modules/sheet/batch/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
import transformSheetContainer from 'modules/sheet/container/transformer';
import itemMessages from 'modules/sheet/orderItem/actions/messages';

function getCurrentBatch(batchId: string, order: Object): ?Object {
  return order.orderItems.flatMap(oi => oi.batches).find(oi => oi.id === batchId);
}

function transformOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  order: Object
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath,
    order,
    getOrderFromRoot: root => root,
    readonlyExporter: false,
  }).map(c => ({
    ...c,
    empty: !order,
    parent: true,
  }));
}

function transformOrderItem(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  orderItem: Object,
  hasItems: boolean,
  intl: IntlShape
): Array<CellValue> {
  return [
    ...transformSheetOrderItem({
      fieldDefinitions,
      basePath,
      orderItem,
      getOrderFromRoot: root => root,
      getOrderItemFromRoot: root => root.orderItems.find(oi => oi.id === orderItem?.id),
    }),
    {
      columnKey: 'orderItem.action',
      ...transformActionField(basePath, orderItem, [
        {
          action: 'order_item_batch_create',
          label: intl.formatMessage(itemMessages.batchCreateTitle),
        },
        {
          action: 'order_item_clone',
          label: intl.formatMessage(itemMessages.orderItemCloneTitle),
        },
      ]),
    },
  ].map(c => ({
    ...c,
    disabled: !hasItems && !orderItem,
    empty: hasItems && !orderItem,
    parent: true,
  }));
}

function transformBatch(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetBatch({
    fieldDefinitions,
    basePath,
    batch,
    getOrderFromRoot: root => root,
    getShipmentFromRoot: root => getCurrentBatch(batch?.id, root)?.shipment,
    getBatchFromRoot: root => getCurrentBatch(batch?.id, root),
  }).map(c => ({
    ...c,
    disabled: !batch,
  }));
}

function transformBatchContainer(basePath: string, batch: Object): Array<CellValue> {
  return transformSheetContainer({
    basePath,
    container: batch?.container ?? null,
    getContainerFromRoot: root => {
      const currentBatch = getCurrentBatch(batch?.id, root);
      return currentBatch?.container;
    },
    getShipmentFromRoot: root => {
      const currentBatch = getCurrentBatch(batch?.id, root);
      return currentBatch?.shipment;
    },
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.container ?? null),
  }));
}

function transformBatchShipment(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetShipment({
    fieldDefinitions,
    basePath,
    shipment: batch?.shipment ?? null,
    getShipmentFromRoot: root => {
      const currentBatch = getCurrentBatch(batch?.id, root);
      return currentBatch?.shipment ?? null;
    },
    readonlyExporter: true,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

function transformFullBatch(
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return [
    ...transformBatch(batchFieldDefinitions, basePath, batch),
    ...transformBatchContainer(`${basePath}.container`, batch),
    ...transformBatchShipment(shipmentFieldDefinitions, `${basePath}.shipment`, batch),
  ];
}

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  intl: IntlShape,
};

export default function transformer({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
  intl,
}: Props) {
  return (index: number, order: Object): Array<Array<CellValue>> => {
    const rows = [];

    let orderCells = transformOrder(orderFieldDefinitions, `${index}`, order);

    if ((order?.orderItems?.length ?? 0) > 0) {
      (order?.orderItems ?? []).forEach((orderItem, orderItemIdx) => {
        let orderItemCells = transformOrderItem(
          orderItemFieldDefinitions,
          `${index}.orderItems.${orderItemIdx}`,
          orderItem,
          true,
          intl
        );

        if ((orderItem?.batches?.length ?? 0) > 0) {
          (orderItem?.batches ?? []).forEach((batch, batchIdx) => {
            rows.push([
              ...orderCells,
              ...orderItemCells,
              ...transformFullBatch(
                batchFieldDefinitions,
                shipmentFieldDefinitions,
                `${index}.orderItems.${orderItemIdx}.batches.${batchIdx}`,
                batch
              ),
            ]);
            orderCells = transformOrder(orderFieldDefinitions, `${index}`, null);
            orderItemCells = transformOrderItem(
              orderItemFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}`,
              null,
              true,
              intl
            );
          });
        } else {
          rows.push([
            ...orderCells,
            ...transformOrderItem(
              orderItemFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}`,
              orderItem,
              true,
              intl
            ),
            ...transformFullBatch(
              batchFieldDefinitions,
              shipmentFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}.batches.0`,
              null
            ),
          ]);
          orderCells = transformOrder(orderFieldDefinitions, `${index}`, null);
        }
      });
    } else {
      rows.push([
        ...orderCells,
        ...transformOrderItem(
          orderItemFieldDefinitions,
          `${index}.orderItems.0`,
          null,
          false,
          intl
        ),
        ...transformFullBatch(
          batchFieldDefinitions,
          shipmentFieldDefinitions,
          `${index}.orderItems.0.batches.0`,
          null
        ),
      ]);
    }

    return rows;
  };
}
