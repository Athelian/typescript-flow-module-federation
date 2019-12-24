// @flow
import { IntlShape } from 'react-intl';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetOrderItem from 'modules/sheet/orderItem/transformer';
import transformSheetBatch from 'modules/sheet/batch/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
import transformSheetContainer from 'modules/sheet/container/transformer';
import transformSheetProduct from 'modules/sheet/product/transformer';
import batchMessages from 'modules/sheet/batch/actions/messages';

function getCurrentBatch(batchId: string, shipment: Object): ?Object {
  return [...shipment.batchesWithoutContainer, ...shipment.containers.flatMap(c => c.batches)].find(
    b => b.id === batchId
  );
}

function getCurrentOrder(orderId: string, shipment: Object): ?Object {
  return [...shipment.batchesWithoutContainer, ...shipment.containers.flatMap(c => c.batches)]
    .map(b => b.orderItem.order)
    .find(o => o.id === orderId);
}

function getCurrentProduct(productId: string, shipment: Object): ?Object {
  return [...shipment.batchesWithoutContainer, ...shipment.containers.flatMap(c => c.batches)]
    .map(b => b.orderItem.productProvider.product)
    .find(o => o.id === productId);
}

function transformShipment(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  shipment: Object
): Array<CellValue> {
  return transformSheetShipment({
    fieldDefinitions,
    basePath,
    shipment,
    getShipmentFromRoot: root => root,
    readonlyExporter: false,
  }).map(c => ({
    ...c,
    empty: !shipment,
    parent: true,
  }));
}

function transformContainer(
  basePath: string,
  container: ?Object,
  hasContainers: boolean
): Array<CellValue> {
  return transformSheetContainer({
    basePath,
    container,
    getContainerFromRoot: root => root.containers.find(c => c.id === container?.id),
    getShipmentFromRoot: root => root,
  }).map(c => ({
    ...c,
    disabled: !hasContainers && !container,
    empty: hasContainers && !container,
    parent: true,
  }));
}

function transformBatch(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object,
  intl: IntlShape
): Array<CellValue> {
  return transformSheetBatch({
    fieldDefinitions,
    basePath,
    batch,
    getOrderFromRoot: root => getCurrentBatch(batch?.id, root)?.order,
    getShipmentFromRoot: root => root,
    getContainerFromRoot: root =>
      root.containers.find(c => (c?.batches ?? []).some(b => b.id === batch.id)),
    getBatchFromRoot: root => getCurrentBatch(batch?.id, root),
    actions: [
      {
        action: 'batch_move_order',
        label: intl.formatMessage(batchMessages.batchMoveToExistingOrderTitle),
      },
      {
        action: 'batch_move_new_order',
        label: intl.formatMessage(batchMessages.batchMoveToNewOrderTitle),
      },
      {
        action: 'batch_move_container',
        label: intl.formatMessage(batchMessages.batchMoveToExistingContainerTitle),
      },
      {
        action: 'batch_move_new_container',
        label: intl.formatMessage(batchMessages.batchMoveToNewContainerTitle),
      },
      {
        action: 'batch_move_shipment',
        label: intl.formatMessage(batchMessages.batchMoveToShipmentTitle),
      },
      {
        action: 'batch_move_new_shipment',
        label: intl.formatMessage(batchMessages.batchMoveToNewShipmentTitle),
      },
    ],
  }).map(c => ({
    ...c,
    disabled: !batch,
  }));
}

function transformBatchOrderItem(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetOrderItem({
    fieldDefinitions,
    basePath: `${basePath}.orderItem`,
    orderItem: batch?.orderItem ?? null,
    getOrderFromRoot: root => getCurrentBatch(batch?.id, root)?.orderItem?.order,
    getOrderItemFromRoot: root => getCurrentBatch(batch?.id, root)?.orderItem,
    actions: [],
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.orderItem ?? null),
  }));
}

function transformBatchOrderItemOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath: `${basePath}.orderItem.order`,
    order: batch?.orderItem?.order ?? null,
    getOrderFromRoot: root => getCurrentOrder(batch?.orderItem?.order?.id, root),
    readonlyExporter: true,
    actions: [],
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.orderItem?.order ?? null),
  }));
}

function transformBatchOrderItemProductProviderProduct(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetProduct({
    fieldDefinitions,
    basePath: `${basePath}.orderItem.productProvider.product`,
    product: batch?.orderItem?.productProvider?.product ?? null,
    getProductFromRoot: root =>
      getCurrentProduct(batch?.orderItem?.productProvider?.product?.id, root),
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.orderItem?.productProvider?.product ?? null),
  }));
}

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  intl: IntlShape,
};

export default function transformer({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
  productFieldDefinitions,
  intl,
}: Props) {
  return (index: number, shipment: Object): Array<Array<CellValue>> => {
    const rows = [];

    let shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, shipment);

    (shipment?.batchesWithoutContainer ?? []).forEach((batch, batchIdx) => {
      rows.push([
        ...shipmentCells,
        ...transformContainer(`${index}.containers.-1`, null, false),
        ...transformBatch(
          batchFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch,
          intl
        ),
        ...transformBatchOrderItem(
          orderItemFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch
        ),
        ...transformBatchOrderItemOrder(
          orderFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch
        ),
        ...transformBatchOrderItemProductProviderProduct(
          productFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch
        ),
      ]);

      shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, null);
    });

    if ((shipment?.containers?.length ?? 0) > 0) {
      (shipment?.containers ?? []).forEach((container, containerIdx) => {
        let containerCells = transformContainer(
          `${index}.containers.${containerIdx}`,
          container,
          true
        );

        if ((container?.batches?.length ?? 0) > 0) {
          (container?.batches ?? []).forEach((batch, batchIdx) => {
            rows.push([
              ...shipmentCells,
              ...containerCells,
              ...transformBatch(
                batchFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch,
                intl
              ),
              ...transformBatchOrderItem(
                orderItemFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch
              ),
              ...transformBatchOrderItemOrder(
                orderFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch
              ),
              ...transformBatchOrderItemProductProviderProduct(
                productFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch
              ),
            ]);

            containerCells = transformContainer(`${index}.containers.${containerIdx}`, null, true);
            shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, null);
          });
        } else {
          rows.push([
            ...shipmentCells,
            ...containerCells,
            ...transformBatch(
              batchFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null,
              intl
            ),
            ...transformBatchOrderItem(
              orderItemFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null
            ),
            ...transformBatchOrderItemOrder(
              orderFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null
            ),
            ...transformBatchOrderItemProductProviderProduct(
              productFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null
            ),
          ]);

          shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, null);
        }
      });
    } else if ((shipment?.batchesWithoutContainer?.length ?? 0) === 0) {
      rows.push([
        ...shipmentCells,
        ...transformContainer(`${index}.containers.-1`, null, false),
        ...transformBatch(batchFieldDefinitions, `${index}.containers.-1.batches.-1`, null, intl),
        ...transformBatchOrderItem(
          orderItemFieldDefinitions,
          `${index}.containers.-1.batches.-1`,
          null
        ),
        ...transformBatchOrderItemOrder(
          orderFieldDefinitions,
          `${index}.containers.-1.batches.-1`,
          null
        ),
        ...transformBatchOrderItemProductProviderProduct(
          productFieldDefinitions,
          `${index}.containers.-1.batches.-1`,
          null
        ),
      ]);
    }

    return rows;
  };
}
