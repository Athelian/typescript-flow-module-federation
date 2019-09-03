// @flow
import React from 'react';
import type { Task } from 'generated/graphql';
import memoize from 'memoize-one';
import { comparator, sort } from 'ramda';
import { getByPathWithDefault } from 'utils/fp';

export const EstimatedCompletionDateContext = React.createContext<Array<string>>([]);

export type SortField =
  | 'default'
  | 'updatedAt'
  | 'createdAt'
  | 'name'
  | 'startDate'
  | 'dueDate'
  | 'entity';

export type SortDirection = 'ASCENDING' | 'DESCENDING';

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
  return firstString.toLowerCase() < secondString.toLowerCase();
}

function compareByEntity(firstEntity: string, secondEntity: string) {
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
        direction === 'DESCENDING'
          ? !compareByNumber(
              getByPathWithDefault(0, field, firstItem),
              getByPathWithDefault(0, field, secondItem)
            )
          : compareByNumber(
              getByPathWithDefault(0, field, firstItem),
              getByPathWithDefault(0, field, secondItem)
            )
      );
      break;
    }

    case 'name': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', field, firstItem),
              getByPathWithDefault('', field, secondItem)
            )
          : compareByName(
              getByPathWithDefault('', field, firstItem),
              getByPathWithDefault('', field, secondItem)
            )
      );
      break;
    }

    case 'entity': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByEntity(
              getByPathWithDefault('', 'entity.__typename', firstItem),
              getByPathWithDefault('', 'entity.__typename', secondItem)
            )
          : compareByEntity(
              getByPathWithDefault('', 'entity.__typename', firstItem),
              getByPathWithDefault('', 'entity.__typename', secondItem)
            )
      );
      break;
    }

    default: {
      compareBy = comparator((firstItem, secondItem) =>
        compareByNumber(
          getByPathWithDefault(0, 'milestoneSort', firstItem),
          getByPathWithDefault(0, 'milestoneSort', secondItem)
        )
      );
    }
  }

  const result = sort(compareBy, tasks);

  return result;
}

export default memoize(sortBy);
