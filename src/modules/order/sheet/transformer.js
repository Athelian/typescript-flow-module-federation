// @flow
import { IntlShape } from 'react-intl';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetProduct from 'modules/sheet/product/transformer';
import transformSheetProductProvider from 'modules/sheet/productProvider/transformer';
import transformSheetOrderItem from 'modules/sheet/orderItem/transformer';
import transformSheetBatch from 'modules/sheet/batch/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
import transformSheetContainer from 'modules/sheet/container/transformer';
import orderActionMessages from 'modules/sheet/order/actions/messages';
import orderItemActionMessages from 'modules/sheet/orderItem/actions/messages';
import batchMessages from 'modules/sheet/batch/actions/messages';

function getCurrentBatch(batchId: string, order: Object): ?Object {
  return order.orderItems.flatMap(oi => oi.batches).find(oi => oi.id === batchId);
}

function getCurrentProduct(productId: string, order: Object): ?Object {
  return order.orderItems.map(oi => oi.productProvider.product).find(p => p.id === productId);
}

function transformOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  order: Object,
  intl: IntlShape
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath,
    order,
    getOrderFromRoot: root => root,
    readonlyExporter: false,
    actions: [
      {
        action: 'order_export',
        label: intl.formatMessage(orderActionMessages.orderExportTitle),
      },
      {
        action: 'order_sync_all_prices',
        label: intl.formatMessage(orderActionMessages.syncAllPricesTitle),
      },
      {
        action: 'order_autofill',
        label: intl.formatMessage(orderActionMessages.batchesAutofillTitle),
      },
      {
        action: 'order_item_create',
        label: intl.formatMessage(orderActionMessages.orderItemCreateTitle),
      },
    ],
  }).map(c => ({
    ...c,
    empty: !order,
    parent: true,
  }));
}

function transformProduct(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  product: Object,
  hasItems: boolean
): Array<CellValue> {
  return transformSheetProduct({
    fieldDefinitions,
    basePath,
    product,
    getProductFromRoot: root => getCurrentProduct(product?.id, root),
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !hasItems && !product,
    empty: hasItems && !product,
    parent: true,
  }));
}

function transformProductProvider(
  basePath: string,
  productProvider: Object,
  hasItems: boolean
): Array<CellValue> {
  return transformSheetProductProvider({
    basePath,
    productProvider,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !hasItems && !productProvider,
    empty: hasItems && !productProvider,
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
      actions: [
        {
          action: 'order_item_clone',
          label: intl.formatMessage(orderItemActionMessages.orderItemCloneTitle),
        },
        {
          action: 'order_item_sync_price',
          label: intl.formatMessage(orderItemActionMessages.orderItemSyncPriceTitle),
        },
        {
          action: 'order_item_autofill',
          label: intl.formatMessage(orderItemActionMessages.orderItemAutofillTitle),
        },
        {
          action: 'order_item_delete',
          label: intl.formatMessage(orderItemActionMessages.orderItemDeleteTitle),
        },
        {
          action: 'order_item_batch_create',
          label: intl.formatMessage(orderItemActionMessages.batchCreateTitle),
        },
      ],
    }),
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
  batch: Object,
  intl: IntlShape
): Array<CellValue> {
  return transformSheetBatch({
    fieldDefinitions,
    basePath,
    batch,
    getOrderFromRoot: root => root,
    getShipmentFromRoot: root => getCurrentBatch(batch?.id, root)?.shipment,
    getContainerFromRoot: root => getCurrentBatch(batch?.id, root)?.container,
    getBatchFromRoot: root => getCurrentBatch(batch?.id, root),
    actions: [
      {
        action: 'batch_clone',
        label: intl.formatMessage(batchMessages.batchCloneTitle),
      },
      {
        action: 'batch_sync_packaging',
        label: intl.formatMessage(batchMessages.batchSyncPackagingTitle),
      },
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
      {
        action: 'batch_split',
        label: intl.formatMessage(batchMessages.batchSplitTitle),
      },
      {
        action: 'batch_delete_remove',
        label: intl.formatMessage(batchMessages.batchRemoveDeleteTitle),
      },
    ],
  }).map(c => ({
    ...c,
    disabled: !batch,
  }));
}

