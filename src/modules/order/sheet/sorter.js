// @flow
import type { ColumnSort } from 'components/Sheet/SheetColumns';
import type { SortDirection } from 'types';

function stringSort(a: string, b: string): number {
  return a.localeCompare(b);
}

function numberSort(a: number, b: number): number {
  return a - b;
}

function dateSort(a: Date | string, b: Date | string): number {
  return new Date(a) - new Date(b);
}

function defaultSort(a: Object, b: Object): number {
  return a.sort - b.sort;
}

function setDirection(result, direction?: SortDirection): number {
  return direction === 'DESCENDING' ? -result : result;
}

function orderItemSorter(sorts: Array<ColumnSort>) {
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
        case 'deliveryDate':
          result = setDirection(dateSort(a.deliveryDate, b.deliveryDate), sort.direction);
          break;
        case 'no':
          result = setDirection(stringSort(a.no, b.no), sort.direction);
          break;
        case 'quantity':
          result = setDirection(numberSort(a.quantity, b.quantity), sort.direction);
          break;
        case 'totalBatched':
          result = setDirection(numberSort(a.totalBatched, b.totalBatched), sort.direction);
          break;
        case 'totalShipped':
          result = setDirection(numberSort(a.totalShipped, b.totalShipped), sort.direction);
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
        // start date
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
        case 'containerTotalPackageQuantity':
          result = setDirection(
            numberSort(
              a.container?.totalPackageQuantity ?? 0,
              b.container?.totalPackageQuantity ?? 0
            ),
            sort.direction
          );
          break;
        case 'containerTotalQuantity':
          result = setDirection(
            numberSort(a.container?.totalQuantity ?? 0, b.container?.totalQuantity ?? 0),
            sort.direction
          );
          break;
        case 'containerOrderItemCount':
          result = setDirection(
            numberSort(a.container?.orderItemCount ?? 0, b.container?.orderItemCount ?? 0),
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
