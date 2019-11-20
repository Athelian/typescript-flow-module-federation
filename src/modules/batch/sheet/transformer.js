// @flow
import type { Batch } from 'generated/graphql';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetOrderItem from 'modules/sheet/orderItem/transformer';
import transformSheetBatch from 'modules/sheet/batch/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
import transformSheetContainer from 'modules/sheet/container/transformer';

function transformBatch(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Batch
): Array<CellValue> {
  return transformSheetBatch({
    fieldDefinitions,
    basePath,
    batch,
    getOrderFromRoot: root => root.order,
    getShipmentFromRoot: root => root.shipment,
    getBatchFromRoot: root => root,
  });
}

function transformOrderItem(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  orderItem: Object
): Array<CellValue> {
  return transformSheetOrderItem({
    fieldDefinitions,
    basePath,
    orderItem,
    getOrderFromRoot: root => root.orderItem.order,
    getOrderItemFromRoot: root => root.orderItem,
  }).map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  order: ?Object
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath: `${basePath}.orderItem.order`,
    order,
    getOrderFromRoot: root => root?.orderItem?.order,
    readonlyExporter: true,
  }).map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformContainer(basePath: string, batch: Batch): Array<CellValue> {
  return transformSheetContainer({
    basePath: `${basePath}.container`,
    container: batch?.container ?? null,
    getContainerFromRoot: root => {
      return root.container;
    },
    getShipmentFromRoot: root => {
      return root.shipment;
    },
  }).map(cell => ({
    ...cell,
    disabled: !(batch?.container ?? null),
    duplicable: true,
  }));
}

function transformShipment(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Batch
): Array<CellValue> {
  return transformSheetShipment({
    fieldDefinitions,
    basePath: `${basePath}.shipment`,
    shipment: batch?.shipment ?? null,
    getShipmentFromRoot: root => root?.shipment ?? null,
    readonlyExporter: true,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
};

export default function transformer({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
}: Props) {
  return (index: number, batch: Batch): Array<Array<CellValue>> => {
    const batchCells = transformBatch(batchFieldDefinitions, `${index}`, batch);
    const orderItemCells = transformOrderItem(
      orderItemFieldDefinitions,
      `${index}`,
      batch?.orderItem
    );
    const orderCells = transformOrder(orderFieldDefinitions, `${index}`, batch.orderItem.order);
    const containerCells = transformContainer(`${index}`, batch);
    const shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, batch);

    return [[...batchCells, ...orderItemCells, ...orderCells, ...containerCells, ...shipmentCells]];
  };
}
