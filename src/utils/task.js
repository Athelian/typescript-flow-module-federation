// @flow
import type { User, Task } from 'generated/graphql';
import type { TaskCardEditableProps } from 'components/Cards/TaskCard/type.js.flow';
import { sumBy } from 'lodash';
import { PROJECT_FORM, PROJECT_LIST } from 'modules/permission/constants/project';
import {
  TASK_FORM,
  TASK_CREATE,
  TASK_UPDATE,
  TASK_DELETE,
  TASK_LIST,
} from 'modules/permission/constants/task';
import {
  ORDER_UPDATE,
  ORDER_TASK_CREATE,
  ORDER_TASK_DELETE,
  ORDER_TASK_UPDATE,
  ORDER_TASK_FORM,
  ORDER_TASK_LIST,
  ORDER_SET_TASKS,
  ORDER_SET_MILESTONE,
  ORDER_SET_TASK_TEMPLATE,
  ORDER_TASK_SET_NAME,
  ORDER_TASK_SET_DUE_DATE,
  ORDER_TASK_SET_START_DATE,
  ORDER_TASK_SET_IN_PROGRESS,
  ORDER_TASK_SET_SKIPPED,
  ORDER_TASK_SET_COMPLETED,
  ORDER_TASK_SET_APPROVED,
  ORDER_TASK_SET_REJECTED,
  ORDER_TASK_SET_ASSIGNEES,
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
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_TASK_CREATE,
  ORDER_ITEMS_TASK_DELETE,
  ORDER_ITEMS_TASK_UPDATE,
  ORDER_ITEMS_TASK_FORM,
  ORDER_ITEMS_TASK_LIST,
  ORDER_ITEMS_SET_TASKS,
  ORDER_ITEMS_SET_MILESTONE,
  ORDER_ITEMS_SET_TASK_TEMPLATE,
  ORDER_ITEMS_TASK_SET_NAME,
  ORDER_ITEMS_TASK_SET_DUE_DATE,
  ORDER_ITEMS_TASK_SET_START_DATE,
  ORDER_ITEMS_TASK_SET_IN_PROGRESS,
  ORDER_ITEMS_TASK_SET_SKIPPED,
  ORDER_ITEMS_TASK_SET_COMPLETED,
  ORDER_ITEMS_TASK_SET_APPROVED,
  ORDER_ITEMS_TASK_SET_REJECTED,
  ORDER_ITEMS_TASK_SET_ASSIGNEES,
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
  BATCH_UPDATE,
  BATCH_TASK_CREATE,
  BATCH_TASK_DELETE,
  BATCH_TASK_UPDATE,
  BATCH_TASK_FORM,
  BATCH_TASK_LIST,
  BATCH_SET_TASKS,
  BATCH_SET_MILESTONE,
  BATCH_SET_TASK_TEMPLATE,
  BATCH_TASK_SET_NAME,
  BATCH_TASK_SET_DUE_DATE,
  BATCH_TASK_SET_START_DATE,
  BATCH_TASK_SET_IN_PROGRESS,
  BATCH_TASK_SET_SKIPPED,
  BATCH_TASK_SET_COMPLETED,
  BATCH_TASK_SET_APPROVED,
  BATCH_TASK_SET_REJECTED,
  BATCH_TASK_SET_ASSIGNEES,
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
  PRODUCT_UPDATE,
  PRODUCT_TASK_CREATE,
  PRODUCT_TASK_DELETE,
  PRODUCT_TASK_UPDATE,
  PRODUCT_TASK_FORM,
  PRODUCT_TASK_LIST,
  PRODUCT_SET_TASKS,
  PRODUCT_SET_MILESTONE,
  PRODUCT_SET_TASK_TEMPLATE,
  PRODUCT_TASK_SET_NAME,
  PRODUCT_TASK_SET_DUE_DATE,
  PRODUCT_TASK_SET_START_DATE,
  PRODUCT_TASK_SET_IN_PROGRESS,
  PRODUCT_TASK_SET_SKIPPED,
  PRODUCT_TASK_SET_COMPLETED,
  PRODUCT_TASK_SET_APPROVED,
  PRODUCT_TASK_SET_REJECTED,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_TASK_CREATE,
  PRODUCT_PROVIDER_TASK_DELETE,
  PRODUCT_PROVIDER_TASK_UPDATE,
  PRODUCT_PROVIDER_TASK_FORM,
  PRODUCT_PROVIDER_TASK_LIST,
  PRODUCT_PROVIDER_SET_TASKS,
  PRODUCT_PROVIDER_SET_MILESTONE,
  PRODUCT_PROVIDER_SET_TASK_TEMPLATE,
  PRODUCT_PROVIDER_TASK_SET_NAME,
  PRODUCT_PROVIDER_TASK_SET_DUE_DATE,
  PRODUCT_PROVIDER_TASK_SET_START_DATE,
  PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS,
  PRODUCT_PROVIDER_TASK_SET_SKIPPED,
  PRODUCT_PROVIDER_TASK_SET_COMPLETED,
  PRODUCT_PROVIDER_TASK_SET_APPROVED,
  PRODUCT_PROVIDER_TASK_SET_REJECTED,
  PRODUCT_TASK_SET_ASSIGNEES,
  PRODUCT_TASK_SET_APPROVERS,
  PRODUCT_TASK_SET_START_DATE_BINDING,
  PRODUCT_TASK_SET_DUE_DATE_BINDING,
  PRODUCT_TASK_SET_DESCRIPTION,
  PRODUCT_TASK_SET_APPROVABLE,
  PRODUCT_TASK_SET_MEMO,
  PRODUCT_TASK_SET_TAGS,
  PRODUCT_TASK_SET_MILESTONE,
  PRODUCT_PROVIDER_TASK_SET_ASSIGNEES,
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
  SHIPMENT_UPDATE,
  SHIPMENT_TASK_CREATE,
  SHIPMENT_TASK_DELETE,
  SHIPMENT_TASK_UPDATE,
  SHIPMENT_TASK_FORM,
  SHIPMENT_TASK_LIST,
  SHIPMENT_SET_TASKS,
  SHIPMENT_SET_MILESTONE,
  SHIPMENT_SET_TASK_TEMPLATE,
  SHIPMENT_TASK_SET_NAME,
  SHIPMENT_TASK_SET_DUE_DATE,
  SHIPMENT_TASK_SET_START_DATE,
  SHIPMENT_TASK_SET_IN_PROGRESS,
  SHIPMENT_TASK_SET_SKIPPED,
  SHIPMENT_TASK_SET_COMPLETED,
  SHIPMENT_TASK_SET_APPROVED,
  SHIPMENT_TASK_SET_REJECTED,
  SHIPMENT_TASK_SET_ASSIGNEES,
  SHIPMENT_TASK_SET_APPROVERS,
  SHIPMENT_TASK_SET_START_DATE_BINDING,
  SHIPMENT_TASK_SET_DUE_DATE_BINDING,
  SHIPMENT_TASK_SET_APPROVABLE,
  SHIPMENT_TASK_SET_DESCRIPTION,
  SHIPMENT_TASK_SET_MEMO,
  SHIPMENT_TASK_SET_TAGS,
  SHIPMENT_TASK_SET_MILESTONE,
} from 'modules/permission/constants/shipment';
import { MILESTONE_LIST } from 'modules/permission/constants/milestone';
import { ProductTasksContainer } from 'modules/product/form/containers';
import { ProductProviderTasksContainer } from 'modules/productProvider/form/containers';
import { OrderTasksContainer } from 'modules/order/form/containers';
import { OrderItemTasksContainer } from 'modules/orderItem/form/containers';
import { BatchTasksContainer } from 'modules/batch/form/containers';
import { ShipmentTasksContainer } from 'modules/shipment/form/containers';
import { isBefore, calculateDate, findDuration } from './date';
import { encodeId } from './id';
import { getByPath, getByPathWithDefault } from './fp';
import emitter from './emitter';