function transformBatchContainer(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetContainer({
    basePath,
    container: batch?.container ?? null,
    getContainerFromRoot: root => getCurrentBatch(batch?.id, root)?.container,
    getShipmentFromRoot: root => getCurrentBatch(batch?.id, root)?.shipment,
    fieldDefinitions,
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
    getShipmentFromRoot: root => getCurrentBatch(batch?.id, root)?.shipment,
    isShipmentSheet: false,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

function transformFullBatch(
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  containerFieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object,
  intl: IntlShape
): Array<CellValue> {
  return [
    ...transformBatch(batchFieldDefinitions, basePath, batch, intl),
    ...transformBatchContainer(containerFieldDefinitions, `${basePath}.container`, batch),
    ...transformBatchShipment(shipmentFieldDefinitions, `${basePath}.shipment`, batch),
  ];
}

type Props = {|
  orderFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  containerFieldDefinitions: Array<FieldDefinition>,
  intl: IntlShape,
|};

export default function transformer({
  orderFieldDefinitions,
  productFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
  containerFieldDefinitions,
  intl,
}: Props) {
  return (index: number, order: Object): Array<Array<CellValue>> => {
    const rows = [];

    let orderCells = transformOrder(orderFieldDefinitions, `${index}`, order, intl);

    if ((order?.orderItems?.length ?? 0) > 0) {
      (order?.orderItems ?? []).forEach((orderItem, orderItemIdx) => {
        let orderItemCells = transformOrderItem(
          orderItemFieldDefinitions,
          `${index}.orderItems.${orderItemIdx}`,
          orderItem,
          true,
          intl
        );
        let productCells = transformProduct(
          productFieldDefinitions,
          `${index}.orderItems.${orderItemIdx}.productProvider.product`,
          orderItem?.productProvider?.product,
          true
        );
        let productProviderCells = transformProductProvider(
          `${index}.orderItems.${orderItemIdx}.productProvider`,
          orderItem?.productProvider,
          true
        );

        if ((orderItem?.batches?.length ?? 0) > 0) {
          (orderItem?.batches ?? []).forEach((batch, batchIdx) => {
            rows.push([
              ...orderCells,
              ...productCells,
              ...productProviderCells,
              ...orderItemCells,
              ...transformFullBatch(
                batchFieldDefinitions,
                shipmentFieldDefinitions,
                containerFieldDefinitions,
                `${index}.orderItems.${orderItemIdx}.batches.${batchIdx}`,
                batch,
                intl
              ),
            ]);
            orderCells = transformOrder(orderFieldDefinitions, `${index}`, null, intl);
            orderItemCells = transformOrderItem(
              orderItemFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}`,
              null,
              true,
              intl
            );
            productCells = transformProduct(
              productFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}.productProvider.product`,
              null,
              true
            );
            productProviderCells = transformProductProvider(
              `${index}.orderItems.${orderItemIdx}.productProvider`,
              null,
              true
            );
          });
        } else {
          rows.push([
            ...orderCells,
            ...transformProduct(
              productFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}.productProvider.product`,
              orderItem?.productProvider?.product,
              true
            ),
            ...transformProductProvider(
              `${index}.orderItems.${orderItemIdx}.productProvider`,
              orderItem?.productProvider,
              true
            ),
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
              containerFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}.batches.0`,
              null,
              intl
            ),
          ]);
          orderCells = transformOrder(orderFieldDefinitions, `${index}`, null, intl);
        }
      });
    } else {
      rows.push([
        ...orderCells,
        ...transformProduct(
          productFieldDefinitions,
          `${index}.orderItems.0.productProvider.product`,
          null,
          false
        ),
        ...transformProductProvider(`${index}.orderItems.0.productProvider`, null, false),
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
          containerFieldDefinitions,
          `${index}.orderItems.0.batches.0`,
          null,
          intl
        ),
      ]);
    }

    return rows;
  };
}
