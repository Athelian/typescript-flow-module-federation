// @flow
import type { ColumnSort } from 'components/Sheet/SheetState/types';
import {
  setDirection,
  dateSort,
  defaultSort,
  numberSort,
  stringSort,
} from 'components/Sheet/SheetState/sorter';

function orderItemSorter(sorts: Array<ColumnSort>) {
  return (a: Object, b: Object): number => {
    let result = 0;

    sorts.every(sort => {
      switch (sort.name) {
        case 'createdAt':
          result = setDirection(defaultSort(a, b), sort.direction);
          break;
        case 'updatedAt':
        case 'deliveryDate':
          result = setDirection(dateSort(a[sort.name], b[sort.name]), sort.direction);
          break;
        case 'productProvider.product.name':
          result = setDirection(
            stringSort(a.productProvider.product.name, b.productProvider.product.name),
            sort.direction
          );
          break;
        case 'productProvider.product.serial':
          result = setDirection(
            stringSort(a.productProvider.product.serial, b.productProvider.product.serial),
            sort.direction
          );
          break;
        case 'no':
          result = setDirection(stringSort(a[sort.name], b[sort.name]), sort.direction);
          break;
        case 'quantity':
        case 'totalBatched':
        case 'remainingBatchQuantity':
        case 'totalShipped':
        case 'remainingShippedQuantity':
          result = setDirection(numberSort(a[sort.name], b[sort.name]), sort.direction);
          break;
        default:
          break;
      }

      return result === 0;
    });

    return result;
  };
}

function batchSorter(sorts: Array<ColumnSort>) {
  return (a: Object, b: Object): number => {
    let result = 0;

    sorts.every(sort => {
      switch (sort.name) {
        case 'createdAt':
          result = setDirection(defaultSort(a, b), sort.direction);
          break;
        case 'updatedAt':
        case 'deliveredAt':
        case 'desiredAt':
        case 'expiredAt':
        case 'producedAt':
          result = setDirection(dateSort(a[sort.name], b[sort.name]), sort.direction);
          break;
        case 'no':
        case 'packageName':
          result = setDirection(stringSort(a[sort.name], b[sort.name]), sort.direction);
          break;
        case 'quantity':
        case 'packageCapacity':
        case 'packageQuantity':
          result = setDirection(numberSort(a[sort.name], b[sort.name]), sort.direction);
          break;
        case 'containerCreatedAt':
          result = setDirection(
            dateSort(a.container?.createdAt ?? new Date(), b.container?.createdAt ?? new Date()),
            sort.direction
          );
          break;
        case 'containerUpdatedAt':
          result = setDirection(
            dateSort(a.container?.updatedAt ?? new Date(), b.container?.updatedAt ?? new Date()),
            sort.direction
          );
          break;
        case 'containerNo':
          result = setDirection(
            stringSort(a.container?.no ?? '', b.container?.no ?? ''),
            sort.direction
          );
          break;
        case 'containerContainerType':
          result = setDirection(
            stringSort(a.container?.containerType ?? '', b.container?.containerType ?? ''),
            sort.direction
          );
          break;
        case 'containerWarehouseArrivalAgreedDate':
          result = setDirection(
            dateSort(
              a.container?.warehouseArrivalAgreedDate ?? new Date(),
              b.container?.warehouseArrivalAgreedDate ?? new Date()
            ),
            sort.direction
          );
          break;
        case 'containerWarehouseArrivalActualDate':
          result = setDirection(
            dateSort(
              a.container?.warehouseArrivalActualDate ?? new Date(),
              b.container?.warehouseArrivalActualDate ?? new Date()
            ),
            sort.direction
          );
          break;
        case 'containerFreeTimeStartDate':
          result = setDirection(
            dateSort(
              a.container?.freeTimeStartDate ?? new Date(),
              b.container?.freeTimeStartDate ?? new Date()
            ),
            sort.direction
          );
          break;
        case 'containerYardName':
          result = setDirection(
            stringSort(a.container?.yardName ?? '', b.container?.yardName ?? ''),
            sort.direction
          );
          break;
        case 'containerDepartureDate':
          result = setDirection(
            dateSort(
              a.container?.departureDate ?? new Date(),
              b.container?.departureDate ?? new Date()
            ),
            sort.direction
          );
          break;
        case 'shipmentCreatedAt':
          result = setDirection(
            dateSort(a.shipment?.createdAt ?? new Date(), b.shipment?.createdAt ?? new Date()),
            sort.direction
          );
          break;
        case 'shipmentUpdatedAt':
          result = setDirection(
            dateSort(a.shipment?.updatedAt ?? new Date(), b.shipment?.updatedAt ?? new Date()),
            sort.direction
          );
          break;
        case 'shipmentNo':
          result = setDirection(
            stringSort(a.shipment?.no ?? '', b.shipment?.no ?? ''),
            sort.direction
          );
          break;
        case 'shipmentBlNo':
          result = setDirection(
            stringSort(a.shipment?.blNo ?? '', b.shipment?.blNo ?? ''),
            sort.direction
          );
          break;
        case 'shipmentBlDate':
          result = setDirection(
            dateSort(a.shipment?.blDate ?? new Date(), b.shipment?.blDate ?? new Date()),
            sort.direction
          );
          break;
        case 'shipmentBookingNo':
          result = setDirection(
            stringSort(a.shipment?.bookingNo ?? '', b.shipment?.bookingNo ?? ''),
            sort.direction
          );
          break;
        case 'shipmentBookingDate':
          result = setDirection(
            dateSort(a.shipment?.bookingDate ?? new Date(), b.shipment?.bookingDate ?? new Date()),
            sort.direction
          );
          break;
        case 'shipmentInvoiceNo':
          result = setDirection(
            stringSort(a.shipment?.invoiceNo ?? '', b.shipment?.invoiceNo ?? ''),
            sort.direction
          );
          break;
        case 'shipmentContractNo':
          result = setDirection(
            stringSort(a.shipment?.contractNo ?? '', b.shipment?.contractNo ?? ''),
            sort.direction
          );
          break;
        case 'shipmentCarrier':
          result = setDirection(
            stringSort(a.shipment?.carrier ?? '', b.shipment?.carrier ?? ''),
            sort.direction
          );
          break;
        case 'shipmentNumOfVoyages':
          result = setDirection(
            numberSort(a.shipment?.voyages?.length ?? 0, b.shipment?.voyages?.length ?? 0),
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

export default function sorter(items: Array<Object>, sorts: Array<ColumnSort>): Array<Object> {
  const itemSorts = sorts.filter(s => s.group === 'orderItem');
  const batchSorts = sorts.filter(s => s.group === 'batch');

  return items.map(order => {
    switch (order.__typename) {
      case 'Forbidden':
      case 'NotFound':
        return order;
      default:
        return {
          ...order,
          orderItems: order.orderItems
            .map(orderItem => {
              switch (orderItem.__typename) {
                case 'Forbidden':
                case 'NotFound':
                  return orderItem;
                default:
                  return {
                    ...orderItem,
                    batches: orderItem.batches.sort(batchSorter(batchSorts)),
                  };
              }
            })
            .sort(orderItemSorter(itemSorts)),
        };
    }
  });
}
