// @flow
import type { User, Task } from 'generated/graphql';
import { sumBy } from 'lodash';
import { isBefore } from 'date-fns';
import { encodeId } from 'utils/id';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { TASK_UPDATE } from 'modules/permission/constants/task';
import {
  ORDER_TASK_UPDATE,
  ORDER_TASK_SET_NAME,
  ORDER_TASK_SET_DUE_DATE,
  ORDER_TASK_SET_START_DATE,
  ORDER_TASK_SET_IN_PROGRESS,
  ORDER_TASK_SET_SKIPPED,
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
  ORDER_TASK_SET_MILESTONE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_TASK_UPDATE,
  ORDER_ITEMS_TASK_SET_NAME,
  ORDER_ITEMS_TASK_SET_DUE_DATE,
  ORDER_ITEMS_TASK_SET_START_DATE,
  ORDER_ITEMS_TASK_SET_IN_PROGRESS,
  ORDER_ITEMS_TASK_SET_SKIPPED,
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
  ORDER_ITEMS_TASK_SET_MILESTONE,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_TASK_UPDATE,
  BATCH_TASK_SET_NAME,
  BATCH_TASK_SET_DUE_DATE,
  BATCH_TASK_SET_START_DATE,
  BATCH_TASK_SET_IN_PROGRESS,
  BATCH_TASK_SET_SKIPPED,
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
  BATCH_TASK_SET_MILESTONE,
} from 'modules/permission/constants/batch';
import {
  PRODUCT_TASK_UPDATE,
  PRODUCT_TASK_SET_NAME,
  PRODUCT_TASK_SET_DUE_DATE,
  PRODUCT_TASK_SET_START_DATE,
  PRODUCT_TASK_SET_IN_PROGRESS,
  PRODUCT_TASK_SET_SKIPPED,
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
  PRODUCT_TASK_SET_MILESTONE,
  PRODUCT_PROVIDER_TASK_UPDATE,
  PRODUCT_PROVIDER_TASK_SET_NAME,
  PRODUCT_PROVIDER_TASK_SET_DUE_DATE,
  PRODUCT_PROVIDER_TASK_SET_START_DATE,
  PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS,
  PRODUCT_PROVIDER_TASK_SET_SKIPPED,
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
  PRODUCT_PROVIDER_TASK_SET_MILESTONE,
} from 'modules/permission/constants/product';
import {
  SHIPMENT_TASK_UPDATE,
  SHIPMENT_TASK_SET_NAME,
  SHIPMENT_TASK_SET_DUE_DATE,
  SHIPMENT_TASK_SET_START_DATE,
  SHIPMENT_TASK_SET_IN_PROGRESS,
  SHIPMENT_TASK_SET_SKIPPED,
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
  SHIPMENT_TASK_SET_MILESTONE,
} from 'modules/permission/constants/shipment';

export type TaskEditableProps = {
  name: boolean,
  startDate: boolean,
  dueDate: boolean,
  inProgress: boolean,
  skipped: boolean,
  completed: boolean,
  approved: boolean,
  rejected: boolean,
  assignedTo: boolean,
  approvers: boolean,
};

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
): TaskEditableProps & {
  startDateBinding: boolean,
  dueDateBinding: boolean,
  approvable: boolean,
  description: boolean,
  memo: boolean,
  tags: boolean,
  milestone: boolean,
} => {
  switch (type) {
    case 'Order':
      return {
        name: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_IN_PROGRESS]),
        skipped: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_SKIPPED]),
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
        milestone: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_MILESTONE]),
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
        skipped: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_SKIPPED,
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
        milestone: hasPermission([
          TASK_UPDATE,
          ORDER_ITEMS_TASK_UPDATE,
          ORDER_ITEMS_TASK_SET_MILESTONE,
        ]),
      };
    case 'Batch':
      return {
        name: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_IN_PROGRESS]),
        skipped: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_SKIPPED]),
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
        milestone: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_MILESTONE]),
      };
    case 'Product':
      return {
        name: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_NAME]),
        startDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_START_DATE]),
        dueDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_DUE_DATE]),
        inProgress: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_IN_PROGRESS]),
        skipped: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_SKIPPED]),
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
        milestone: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_MILESTONE]),
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
        skipped: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_SKIPPED,
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
        milestone: hasPermission([
          TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_UPDATE,
          PRODUCT_PROVIDER_TASK_SET_MILESTONE,
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
        skipped: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_SKIPPED]),
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
        milestone: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_MILESTONE]),
      };
  }
};

