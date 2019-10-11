// @flow
import type { BatchPayload } from 'generated/graphql';
import isDeepEqual from 'react-fast-compare';
import Fuse from 'fuse.js';
import memoize from 'memoize-one';
import { comparator, sort } from 'ramda';
import { getByPathWithDefault } from 'utils/fp';
import type { SortDirection } from 'types';

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

function compareByNumber(firstNumber: number, secondNumber: number) {
  return firstNumber < secondNumber;
}

function compareByName(firstString: string, secondString: string) {
  return firstString.toLowerCase() < secondString.toLowerCase();
}

function sortBy(
  batches: Array<BatchPayload>,
  {
    query,
    field,
    direction,
  }: { query: string, field: SortField | string, direction: SortDirection | string }
) {
  const options = {
    caseSensitive: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      'no',
      'orderItem.order.poNo',
      'shipment.no',
      'tags.name',
      'orderItem.productProvider.product.name',
      'orderItem.productProvider.product.serial',
      'orderItem.productProvider.exporter.name',
      'orderItem.productProvider.supplier.name',
    ],
  };
  const fuse = new Fuse(batches, options);
  let filterBatches: Array<BatchPayload> = [...batches];
  if (query.length) {
    filterBatches = fuse.search(query);
  }

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
              getByPathWithDefault(0, 'shipmentSort', firstItem),
              getByPathWithDefault(0, 'shipmentSort', secondItem)
            )
          : compareByNumber(
              getByPathWithDefault(0, 'shipmentSort', firstItem),
              getByPathWithDefault(0, 'shipmentSort', secondItem)
            )
      );
    }
  }

  const result = sort(compareBy, filterBatches);

  return result;
}

export default memoize(sortBy, isDeepEqual);
