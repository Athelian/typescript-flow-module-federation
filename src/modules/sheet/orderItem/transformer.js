// @flow
import { getBatchLatestQuantity } from 'utils/batch';
import type { FieldDefinition } from 'types';
import type { CellAction, CellValue } from 'components/Sheet/SheetState/types';
import {
  transformActionField,
  transformComputedField,
  transformCustomField,
  transformField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
import {
  ORDER_ITEMS_SET_CUSTOM_FIELDS,
  ORDER_ITEMS_SET_CUSTOM_FIELDS_MASK,
  ORDER_ITEMS_SET_DELIVERY_DATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_SET_MEMO,
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_TAGS,
  ORDER_ITEMS_SET_TASKS,
  ORDER_ITEMS_UPDATE,
} from 'modules/permission/constants/orderItem';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  orderItem: ?Object,
  getOrderFromRoot: Object => ?Object,
  getOrderItemFromRoot: Object => ?Object,
  actions: Array<CellAction>,
|};

export default function transformSheetOrderItem({
  fieldDefinitions,
  basePath,
  orderItem,
  getOrderFromRoot,
  getOrderItemFromRoot,
  actions,
}: Props): Array<CellValue> {
  return [
    {
      columnKey: 'orderItem.created',
      type: 'date_user',
      ...transformComputedField(basePath, orderItem, 'created', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        return currentOrderItem
          ? {
              at: new Date(currentOrderItem.createdAt),
              by: currentOrderItem.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'orderItem.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'createdBy', orderItem?.createdBy ?? null),
    },
    {
      columnKey: 'orderItem.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'createdAt', orderItem?.createdAt ?? null),
    },
    {
      columnKey: 'orderItem.updated',
      type: 'date_user',
      ...transformComputedField(basePath, orderItem, 'updated', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        return currentOrderItem
          ? {
              at: new Date(currentOrderItem.updatedAt),
              by: currentOrderItem.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'orderItem.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'updatedBy', orderItem?.updatedBy ?? null),
    },
    {
      columnKey: 'orderItem.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'updatedAt', orderItem?.updatedAt ?? null),
    },
    {
      columnKey: 'orderItem.archived',
      type: 'status',
      ...transformComputedField(
        basePath,
        orderItem,
        'archived',
        root => getOrderFromRoot(root)?.archived ?? false
      ),
    },
    {
      columnKey: 'orderItem.no',
      type: 'text',
      ...transformValueField(
        basePath,
        orderItem,
        'no',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_NO)
      ),
    },
    {
      columnKey: 'orderItem.quantity',
      type: 'number',
      ...transformValueField(
        basePath,
        orderItem,
        'quantity',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'orderItem.price',
      type: 'static_metric_value',
      ...transformValueField(
        basePath,
        orderItem,
        'price',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_PRICE)
      ),
    },
    {
      columnKey: 'orderItem.deliveryDate',
      type: 'date',
      ...transformValueField(
        basePath,
        orderItem,
        'deliveryDate',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'orderItem.tags',
      type: 'order_item_tags',
      ...transformValueField(
        basePath,
        orderItem,
        'tags',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TAGS)
      ),
    },
    {
      columnKey: 'orderItem.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        orderItem,
        'memo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_MEMO)
      ),
    },
    {
      columnKey: 'orderItem.remainQuantity',
      type: 'number',
      ...transformComputedField(basePath, orderItem, 'remainQuantity', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        return Math.max(
          0,
          (currentOrderItem?.quantity ?? 0) -
            // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
            (currentOrderItem?.batches.reduce(
              (total, batch) => total + getBatchLatestQuantity(batch),
              0
            ) ?? 0)
        );
      }),
    },
    {
      columnKey: 'orderItem.totalBatched',
      type: 'number',
      ...transformComputedField(basePath, orderItem, 'totalBatched', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        return (
          currentOrderItem?.batches.reduce(
            (total, batch) => total + getBatchLatestQuantity(batch),
            0
          ) ?? 0
        );
      }),
    },
    {
      columnKey: 'orderItem.remainingBatchedQuantity',
      type: 'number',
      ...transformComputedField(basePath, orderItem, 'remainingBatchedQuantity', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        const totalBatched =
          currentOrderItem?.batches.reduce(
            (total, batch) => total + getBatchLatestQuantity(batch),
            0
          ) ?? 0;
        return (currentOrderItem?.quantity ?? 0) - totalBatched;
      }),
    },
    {
      columnKey: 'orderItem.totalShipped',
      type: 'number',
      ...transformComputedField(basePath, orderItem, 'totalShipped', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        return (
          currentOrderItem?.batches
            .filter(batch => !!batch.shipment)
            .reduce((total, batch) => total + getBatchLatestQuantity(batch), 0) ?? 0
        );
      }),
    },
    {
      columnKey: 'orderItem.remainingShippedQuantity',
      type: 'number',
      ...transformComputedField(basePath, orderItem, 'remainingShippedQuantity', root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        const totalShipped =
          currentOrderItem?.batches
            .filter(batch => !!batch.shipment)
            .reduce((total, batch) => total + getBatchLatestQuantity(batch), 0) ?? 0;
        return (currentOrderItem?.quantity ?? 0) - totalShipped;
      }),
    },
    {
      columnKey: 'orderItem.totalPrice',
      type: 'metric_value',
      ...transformComputedField(basePath, orderItem, 'totalPrice', root => {
        const currentOrder = getOrderFromRoot(root);
        const currentOrderItem = getOrderItemFromRoot(root);

        return {
          value: (currentOrderItem?.price?.value ?? 0) * (currentOrderItem?.quantity ?? 0),
          metric: currentOrder?.currency,
        };
      }),
    },
    {
      columnKey: 'orderItem.files',
      type: 'order_item_documents',
      ...transformValueField(
        basePath,
        orderItem,
        'files',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'orderItem.todo',
      type: 'order_item_tasks',
      computed: root => {
        const currentOrder = getOrderFromRoot(root);

        return {
          entityId: orderItem?.id,
          ownerId: orderItem?.ownedBy?.id,
          groupIds: [currentOrder?.importer?.id, currentOrder?.exporter?.id].filter(Boolean),
        };
      },
      ...transformValueField(
        basePath,
        orderItem,
        'todo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TASKS)
      ),
    },
    {
      columnKey: 'orderItem.logs',
      type: 'order_item_logs',
      ...transformValueField(basePath, orderItem, 'id', () => true),
    },
    {
      columnKey: 'orderItem.mask',
      type: 'mask',
      extra: { entityType: 'OrderItem' },
      ...transformField(
        orderItem,
        `${basePath}.customFields.mask`,
        'mask',
        orderItem?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `orderItem.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: root => {
        const currentOrderItem = getOrderItemFromRoot(root);
        const mask = currentOrderItem?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        orderItem,
        fieldDefinition.id,
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_CUSTOM_FIELDS)
      ),
    })),
    {
      columnKey: 'orderItem.action',
      ...transformActionField(basePath, orderItem, actions),
    },
  ];
}
