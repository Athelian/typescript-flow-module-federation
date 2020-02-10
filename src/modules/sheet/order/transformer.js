// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
import orderMessages from 'modules/order/messages';
import {
  ORDER_SET_ARCHIVED,
  ORDER_SET_CURRENCY,
  ORDER_SET_CUSTOM_FIELDS,
  ORDER_SET_CUSTOM_FIELDS_MASK,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_SET_DOCUMENTS,
  ORDER_SET_EXPORTER,
  ORDER_SET_INCOTERM,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_MEMO,
  ORDER_SET_PI_NO,
  ORDER_SET_PO_NO,
  ORDER_SET_TAGS,
  ORDER_SET_TASKS,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  order: ?Object,
  getOrderFromRoot: Object => ?Object,
  readonlyExporter: boolean,
  actions: Array<CellAction>,
|};

export default function transformSheetOrder({
  fieldDefinitions,
  basePath,
  order,
  getOrderFromRoot,
  readonlyExporter,
  actions,
}: Props): Array<CellValue> {
  return [
    {
      columnKey: 'order.created',
      type: 'date_user',
      ...transformComputedField(basePath, order, 'created', root => {
        const currentOrder = getOrderFromRoot(root);
        return currentOrder
          ? {
              at: new Date(currentOrder.createdAt),
              by: currentOrder.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'createdBy', order?.createdBy ?? null),
    },
    {
      columnKey: 'order.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'createdAt', order?.createdAt ?? null),
    },
    {
      columnKey: 'order.updated',
      type: 'date_user',
      ...transformComputedField(basePath, order, 'updated', root => {
        const currentOrder = getOrderFromRoot(root);
        return currentOrder
          ? {
              at: new Date(currentOrder.updatedAt),
              by: currentOrder.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'updatedBy', order?.updatedBy ?? null),
    },
    {
      columnKey: 'order.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'updatedAt', order?.updatedAt ?? null),
    },
    {
      columnKey: 'order.archived',
      type: 'status',
      ...transformValueField(
        basePath,
        order,
        'archived',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_ARCHIVED)
      ),
    },
    {
      columnKey: 'order.poNo',
      type: 'text',
      ...transformValueField(
        basePath,
        order,
        'poNo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_PO_NO)
      ),
    },
    {
      columnKey: 'order.importer',
      type: 'partner',
      ...transformReadonlyField(basePath, order, 'importer', order?.importer ?? null),
    },
    readonlyExporter
      ? {
          columnKey: 'order.exporter',
          type: 'partner',
          ...transformReadonlyField(basePath, order, 'exporter', order?.exporter ?? null),
        }
      : {
          columnKey: 'order.exporter',
          type: 'partner',
          extra: {
            partnerTypes: ['Exporter'],
            confirmationDialogMessage: (
              <FormattedMessage {...orderMessages.changeExporterWarning} />
            ),
            isRequired: true,
          },
          ...transformValueField(
            basePath,
            order,
            'exporter',
            hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_EXPORTER)
          ),
        },
    {
      columnKey: 'order.piNo',
      type: 'text',
      ...transformValueField(
        basePath,
        order,
        'piNo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_PI_NO)
      ),
    },
    {
      columnKey: 'order.issuedAt',
      type: 'date',
      ...transformValueField(
        basePath,
        order,
        'issuedAt',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_ISSUE_AT)
      ),
    },
    {
      columnKey: 'order.deliveryDate',
      type: 'date',
      ...transformValueField(
        basePath,
        order,
        'deliveryDate',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'order.currency',
      type: 'currency',
      ...transformValueField(
        basePath,
        order,
        'currency',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_CURRENCY)
      ),
    },
    {
      columnKey: 'order.incoterm',
      type: 'incoterm',
      ...transformValueField(
        basePath,
        order,
        'incoterm',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_INCOTERM)
      ),
    },
    {
      columnKey: 'order.deliveryPlace',
      type: 'text',
      ...transformValueField(
        basePath,
        order,
        'deliveryPlace',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DELIVERY_PLACE)
      ),
    },
    {
      columnKey: 'order.tags',
      type: 'order_tags',
      ...transformValueField(
        basePath,
        order,
        'tags',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_TAGS)
      ),
    },
    {
      columnKey: 'order.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        order,
        'memo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_MEMO)
      ),
    },
    {
      columnKey: 'order.totalOrdered',
      type: 'number',
      ...transformComputedField(basePath, order, 'totalOrdered', root => {
        const currentOrder = getOrderFromRoot(root);
        return (currentOrder?.orderItems ?? []).reduce(
          (total, orderItem) => total + orderItem.quantity,
          0
        );
      }),
    },
    {
      columnKey: 'order.totalBatched',
      type: 'number',
      ...transformComputedField(basePath, order, 'totalBatched', root => {
        const currentOrder = getOrderFromRoot(root);
        return (currentOrder?.orderItems ?? []).reduce(
          (totalBatched, orderItem) =>
            totalBatched +
            orderItem.batches.reduce((total, batch) => getBatchLatestQuantity(batch) + total, 0),
          0
        );
      }),
    },
    {
      columnKey: 'order.totalShipped',
      type: 'number',
      ...transformComputedField(basePath, order, 'totalShipped', root => {
        const currentOrder = getOrderFromRoot(root);
        return (currentOrder?.orderItems ?? []).reduce(
          (totalBatched, orderItem) =>
            totalBatched +
            orderItem.batches
              .filter(batch => !!batch.shipment)
              .reduce((total, batch) => getBatchLatestQuantity(batch) + total, 0),
          0
        );
      }),
    },
    {
      columnKey: 'order.totalPrice',
      type: 'metric_value',
      ...transformComputedField(basePath, order, 'totalPrice', root => {
        const currentOrder = getOrderFromRoot(root);
        return {
          value: (currentOrder?.orderItems ?? []).reduce(
            (totalPrice, orderItem) => totalPrice + orderItem.price.value * orderItem.quantity,
            0
          ),
          metric: root.currency,
        };
      }),
    },
    {
      columnKey: 'order.files',
      type: 'order_documents',
      ...transformValueField(
        basePath,
        order,
        'files',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'order.todo',
      type: 'order_tasks',
      computed: root => {
        const currentOrder = getOrderFromRoot(root);
        return {
          entityId: currentOrder?.id,
          ownerId: currentOrder?.ownedBy?.id,
          groupIds: [currentOrder?.importer?.id, currentOrder?.exporter?.id].filter(Boolean),
        };
      },
      ...transformValueField(
        basePath,
        order,
        'todo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_TASKS)
      ),
    },
    {
      columnKey: 'order.logs',
      type: 'order_logs',
      ...transformValueField(basePath, order, 'id', () => true),
    },
    {
      columnKey: 'order.mask',
      type: 'mask',
      extra: { entityType: 'Order' },
      ...transformField(
        order,
        `${basePath}.customFields.mask`,
        'mask',
        order?.customFields?.mask ?? null,
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `order.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: (root: Object) => {
        const currentOrder = getOrderFromRoot(root);
        const mask = currentOrder?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        order,
        fieldDefinition.id,
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_CUSTOM_FIELDS)
      ),
    })),
    {
      columnKey: 'order.action',
      ...transformActionField(basePath, order, actions),
    },
  ];
}
