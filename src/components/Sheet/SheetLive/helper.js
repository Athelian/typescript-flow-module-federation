// @flow
import type { EntityEventChange } from './types';

export const convertEntityToInput = (id: string, type: string): Object => {
  switch (type) {
    case 'Product':
      return {
        productId: id,
      };
    case 'ProductProvider':
      return {
        productProviderId: id,
      };
    case 'Order':
      return {
        orderId: id,
      };
    case 'OrderItem':
      return {
        orderItemId: id,
      };
    case 'Batch':
      return {
        batchId: id,
      };
    case 'Shipment':
      return {
        shipmentId: id,
      };
    case 'Voyage':
      return {
        voyageId: id,
      };
    case 'ContainerGroup':
      return {
        containerGroupId: id,
      };
    case 'Container':
      return {
        containerId: id,
      };
    case 'TimelineDate':
      return {
        timelineDateId: id,
      };
    case 'Project':
      return {
        projectId: id,
      };
    case 'Milestone':
      return {
        milestoneId: id,
      };
    case 'Task':
      return {
        taskId: id,
      };
    default:
      throw new Error('unsupported entity type');
  }
};

export const newCustomValue = (value: any) => ({
  custom: value,
  __typename: 'CustomValue',
});

export const extractChangeNewValue = (change: EntityEventChange): any => {
  switch (change.new?.__typename) {
    case 'StringValue':
      return change.new?.string;
    case 'IntValue':
      return change.new?.int;
    case 'FloatValue':
      return change.new?.float;
    case 'BooleanValue':
      return change.new?.boolean;
    case 'DateTimeValue':
      return change.new?.datetime;
    case 'MetricValueValue':
      return change.new?.metricValue;
    case 'SizeValue':
      return change.new?.size;
    case 'CustomValue':
      return change.new?.custom;
    case 'IntervalValue':
      return change.new?.interval;
    default:
      return null;
  }
};

export const mergeChanges = <T>(
  changes: Array<EntityEventChange>,
  fields: { [string]: (initialValue: T, value: any) => T },
  intoField: string,
  initialValue: T
): Array<EntityEventChange> => {
  const changesToMerge = changes.filter(c => Object.keys(fields).includes(c.field));
  if (changesToMerge.length === 0) {
    return changes;
  }

  const mergedChange = {
    field: intoField,
    new: newCustomValue(initialValue),
  };

  changesToMerge.forEach(c => {
    const field = fields[c.field];
    mergedChange.new.custom = field(mergedChange.new.custom, extractChangeNewValue(c));
  });

  const restChanges = changes.filter(c => !Object.keys(fields).includes(c.field));

  return [...restChanges, mergedChange];
};

export const extraChange = <T>(
  changes: Array<EntityEventChange>,
  fields: Array<string>,
  compute: (newValues: Object) => T,
  intoField: string
): Array<EntityEventChange> => {
  const changesForExtra = changes.filter(c => fields.includes(c.field));
  if (changesForExtra.length === 0) {
    return changes;
  }

  return [
    ...changes,
    {
      field: intoField,
      new: newCustomValue(
        compute(
          changesForExtra.reduce(
            (values, change) => ({
              ...values,
              [change.field]: extractChangeNewValue(change),
            }),
            {}
          )
        )
      ),
    },
  ];
};

export default convertEntityToInput;
