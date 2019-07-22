// @flow
import type { BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { comparator, sort } from 'ramda';
import { getByPathWithDefault } from 'utils/fp';

export type SortField =
  | 'sort'
  | 'updatedAt'
  | 'createdAt'
  | 'no'
  | 'poNo'
  | 'productName'
  | 'productSerial'
  | 'deliveredAt'
  | 'expiredAt'
  | 'producedAt';

export type SortDirection = 'ASCENDING' | 'DESCENDING';

function compareByNumber(firstNumber: number, secondNumber: number) {
  return firstNumber < secondNumber;
}

function compareByName(firstString: string, secondString: string) {
  return firstString.toLowerCase() < secondString.toLowerCase();
}

function sortBy(
  batches: Array<BatchPayload>,
  { field, direction }: { field: SortField | string, direction: SortDirection | string }
) {
  let compareBy;
  switch (field) {
    case 'createdAt':
    case 'updatedAt':
    case 'deliveredAt':
    case 'expiredAt':
    case 'producedAt': {
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

    case 'no': {
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
    case 'poNo': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'orderItem.order.poNo', firstItem),
              getByPathWithDefault('', 'orderItem.order.poNo', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'orderItem.order.poNo', firstItem),
              getByPathWithDefault('', 'orderItem.order.poNo', secondItem)
            )
      );
      break;
    }
    case 'productName': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'orderItem.productProvider.product.name', firstItem),
              getByPathWithDefault('', 'orderItem.productProvider.product.name', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'orderItem.productProvider.product.name', firstItem),
              getByPathWithDefault('', 'orderItem.productProvider.product.name', secondItem)
            )
      );
      break;
    }
    case 'productSerial': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'orderItem.productProvider.product.serial', firstItem),
              getByPathWithDefault('', 'orderItem.productProvider.product.serial', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'orderItem.productProvider.product.serial', firstItem),
              getByPathWithDefault('', 'orderItem.productProvider.product.serial', secondItem)
            )
      );
      break;
    }

    default: {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByNumber(
              getByPathWithDefault(0, 'sort', firstItem),
              getByPathWithDefault(0, 'sort', secondItem)
            )
          : compareByNumber(
              getByPathWithDefault(0, 'sort', firstItem),
              getByPathWithDefault(0, 'sort', secondItem)
            )
      );
    }
  }

  const result = sort(compareBy, batches);

  return result;
}

export default memoize(sortBy);
