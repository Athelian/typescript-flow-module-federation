// @flow
import type { TaskEditable } from 'components/Cards/TaskCard/type.js.flow';
import { getByPath } from 'utils/fp';
import { TASK_UPDATE } from 'modules/permission/constants/task';
import {
  ORDER_TASK_UPDATE,
  ORDER_TASK_SET_NAME,
  ORDER_TASK_SET_DUE_DATE,
  ORDER_TASK_SET_START_DATE,
  ORDER_TASK_SET_IN_PROGRESS,
  ORDER_TASK_SET_COMPLETED,
  ORDER_TASK_SET_ASSIGNEES,
  ORDER_TASK_SET_APPROVED,
  ORDER_TASK_SET_REJECTED,
  ORDER_TASK_SET_APPROVERS,
  ORDER_TASK_SET_START_DATE_BINDING,
  ORDER_TASK_SET_DUE_DATE_BINDING,
  ORDER_TASK_SET_APPROVABLE,
  ORDER_TASK_SET_DESCRIPTION,
  ORDER_TASK_SET_MEMO,
  ORDER_TASK_SET_TAGS,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_TASK_UPDATE,
  ORDER_ITEMS_TASK_SET_NAME,
  ORDER_ITEMS_TASK_SET_DUE_DATE,
  ORDER_ITEMS_TASK_SET_START_DATE,
  ORDER_ITEMS_TASK_SET_IN_PROGRESS,
  ORDER_ITEMS_TASK_SET_COMPLETED,
  ORDER_ITEMS_TASK_SET_ASSIGNEES,
  ORDER_ITEMS_TASK_SET_APPROVED,
  ORDER_ITEMS_TASK_SET_REJECTED,
  ORDER_ITEMS_TASK_SET_APPROVERS,
  ORDER_ITEMS_TASK_SET_START_DATE_BINDING,
  ORDER_ITEMS_TASK_SET_DUE_DATE_BINDING,
  ORDER_ITEMS_TASK_SET_APPROVABLE,
  ORDER_ITEMS_TASK_SET_DESCRIPTION,
  ORDER_ITEMS_TASK_SET_MEMO,
  ORDER_ITEMS_TASK_SET_TAGS,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_TASK_UPDATE,
  BATCH_TASK_SET_NAME,
  BATCH_TASK_SET_DUE_DATE,
  BATCH_TASK_SET_START_DATE,
  BATCH_TASK_SET_IN_PROGRESS,
  BATCH_TASK_SET_COMPLETED,
  BATCH_TASK_SET_ASSIGNEES,
  BATCH_TASK_SET_APPROVED,
  BATCH_TASK_SET_REJECTED,
  BATCH_TASK_SET_APPROVERS,
  BATCH_TASK_SET_START_DATE_BINDING,
  BATCH_TASK_SET_DUE_DATE_BINDING,
  BATCH_TASK_SET_APPROVABLE,
  BATCH_TASK_SET_DESCRIPTION,
  BATCH_TASK_SET_MEMO,
  BATCH_TASK_SET_TAGS,
} from 'modules/permission/constants/batch';
import {
  PRODUCT_TASK_UPDATE,
  PRODUCT_TASK_SET_NAME,
  PRODUCT_TASK_SET_DUE_DATE,
  PRODUCT_TASK_SET_START_DATE,
  PRODUCT_TASK_SET_IN_PROGRESS,
  PRODUCT_TASK_SET_COMPLETED,
  PRODUCT_TASK_SET_ASSIGNEES,
  PRODUCT_TASK_SET_APPROVED,
  PRODUCT_TASK_SET_REJECTED,
  PRODUCT_TASK_SET_APPROVERS,
  PRODUCT_TASK_SET_START_DATE_BINDING,
  PRODUCT_TASK_SET_DUE_DATE_BINDING,
  PRODUCT_TASK_SET_DESCRIPTION,
  PRODUCT_TASK_SET_APPROVABLE,
  PRODUCT_TASK_SET_MEMO,
  PRODUCT_TASK_SET_TAGS,
  PRODUCT_PROVIDER_TASK_UPDATE,
  PRODUCT_PROVIDER_TASK_SET_NAME,
  PRODUCT_PROVIDER_TASK_SET_DUE_DATE,
  PRODUCT_PROVIDER_TASK_SET_START_DATE,
  PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS,
  PRODUCT_PROVIDER_TASK_SET_COMPLETED,
  PRODUCT_PROVIDER_TASK_SET_ASSIGNEES,
  PRODUCT_PROVIDER_TASK_SET_APPROVED,
  PRODUCT_PROVIDER_TASK_SET_REJECTED,
  PRODUCT_PROVIDER_TASK_SET_APPROVERS,
  PRODUCT_PROVIDER_TASK_SET_START_DATE_BINDING,
  PRODUCT_PROVIDER_TASK_SET_DUE_DATE_BINDING,
  PRODUCT_PROVIDER_TASK_SET_APPROVABLE,
  PRODUCT_PROVIDER_TASK_SET_DESCRIPTION,
  PRODUCT_PROVIDER_TASK_SET_MEMO,
  PRODUCT_PROVIDER_TASK_SET_TAGS,
} from 'modules/permission/constants/product';
import {
  SHIPMENT_TASK_UPDATE,
  SHIPMENT_TASK_SET_NAME,
  SHIPMENT_TASK_SET_DUE_DATE,
  SHIPMENT_TASK_SET_START_DATE,
  SHIPMENT_TASK_SET_IN_PROGRESS,
  SHIPMENT_TASK_SET_COMPLETED,
  SHIPMENT_TASK_SET_ASSIGNEES,
  SHIPMENT_TASK_SET_APPROVED,
  SHIPMENT_TASK_SET_REJECTED,
  SHIPMENT_TASK_SET_APPROVERS,
  SHIPMENT_TASK_SET_START_DATE_BINDING,
  SHIPMENT_TASK_SET_DUE_DATE_BINDING,
  SHIPMENT_TASK_SET_APPROVABLE,
  SHIPMENT_TASK_SET_DESCRIPTION,
  SHIPMENT_TASK_SET_MEMO,
  SHIPMENT_TASK_SET_TAGS,
} from 'modules/permission/constants/shipment';

