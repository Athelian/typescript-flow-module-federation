// @flow
import type { ColumnSort } from 'components/Sheet/SheetState/types';
import {
  dateSort,
  defaultSort,
  numberSort,
  setDirection,
  stringSort,
} from 'components/Sheet/SheetState/sorter';

function containerSorter(sorts: Array<ColumnSort>) {
  return (a: Object, b: Object): number => {
    let result = 0;

    sorts.every(sort => {
      switch (sort.name) {
        case 'createdAt':
          result = setDirection(defaultSort(a, b), sort.direction);
          break;
        case 'updatedAt':
          result = setDirection(dateSort(a.updatedAt, b.updatedAt), sort.direction);
          break;
        case 'no':
          result = setDirection(stringSort(a?.no ?? '', b?.no ?? ''), sort.direction);
          break;
        case 'containerType':
          result = setDirection(
            stringSort(a?.containerType ?? '', b?.containerType ?? ''),
            sort.direction
          );
          break;
        case 'warehouseArrivalAgreedDate':
          result = setDirection(
            dateSort(
              a?.warehouseArrivalAgreedDate ?? new Date(),
              b?.warehouseArrivalAgreedDate ?? new Date()
            ),
            sort.direction
          );
          break;
        case 'warehouseArrivalActualDate':
          result = setDirection(
            dateSort(
              a?.warehouseArrivalActualDate ?? new Date(),
              b?.warehouseArrivalActualDate ?? new Date()
            ),
            sort.direction
          );
          break;
        case 'freeTimeStartDate':
          result = setDirection(
            dateSort(a?.freeTimeStartDate ?? new Date(), b?.freeTimeStartDate ?? new Date()),
            sort.direction
          );
          break;
        case 'yardName':
          result = setDirection(stringSort(a?.yardName ?? '', b?.yardName ?? ''), sort.direction);
          break;
        case 'departureDate':
          result = setDirection(
            dateSort(a?.departureDate ?? new Date(), b?.departureDate ?? new Date()),
            sort.direction
          );
          break;
        default:
          break;
      }

      return result === 0;
    });

    return result;
  };
}

function batchSorter(sorts: Array<ColumnSort>, underContainer: boolean = false) {
  return (a: Object, b: Object): number => {
    let result = 0;

    sorts.every(sort => {
      switch (sort.name) {
        case 'createdAt':
          result = underContainer
            ? setDirection(a.containerSort - b.containerSort, sort.direction)
            : setDirection(a.shipmentSort - b.shipmentSort, sort.direction);
          break;
        case 'updatedAt':
          result = setDirection(dateSort(a.updatedAt, b.updatedAt), sort.direction);
          break;
        case 'no':
          result = setDirection(stringSort(a.no, b.no), sort.direction);
          break;
        case 'deliveredAt':
          result = setDirection(dateSort(a.deliveredAt, b.deliveredAt), sort.direction);
          break;
        case 'desiredAt':
          result = setDirection(dateSort(a.desiredAt, b.desiredAt), sort.direction);
          break;
        case 'expiredAt':
          result = setDirection(dateSort(a.expiredAt, b.expiredAt), sort.direction);
          break;
        case 'producedAt':
          result = setDirection(dateSort(a.producedAt, b.producedAt), sort.direction);
          break;
        case 'quantity':
          result = setDirection(numberSort(a.quantity, b.quantity), sort.direction);
          break;
        case 'packageName':
          result = setDirection(stringSort(a.packageName, b.packageName), sort.direction);
          break;
        case 'packageCapacity':
          result = setDirection(numberSort(a.packageCapacity, b.packageCapacity), sort.direction);
          break;
        case 'packageQuantity':
          result = setDirection(numberSort(a.packageQuantity, b.packageQuantity), sort.direction);
          break;
        default:
          break;
      }
      return result === 0;
    });

    return result;
  };
}

export default function sorter(items: Array<Object>, sorts: Array<ColumnSort>): Array<Object> {
  const containerSorts = sorts.filter(s => s.group === 'container');
  const batchSorts = sorts.filter(s => s.group === 'batch');

  return items.map(shipment => {
    switch (shipment.__typename) {
      case 'Forbidden':
      case 'NotFound':
        return shipment;
      default:
        return {
          ...shipment,
          batchesWithoutContainer: shipment.batchesWithoutContainer.sort(batchSorter(batchSorts)),
          containers: shipment.containers
            .map(container => {
              switch (container.__typename) {
                case 'Forbidden':
                case 'NotFound':
                  return container;
                default:
                  return {
                    ...container,
                    batches: container.batches.sort(batchSorter(batchSorts, true)),
                  };
              }
            })
            .sort(containerSorter(containerSorts)),
        };
    }
  });
}
