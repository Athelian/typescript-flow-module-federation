// @flow
import type { Batch } from 'generated/graphql';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetProduct from 'modules/sheet/product/transformer';
import transformSheetProductProvider from 'modules/sheet/productProvider/transformer';
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
    getOrderFromRoot: root => root?.orderItem?.order,
    getShipmentFromRoot: root => root?.shipment,
    getContainerFromRoot: root => root?.container,
    getBatchFromRoot: root => root,
    actions: [],
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
    getOrderFromRoot: root => root?.orderItem?.order,
    getOrderItemFromRoot: root => root?.orderItem,
    actions: [],
  }).map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformProduct(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  product: Object
): Array<CellValue> {
  return transformSheetProduct({
    fieldDefinitions,
    basePath: `${basePath}.orderItem.productProvider.product`,
    product,
    getProductFromRoot: root => root?.orderItem?.productProvider?.product,
  }).map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformProductProvider(basePath: string, productProvider: Object): Array<CellValue> {
  return transformSheetProductProvider({
    basePath: `${basePath}.orderItem.productProvider`,
    productProvider,
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
    actions: [],
  }).map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformContainer(basePath: string, batch: Batch): Array<CellValue> {
  return transformSheetContainer({
    basePath: `${basePath}.container`,
    container: batch?.container ?? null,
    getContainerFromRoot: root => root?.container,
    getShipmentFromRoot: root => root?.shipment,
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
    getShipmentFromRoot: root => root?.shipment,
    readonlyExporter: true,
    staticComputedFields: true,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

type Props = {|
  orderFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
|};

export default function transformer({
  orderFieldDefinitions,
  productFieldDefinitions,
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
    const productCells = transformProduct(
      productFieldDefinitions,
      `${index}`,
      batch?.orderItem?.productProvider?.product
    );
    const productProviderCells = transformProductProvider(
      `${index}`,
      batch?.orderItem?.productProvider
    );
    const orderCells = transformOrder(orderFieldDefinitions, `${index}`, batch?.orderItem?.order);
    const containerCells = transformContainer(`${index}`, batch);
    const shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, batch);

    return [
      [
        ...batchCells,
        ...orderItemCells,
        ...productCells,
        ...productProviderCells,
        ...orderCells,
        ...containerCells,
        ...shipmentCells,
      ],
    ];
  };
}
