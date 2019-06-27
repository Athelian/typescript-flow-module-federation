// @flow
import type { Task } from 'generated/graphql';
import memoize from 'memoize-one';
import { comparator, sort, reverse } from 'ramda';
import { getByPathWithDefault } from 'utils/fp';

type SortField =
  | 'default'
  | 'updatedAt'
  | 'createdAt'
  | 'name'
  | 'startDate'
  | 'dueDate'
  | 'entity';

type SortDirection = 'asc' | 'desc';

export const ENTITIES = [
  'Order',
  'OrderItem',
  'Batch',
  'Container',
  'Shipment',
  'Product',
  'ProductProvider',
];

function compareByNumber(firstNumber: number, secondNumber: number) {
  return firstNumber < secondNumber;
}

function compareByName(firstString: string, secondString: string) {
  if (firstString.toLowerCase() < secondString.toLowerCase()) {
    return true;
  }

  return false;
}

function compareByEntity(firstEntity: number, secondEntity: number) {
  return ENTITIES.indexOf(firstEntity) > ENTITIES.indexOf(secondEntity);
}

function sortBy(
  tasks: Array<Task>,
  { field, direction }: { field: SortField, direction: SortDirection }
) {
  let compareBy;
  switch (field) {
    case 'createdAt':
    case 'updatedAt':
    case 'startDate':
    case 'dueDate': {
      compareBy = comparator((firstItem, secondItem) =>
        compareByNumber(
          getByPathWithDefault(0, field, firstItem),
          getByPathWithDefault(0, field, secondItem)
        )
      );
      break;
    }

    case 'name': {
      compareBy = comparator((firstItem, secondItem) =>
        compareByName(
          getByPathWithDefault('', field, firstItem),
          getByPathWithDefault('', field, secondItem)
        )
      );
      break;
    }

    case 'entity': {
      compareBy = comparator((firstItem, secondItem) =>
        compareByEntity(
          getByPathWithDefault('', 'entity.__typename', firstItem),
          getByPathWithDefault('', 'entity.__typename', secondItem)
        )
      );
      break;
    }

    default: {
      compareBy = comparator((firstItem, secondItem) =>
        compareByEntity(
          getByPathWithDefault('', 'milestoneSort', firstItem),
          getByPathWithDefault('', 'milestoneSort', secondItem)
        )
      );
    }
  }

  const result = sort(compareBy, tasks);
  if (direction === 'desc') return reverse(result);

  return result;
}

export default memoize(sortBy);