export const START_DATE = 'TaskStartDate';
export const DUE_DATE = 'TaskDueDate';
export const PROJECT_DUE_DATE = 'ProjectDueDate';
export const MILESTONE_DUE_DATE = 'MilestoneDueDate';

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

export const getParentInfo = (
  parent: Object
): {
  parentType: string,

  // prettier-ignore
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
  if (__typename === 'Milestone') {
    return {
      parentType: 'project',
      parentIcon: 'MILESTONE',
      parentData: parent.name,
      link: `/project/${encodeId(getByPath('project.id', parent))}`,
    };
  }
  return {};
};

export function triggerAutoBinding({
  manualSettings,
  values,
  entity,
  hasCircleBindingError,
  task,
}: {|
  manualSettings: Object,
  values: Object,
  entity: string,
  hasCircleBindingError: boolean,
  task: Task,
|}) {
  if (!manualSettings.dueDate || !manualSettings.startDate) {
    setTimeout(() => {
      if (!manualSettings.dueDate) {
        const { months = 0, weeks = 0, days = 0 } = values.dueDateInterval || {};
        emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
          hasCircleBindingError,
          selectedField: 'dueDate',
          field: values.dueDateBinding,
          entityId: getByPath('entity.id', task),
          autoDateDuration: {
            metric: findDuration({ months, weeks }),
            value: months || weeks || days,
          },
          autoDateOffset: -(months || weeks || days) > 0 ? 'before' : 'after',
        });
      }
      if (!manualSettings.startDate) {
        const { months = 0, weeks = 0, days = 0 } = values.startDateInterval || {};
        emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
          hasCircleBindingError,
          selectedField: 'startDate',
          field: values.startDateBinding,
          entityId: getByPath('entity.id', task),
          autoDateDuration: {
            metric: findDuration({ months, weeks }),
            value: months || weeks || days,
          },
          autoDateOffset: -(months || weeks || days) > 0 ? 'before' : 'after',
        });
      }
    }, 200);
  }
}