const isCompletedTask = (task: Task) => {
  return getByPathWithDefault('', 'completedAt', task);
};
const isRejectedTask = (task: Task) => {
  return getByPathWithDefault('', 'rejectedAt', task);
};
const isApprovedTask = (task: Task) => {
  return getByPathWithDefault('', 'approvedAt', task);
};
const isDelayedTask = (task: Task) => {
  return (
    !getByPathWithDefault('', 'completedAt', task) &&
    !getByPathWithDefault('', 'skippedAt', task) &&
    getByPathWithDefault('', 'dueDate', task) &&
    isBefore(new Date(getByPathWithDefault('', 'dueDate', task)), new Date())
  );
};
const isUnApprovedTask = (task: Task) => {
  return (
    getByPathWithDefault('', 'approvable', task) &&
    !getByPathWithDefault('', 'rejectedAt', task) &&
    !getByPathWithDefault('', 'approvedAt', task)
  );
};
const isInProgressTask = (task: Task) => {
  return (
    !getByPathWithDefault('', 'completedAt', task) && getByPathWithDefault('', 'inProgressAt', task)
  );
};
const isRemainTask = (task: Task) => {
  return (
    !getByPathWithDefault('', 'completedAt', task) &&
    !getByPathWithDefault('', 'inProgressAt', task) &&
    !getByPathWithDefault('', 'skippedAt', task)
  );
};
const isSkippedTask = (task: Task) => {
  return getByPathWithDefault('', 'skippedAt', task);
};
export function calculateTasks(tasks: Array<Task>) {
  return {
    count: tasks.length,
    completed: sumBy(tasks, task => (isCompletedTask(task) ? 1 : 0)),
    rejected: sumBy(tasks, task => (isRejectedTask(task) ? 1 : 0)),
    approved: sumBy(tasks, task => (isApprovedTask(task) ? 1 : 0)),
    delayed: sumBy(tasks, task => (isDelayedTask(task) ? 1 : 0)),
    unapproved: sumBy(tasks, task => (isUnApprovedTask(task) ? 1 : 0)),
    inProgress: sumBy(tasks, task => (isInProgressTask(task) ? 1 : 0)),
    remain: sumBy(tasks, task => (isRemainTask(task) ? 1 : 0)),
    skipped: sumBy(tasks, task => (isSkippedTask(task) ? 1 : 0)),
  };
}
export const setToSkipTask = (
  task: Task,
  {
    completedBy,
    completedAt,
  }: {
    completedBy: ?User,
    completedAt: ?Date,
  }
) => {
  if (isRemainTask(task)) return { ...task, skippedBy: completedBy, skippedAt: completedAt };
  if (isInProgressTask(task))
    return {
      ...task,
      skippedBy: completedBy,
      skippedAt: completedAt,
      inProgressBy: null,
      inProgressAt: null,
    };
  return task;
};
export const setToComplete = (
  task: Task,
  {
    completedBy,
    completedAt,
  }: {
    completedBy: ?User,
    completedAt: ?Date,
  }
) => {
  if (isRemainTask(task) || isInProgressTask(task))
    return {
      ...task,
      completedBy,
      completedAt,
      inProgressBy: completedBy,
      inProgressAt: completedAt,
    };
  return task;
};

// TODO: remove parent info from TaskCard
export const getParentInfo = (
  parent: Object
): {
  parentType: string,
  parentIcon: | 'ORDER'
    | 'BATCH'
    | 'SHIPMENT'
    | 'CONTAINER'
    | 'ORDER_ITEM'
    | 'PRODUCT'
    | 'PRODUCT_PROVIDER'
    | 'PROJECT'
    | 'MILESTONE',
  parentData: React$Node,
  link: string,
} => {
  const { __typename } = parent;

  if (__typename === 'Order') {
    return {
      parentType: 'order',
      parentIcon: 'ORDER',
      parentData: parent.poNo,
      link: `/order/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'OrderItem') {
    return {
      parentType: 'orderItem',
      parentIcon: 'ORDER_ITEM',
      parentData: parent.no,
      link: `/order-item/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'Batch') {
    return {
      parentType: 'batch',
      parentIcon: 'BATCH',
      parentData: parent.no,
      link: `/batch/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'Shipment') {
    return {
      parentType: 'shipment',
      parentIcon: 'SHIPMENT',
      parentData: parent.no,
      link: `/shipment/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'Product') {
    return {
      parentType: 'product',
      parentIcon: 'PRODUCT',
      parentData: parent.name,
      link: `/product/${encodeId(parent.id)}`,
    };
  }
  if (__typename === 'ProductProvider') {
    return {
      parentType: 'product',
      parentIcon: 'PRODUCT_PROVIDER',
      parentData: parent.name,
      link: `/product/${encodeId(getByPath('product.id', parent))}`,
    };
  }
  return {};
};

export default parseGroupIds;