export const parseGroupIds = (task: Object) => {
  const entity = getByPath('entity.__typename', task);

  switch (entity) {
    case 'Batch':
      return [
        getByPath('batch.orderItem.order.importer.id', task),
        getByPath('batch.orderItem.order.exporter.id', task),
      ].filter(Boolean);

    case 'OrderItem':
      return [
        getByPath('orderItem.order.importer.id', task),
        getByPath('orderItem.order.exporter.id', task),
      ].filter(Boolean);

    case 'Order':
      return [getByPath('order.importer.id', task), getByPath('order.exporter.id', task)].filter(
        Boolean
      );

    case 'Shipment':
      return [
        getByPath('shipment.importer.id', task),
        getByPath('shipment.exporter.id', task),
      ].filter(Boolean);

    case 'ProductProvider':
      return [
        getByPath('productProvider.product.importer.id', task),
        getByPath('productProvider.exporter.id', task),
      ].filter(Boolean);

    default:
      return [];
  }
};

export const checkEditableFromEntity = (
  type: string,
  hasPermission: Function
): TaskEditable & {
  startDateBinding: boolean,
  dueDateBinding: boolean,
  approvable: boolean,
  description: boolean,
  memo: boolean,
  tags: boolean,
} => {
  switch (type) {
    case 'Order':
      return {
        name: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_IN_PROGRESS]),
        completed: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_COMPLETED]),
        assignedTo: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_ASSIGNEES]),
        approved: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_APPROVED]),
        rejected: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_REJECTED]),
        approvers: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_APPROVERS]),
        startDateBinding: hasPermission([
          TASK_UPDATE,
          ORDER_TASK_UPDATE,
          ORDER_TASK_SET_START_DATE_BINDING,
        ]),
        dueDateBinding: hasPermission([
          TASK_UPDATE,
          ORDER_TASK_UPDATE,
          ORDER_TASK_SET_DUE_DATE_BINDING,
        ]),
        approvable: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_APPROVABLE]),
        description: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_DESCRIPTION]),
        memo: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_MEMO]),
        tags: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_TAGS]),
      };
    case 'OrderItem':
      return {
        name: hasPermission([TASK_UPDATE, ORDER_ITEMS_TASK_UPDATE, ORDER_ITEMS_TASK_SET_NAME]),
        startDate: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_START_DATE,
        ]),
        dueDate: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_DUE_DATE,
        ]),
        inProgress: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_IN_PROGRESS,
        ]),
        completed: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_COMPLETED,
        ]),
        assignedTo: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_ASSIGNEES,
        ]),
        approved: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_APPROVED,
        ]),
        rejected: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_REJECTED,
        ]),
        approvers: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_APPROVERS,
        ]),
        startDateBinding: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_START_DATE_BINDING,
        ]),
        dueDateBinding: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_DUE_DATE_BINDING,
        ]),
        approvable: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_APPROVABLE,
        ]),
        description: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_DESCRIPTION,
        ]),
        memo: hasPermission([TASK_UPDATE, ORDER_ITEMS_TASK_UPDATE, ORDER_ITEMS_TASK_SET_MEMO]),
        tags: hasPermission([TASK_UPDATE, ORDER_ITEMS_TASK_UPDATE, ORDER_ITEMS_TASK_SET_TAGS]),
      };
    case 'Batch':
      return {
        name: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_IN_PROGRESS]),
        completed: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_COMPLETED]),
        assignedTo: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_ASSIGNEES]),
        approved: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_APPROVED]),
        rejected: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_REJECTED]),
        approvers: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_APPROVERS]),
        startDateBinding: hasPermission([
          TASK_UPDATE,
          BATCH_TASK_UPDATE,
          BATCH_TASK_SET_START_DATE_BINDING,
        ]),
        dueDateBinding: hasPermission([
          TASK_UPDATE,
          BATCH_TASK_UPDATE,
          BATCH_TASK_SET_DUE_DATE_BINDING,
        ]),
        approvable: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_APPROVABLE]),
        description: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_DESCRIPTION]),
        memo: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_MEMO]),
        tags: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_TAGS]),
      };
    case 'Product':
      return {
        name: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_IN_PROGRESS]),
        completed: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_COMPLETED]),
        assignedTo: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_ASSIGNEES]),
        approved: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_APPROVED]),
        rejected: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_REJECTED]),
        approvers: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_APPROVERS]),
        startDateBinding: hasPermission([
          TASK_UPDATE,
          PRODUCT_TASK_UPDATE,
          PRODUCT_TASK_SET_START_DATE_BINDING,
        ]),
        dueDateBinding: hasPermission([
          TASK_UPDATE,
          PRODUCT_TASK_UPDATE,
          PRODUCT_TASK_SET_DUE_DATE_BINDING,
        ]),
        approvable: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_APPROVABLE]),
        description: hasPermission([
          TASK_UPDATE,
          PRODUCT_TASK_UPDATE,
          PRODUCT_TASK_SET_DESCRIPTION,
        ]),
        memo: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_MEMO]),
        tags: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_TAGS]),
      };
    case 'ProductProvider':
      return {
        name: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_NAME,
        ]),
        startDate: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_START_DATE,
        ]),
        dueDate: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_DUE_DATE,
        ]),
        inProgress: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS,
        ]),
        completed: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_COMPLETED,
        ]),
        assignedTo: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_ASSIGNEES,
        ]),
        approved: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_APPROVED,
        ]),
        rejected: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_REJECTED,
        ]),
        approvers: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_APPROVERS,
        ]),
        startDateBinding: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_START_DATE_BINDING,
        ]),
        dueDateBinding: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_DUE_DATE_BINDING,
        ]),
        approvable: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_APPROVABLE,
        ]),
        description: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_DESCRIPTION,
        ]),
        memo: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_MEMO,
        ]),
        tags: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_TAGS,
        ]),
      };
    default:
      return {
        name: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([
          TASK_UPDATE,
          SHIPMENT_TASK_UPDATE,
          SHIPMENT_TASK_SET_IN_PROGRESS,
        ]),
        completed: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_COMPLETED]),
        assignedTo: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_ASSIGNEES]),
        approved: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_APPROVED]),
        rejected: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_REJECTED]),
        approvers: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_APPROVERS]),
        startDateBinding: hasPermission([
          TASK_UPDATE,
          SHIPMENT_TASK_UPDATE,
          SHIPMENT_TASK_SET_START_DATE_BINDING,
        ]),
        dueDateBinding: hasPermission([
          TASK_UPDATE,
          SHIPMENT_TASK_UPDATE,
          SHIPMENT_TASK_SET_DUE_DATE_BINDING,
        ]),
        approvable: hasPermission([
          TASK_UPDATE,
          SHIPMENT_TASK_UPDATE,
          SHIPMENT_TASK_SET_APPROVABLE,
        ]),
        description: hasPermission([
          TASK_UPDATE,
          SHIPMENT_TASK_UPDATE,
          SHIPMENT_TASK_SET_DESCRIPTION,
        ]),
        memo: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_MEMO]),
        tags: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_TAGS]),
      };
  }
};

export default parseGroupIds;