type prepareTaskStatusType = ({
  task: Object,
  editable: Object,
}) => {
  status: string,
  color: string,
  backgroundColor: string,
  account: Object | null,
  editable: boolean,
};

export const prepareTaskStatus: prepareTaskStatusType = ({ task, editable }) => {
  const { completedAt, completedBy, inProgressAt, inProgressBy, skippedAt, skippedBy } = task;
  if (completedAt) {
    return {
      status: 'completed',
      color: 'WHITE',
      backgroundColor: 'TEAL',
      account: completedBy,
      editable: editable.completed,
    };
  }
  if (inProgressAt) {
    return {
      status: 'inProgress',
      color: 'TEAL',
      backgroundColor: 'WHITE',
      account: inProgressBy,
      editable: editable.inProgress,
    };
  }
  if (skippedAt) {
    return {
      status: 'skipped',
      color: 'BLACK',
      backgroundColor: 'GRAY_LIGHT',
      account: skippedBy,
      editable: editable.skipped,
    };
  }
  return {
    status: 'uncompleted',
    color: 'GRAY_LIGHT',
    backgroundColor: 'GRAY_SUPER_LIGHT',
    account: null,
    editable: editable.inProgress,
  };
};

type prepareApprovalStatusType = ({
  approvedBy: Object,
  rejectedBy: Object,
}) => {
  status: string,
  account: Object | null,
  color: string,
  backgroundColor: string,
};
export const prepareApprovalStatus: prepareApprovalStatusType = ({ approvedBy, rejectedBy }) => {
  if (approvedBy) {
    return {
      status: 'approved',
      account: approvedBy,
      color: 'WHITE',
      backgroundColor: 'BLUE',
    };
  }
  if (rejectedBy) {
    return {
      status: 'rejected',
      account: rejectedBy,
      color: 'WHITE',
      backgroundColor: 'RED',
    };
  }
  return {
    status: 'unapproved',
    account: null,
    color: 'GRAY_LIGHT',
    backgroundColor: 'GRAY_SUPER_LIGHT',
  };
};

// only for milestone or project changed
export const recalculateTaskBindingDate = (task: Object) => {
  const {
    startDate,
    startDateBinding,
    startDateInterval,
    dueDate,
    dueDateBinding,
    dueDateInterval,
  } = task;

  const mappingFields = {
    ProjectDueDate: 'milestone.project.dueDate',
    MilestoneDueDate: 'milestone.dueDate',
  };

  let newStartDate = startDate;
  let newDueDate = dueDate;

  if (startDateBinding === DUE_DATE) {
    // do the due date first
    if (dueDateBinding) {
      const { months, weeks, days } = dueDateInterval || {};
      const path = mappingFields[dueDateBinding];
      if (path) {
        newDueDate = calculateDate({
          date: getByPath(path, task),
          duration: findDuration({ months, weeks }),
          offset: months || weeks || days,
        });
      }
    }
    const { months, weeks, days } = startDateInterval || {};
    newStartDate = calculateDate({
      date: newDueDate,
      duration: findDuration({ months, weeks }),
      offset: months || weeks || days,
    });
  } else if (dueDateBinding === START_DATE) {
    // do the start date first
    if (startDateBinding) {
      const { months, weeks, days } = startDateInterval || {};
      const path = mappingFields[startDateBinding];
      if (path) {
        newStartDate = calculateDate({
          date: getByPath(path, task),
          duration: findDuration({ months, weeks }),
          offset: months || weeks || days,
        });
      }
    }
    const { months, weeks, days } = dueDateInterval || {};
    newDueDate = calculateDate({
      date: newStartDate,
      duration: findDuration({ months, weeks }),
      offset: months || weeks || days,
    });
  } else {
    if (startDateBinding) {
      const { months, weeks, days } = startDateInterval || {};
      const path = mappingFields[startDateBinding];
      if (path) {
        newStartDate = calculateDate({
          date: getByPath(path, task),
          duration: findDuration({ months, weeks }),
          offset: months || weeks || days,
        });
      }
    }

    if (dueDateBinding) {
      const { months, weeks, days } = dueDateInterval || {};
      const path = mappingFields[dueDateBinding];
      if (path) {
        newDueDate = calculateDate({
          date: getByPath(path, task),
          duration: findDuration({ months, weeks }),
          offset: months || weeks || days,
        });
      }
    }
  }

  return {
    ...task,
    startDate: newStartDate,
    dueDate: newDueDate,
  };
};

