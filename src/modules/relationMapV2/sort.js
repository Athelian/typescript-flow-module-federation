// @flow
import type { OrderItemPayload, BatchPayload, ContainerPayload } from 'generated/graphql';
import { comparator, sort } from 'ramda';
import { getByPathWithDefault } from 'utils/fp';
import type { SortDirection } from 'types';

export type BatchSortField =
  | 'updatedAt'
  | 'createdAt'
  | 'no'
  | 'deliveredAt'
  | 'expiredAt'
  | 'producedAt';

export type ItemSortField =
  | 'updatedAt'
  | 'createdAt'
  | 'no'
  | 'currency'
  | 'productName'
  | 'productSerial'
  | 'productProviderName'
  | 'supplierName';

export type ContainerSortField =
  | 'updatedAt'
  | 'createdAt'
  | 'warehouseName'
  | 'warehouseArrivalActualDate'
  | 'warehouseArrivalAgreedDate';

function compareByGeneric(firstNumber: any, secondNumber: any) {
  return firstNumber < secondNumber;
}

function compareByName(firstString: string, secondString: string) {
  return firstString.toLowerCase() < secondString.toLowerCase();
}

export function sortBatchBy(
  batches: Array<BatchPayload>,
  { field, direction }: { field: BatchSortField | string, direction: SortDirection | string }
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
          ? !compareByGeneric(
              getByPathWithDefault(0, field, firstItem),
              getByPathWithDefault(0, field, secondItem)
            )
          : compareByGeneric(
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

    default: {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByGeneric(
              getByPathWithDefault(0, 'id', firstItem),
              getByPathWithDefault(0, 'id', secondItem)
            )
          : compareByGeneric(
              getByPathWithDefault(0, 'id', firstItem),
              getByPathWithDefault(0, 'id', secondItem)
            )
      );
    }
  }

  const result = sort(compareBy, batches);

  return result;
}

export function sortOrderItemBy(
  orderItems: Array<OrderItemPayload>,
  { field, direction }: { field: ItemSortField | string, direction: SortDirection | string }
) {
  let compareBy;
  switch (field) {
    case 'createdAt':
    case 'updatedAt': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByGeneric(
              getByPathWithDefault(0, field, firstItem),
              getByPathWithDefault(0, field, secondItem)
            )
          : compareByGeneric(
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
    case 'currency': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'price.currency', firstItem),
              getByPathWithDefault('', 'price.currency', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'price.currency', firstItem),
              getByPathWithDefault('', 'price.currency', secondItem)
            )
      );
      break;
    }
    case 'productName': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'productProvider.product.name', firstItem),
              getByPathWithDefault('', 'productProvider.product.name', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'productProvider.product.name', firstItem),
              getByPathWithDefault('', 'productProvider.product.name', secondItem)
            )
      );
      break;
    }
    case 'productSerial': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'productProvider.product.serial', firstItem),
              getByPathWithDefault('', 'productProvider.product.serial', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'productProvider.product.serial', firstItem),
              getByPathWithDefault('', 'productProvider.product.serial', secondItem)
            )
      );
      break;
    }

    case 'supplierName': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'orderItem.productProvider.supplier.name', firstItem),
              getByPathWithDefault('', 'orderItem.productProvider.supplier.name', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'orderItem.productProvider.supplier.name', firstItem),
              getByPathWithDefault('', 'orderItem.productProvider.supplier.name', secondItem)
            )
      );
      break;
    }

    default: {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByGeneric(
              getByPathWithDefault(0, 'id', firstItem),
              getByPathWithDefault(0, 'id', secondItem)
            )
          : compareByGeneric(
              getByPathWithDefault(0, 'id', firstItem),
              getByPathWithDefault(0, 'id', secondItem)
            )
      );
    }
  }

  const result = sort(compareBy, orderItems);

  return result;
}

export function sortContainerBy(
  containers: Array<ContainerPayload>,
  { field, direction }: { field: ContainerSortField | string, direction: SortDirection | string }
) {
  let compareBy;
  switch (field) {
    case 'warehouseArrivalActualDate':
    case 'warehouseArrivalAgreedDate':
    case 'createdAt':
    case 'updatedAt': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByGeneric(
              getByPathWithDefault(0, field, firstItem),
              getByPathWithDefault(0, field, secondItem)
            )
          : compareByGeneric(
              getByPathWithDefault(0, field, firstItem),
              getByPathWithDefault(0, field, secondItem)
            )
      );
      break;
    }

    case 'warehouseName': {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByName(
              getByPathWithDefault('', 'warehouse.name', firstItem),
              getByPathWithDefault('', 'warehouse.name', secondItem)
            )
          : compareByName(
              getByPathWithDefault('', 'warehouse.name', firstItem),
              getByPathWithDefault('', 'warehouse.name', secondItem)
            )
      );
      break;
    }

    default: {
      compareBy = comparator((firstItem, secondItem) =>
        direction === 'DESCENDING'
          ? !compareByGeneric(
              getByPathWithDefault(0, 'id', firstItem),
              getByPathWithDefault(0, 'id', secondItem)
            )
          : compareByGeneric(
              getByPathWithDefault(0, 'id', firstItem),
              getByPathWithDefault(0, 'id', secondItem)
            )
      );
    }
  }

  const result = sort(compareBy, containers);

  return result;
}
