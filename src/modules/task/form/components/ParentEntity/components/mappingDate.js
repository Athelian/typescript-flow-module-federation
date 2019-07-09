// @flow
import { getByPath } from 'utils/fp';
import type { Order, Batch, Task } from 'generated/graphql';

export const mappingDate = ({
  field,
  task,
  values,
  mappingFields,
}: {
  field: string,
  task: Task,
  values: Order | Batch,
  mappingFields: Object,
}): ?(string | Date) => {
  const path = mappingFields[field] || 'N/A';
  if (field.includes('DueDate') || field.includes('StartDate')) {
    return getByPath(path, task);
  }
  return getByPath(path, values);
};

export default mappingDate;