export const getConfig = (
  type: string,
  hasPermission: Function
): {
  canViewProjectForm: boolean,
  canViewList: boolean,
  canViewForm: boolean,
  canAddTasks: boolean,
  canDeleteTasks: boolean,
  canOrderingTasks: boolean,
  canUpdateMilestone: boolean,
  canUpdateTaskTemplate: boolean,
  tasksContainer: Object,
  editable: TaskCardEditableProps,
} => {
  switch (type) {
    case 'Order':
      return {
        canViewProjectForm: hasPermission(PROJECT_FORM),
        canViewList: hasPermission([ORDER_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([TASK_FORM, ORDER_TASK_FORM]),
        canAddTasks: hasPermission([ORDER_TASK_CREATE, ORDER_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission([ORDER_UPDATE, ORDER_SET_TASKS]),
        canDeleteTasks: hasPermission([ORDER_TASK_DELETE, TASK_DELETE]),
        canUpdateMilestone:
          hasPermission(PROJECT_LIST) &&
          hasPermission(MILESTONE_LIST) &&
          (hasPermission(ORDER_UPDATE) ||
            (hasPermission(ORDER_SET_MILESTONE) && hasPermission(ORDER_SET_TASKS))),
        canUpdateTaskTemplate:
          hasPermission([ORDER_UPDATE, ORDER_SET_TASK_TEMPLATE]) &&
          hasPermission([ORDER_UPDATE, ORDER_SET_TASKS]) &&
          hasPermission([ORDER_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([ORDER_TASK_DELETE, TASK_DELETE]),
        tasksContainer: OrderTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_NAME]),
          startDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_START_DATE]),
          dueDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_IN_PROGRESS]),
          skipped: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_SKIPPED]),
          completed: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_COMPLETED]),
          approved: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_REJECTED]),
        },
      };
    case 'OrderItem':
      return {
        canViewProjectForm: hasPermission(PROJECT_FORM),
        canViewList: hasPermission([ORDER_ITEMS_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([ORDER_ITEMS_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([ORDER_ITEMS_TASK_CREATE, ORDER_ITEMS_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TASKS]),
        canDeleteTasks: hasPermission([ORDER_ITEMS_TASK_DELETE, TASK_DELETE]),
        canUpdateMilestone:
          hasPermission(PROJECT_LIST) &&
          hasPermission(MILESTONE_LIST) &&
          (hasPermission(ORDER_ITEMS_UPDATE) ||
            (hasPermission(ORDER_ITEMS_SET_MILESTONE) && hasPermission(ORDER_ITEMS_SET_TASKS))),
        canUpdateTaskTemplate:
          hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TASK_TEMPLATE]) &&
          hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TASKS]) &&
          hasPermission([ORDER_ITEMS_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([ORDER_ITEMS_TASK_DELETE, TASK_DELETE]),
        tasksContainer: OrderItemTasksContainer,
        editable: {
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
        },
      };
    case 'Batch':
      return {
        canViewProjectForm: hasPermission(PROJECT_FORM),
        canViewList: hasPermission([BATCH_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([BATCH_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([BATCH_TASK_CREATE, BATCH_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission([BATCH_UPDATE, BATCH_SET_TASKS]),
        canDeleteTasks: hasPermission([BATCH_TASK_DELETE, TASK_DELETE]),
        canUpdateMilestone:
          hasPermission(PROJECT_LIST) &&
          hasPermission(MILESTONE_LIST) &&
          (hasPermission(BATCH_UPDATE) ||
            (hasPermission(BATCH_SET_MILESTONE) && hasPermission(BATCH_SET_TASKS))),
        canUpdateTaskTemplate:
          hasPermission([BATCH_UPDATE, BATCH_SET_TASK_TEMPLATE]) &&
          hasPermission([BATCH_UPDATE, BATCH_SET_TASKS]) &&
          hasPermission([BATCH_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([BATCH_TASK_DELETE, TASK_DELETE]),
        tasksContainer: BatchTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_NAME]),
          startDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_START_DATE]),
          dueDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_IN_PROGRESS]),
          skipped: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_SKIPPED]),
          completed: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_COMPLETED]),
          approved: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_REJECTED]),
        },
      };
    case 'Product':
      return {
        canViewProjectForm: hasPermission(PROJECT_FORM),
        canViewList: hasPermission([PRODUCT_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([PRODUCT_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([PRODUCT_TASK_CREATE, PRODUCT_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASKS]),
        canDeleteTasks: hasPermission([PRODUCT_TASK_DELETE, TASK_DELETE]),
        canUpdateMilestone:
          hasPermission(PROJECT_LIST) &&
          hasPermission(MILESTONE_LIST) &&
          (hasPermission(PRODUCT_UPDATE) ||
            (hasPermission(PRODUCT_SET_MILESTONE) && hasPermission(PRODUCT_SET_TASKS))),
        canUpdateTaskTemplate:
          hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASK_TEMPLATE]) &&
          hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASKS]) &&
          hasPermission([PRODUCT_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([PRODUCT_TASK_DELETE, TASK_DELETE]),
        tasksContainer: ProductTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_NAME]),
          startDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_START_DATE]),
          dueDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([
            TASK_UPDATE,
            PRODUCT_TASK_UPDATE,
            PRODUCT_TASK_SET_IN_PROGRESS,
          ]),
          skipped: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_SKIPPED]),
          completed: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_COMPLETED]),
          approved: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_REJECTED]),
        },
      };
    case 'ProductProvider':
      return {
        canViewProjectForm: hasPermission(PROJECT_FORM),
        canViewList: hasPermission([PRODUCT_PROVIDER_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([PRODUCT_PROVIDER_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([
          PRODUCT_PROVIDER_TASK_CREATE,
          PRODUCT_PROVIDER_SET_TASKS,
          TASK_CREATE,
        ]),
        canOrderingTasks: hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASKS]),
        canDeleteTasks: hasPermission([PRODUCT_PROVIDER_TASK_DELETE, TASK_DELETE]),
        canUpdateMilestone:
          hasPermission(PROJECT_LIST) &&
          hasPermission(MILESTONE_LIST) &&
          (hasPermission(PRODUCT_PROVIDER_UPDATE) ||
            (hasPermission(PRODUCT_PROVIDER_SET_MILESTONE) &&
              hasPermission(PRODUCT_PROVIDER_SET_TASKS))),
        canUpdateTaskTemplate:
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASK_TEMPLATE]) &&
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASKS]) &&
          hasPermission([PRODUCT_PROVIDER_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([PRODUCT_PROVIDER_TASK_DELETE, TASK_DELETE]),
        tasksContainer: ProductProviderTasksContainer,
        editable: {
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
        },
      };
    default:
      return {
        canViewProjectForm: hasPermission(PROJECT_FORM),
        canViewList: hasPermission([SHIPMENT_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([SHIPMENT_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([SHIPMENT_TASK_CREATE, SHIPMENT_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASKS]),
        canDeleteTasks: hasPermission([SHIPMENT_TASK_DELETE, TASK_DELETE]),
        canUpdateMilestone:
          hasPermission(PROJECT_LIST) &&
          hasPermission(MILESTONE_LIST) &&
          (hasPermission(SHIPMENT_UPDATE) ||
            (hasPermission(SHIPMENT_SET_MILESTONE) && hasPermission(SHIPMENT_SET_TASKS))),
        canUpdateTaskTemplate:
          hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASK_TEMPLATE]) &&
          hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASKS]) &&
          hasPermission([SHIPMENT_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([SHIPMENT_TASK_DELETE, TASK_DELETE]),
        tasksContainer: ShipmentTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_NAME]),
          startDate: hasPermission([
            TASK_UPDATE,
            SHIPMENT_TASK_UPDATE,
            SHIPMENT_TASK_SET_START_DATE,
          ]),
          dueDate: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([
            TASK_UPDATE,
            SHIPMENT_TASK_UPDATE,
            SHIPMENT_TASK_SET_IN_PROGRESS,
          ]),
          skipped: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_SKIPPED]),
          completed: hasPermission([
            TASK_UPDATE,
            SHIPMENT_TASK_UPDATE,
            SHIPMENT_TASK_SET_COMPLETED,
          ]),
          approved: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_REJECTED]),
        },
      };
  }
};
