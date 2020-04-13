// @flow
import type { ColumnSort } from 'components/Sheet/SheetState/types';
import {
  setDirection,
  dateSort,
  defaultSort,
  numberSort,
  stringSort,
} from 'components/Sheet/SheetState/sorter';
import { getLatestDate } from 'utils/shipment';
import { calculateDueDate } from 'utils/date';

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
        case 'remainingBatchedQuantity':
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
            dateSort(a.container?.createdAt ?? null, b.container?.createdAt ?? null),
            sort.direction
          );
          break;
        case 'containerUpdatedAt':
          result = setDirection(
            dateSort(a.container?.updatedAt ?? null, b.container?.updatedAt ?? null),
            sort.direction
          );
          break;
        case 'containerNo':
          result = setDirection(
            stringSort(a.container?.no ?? null, b.container?.no ?? null),
            sort.direction
          );
          break;
        case 'containerContainerType':
          result = setDirection(
            stringSort(a.container?.containerType ?? null, b.container?.containerType ?? null),
            sort.direction
          );
          break;
        case 'containerWarehouseArrivalAgreedDate':
          result = setDirection(
            dateSort(
              a.container?.warehouseArrivalAgreedDate ?? null,
              b.container?.warehouseArrivalAgreedDate ?? null
            ),
            sort.direction
          );
          break;
        case 'containerWarehouseArrivalActualDate':
          result = setDirection(
            dateSort(
              a.container?.warehouseArrivalActualDate ?? null,
              b.container?.warehouseArrivalActualDate ?? null
            ),
            sort.direction
          );
          break;
        case 'containerFreeTimeStartDate':
          result = setDirection(
            dateSort(
              a.container?.freeTimeStartDate ?? null,
              b.container?.freeTimeStartDate ?? null
            ),
            sort.direction
          );
          break;
        case 'containerDueDate': {
          const freeTimeA = a.container?.freeTimeStartDate?.value ?? null;
          const freeTimeB = b.container?.freeTimeStartDate?.value ?? null;

          result = setDirection(
            dateSort(
              freeTimeA ? calculateDueDate(freeTimeA, a.container?.freeTimeDuration) : null,
              freeTimeB ? calculateDueDate(freeTimeB, b.container?.freeTimeDuration) : null
            ),
            sort.direction
          );
          break;
        }
        case 'containerYardName':
          result = setDirection(
            stringSort(a.container?.yardName ?? null, b.container?.yardName ?? null),
            sort.direction
          );
          break;
        case 'containerDepartureDate':
          result = setDirection(
            dateSort(a.container?.departureDate ?? null, b.container?.departureDate ?? null),
            sort.direction
          );
          break;
        case 'shipmentCreatedAt':
          result = setDirection(
            dateSort(a.shipment?.createdAt ?? null, b.shipment?.createdAt ?? null),
            sort.direction
          );
          break;
        case 'shipmentUpdatedAt':
          result = setDirection(
            dateSort(a.shipment?.updatedAt ?? null, b.shipment?.updatedAt ?? null),
            sort.direction
          );
          break;
        case 'shipmentNo':
          result = setDirection(
            stringSort(a.shipment?.no ?? null, b.shipment?.no ?? null),
            sort.direction
          );
          break;
        case 'shipmentBlNo':
          result = setDirection(
            stringSort(a.shipment?.blNo ?? null, b.shipment?.blNo ?? null),
            sort.direction
          );
          break;
        case 'shipmentBlDate':
          result = setDirection(
            dateSort(a.shipment?.blDate ?? null, b.shipment?.blDate ?? null),
            sort.direction
          );
          break;
        case 'shipmentBookingNo':
          result = setDirection(
            stringSort(a.shipment?.bookingNo ?? null, b.shipment?.bookingNo ?? null),
            sort.direction
          );
          break;
        case 'shipmentBookingDate':
          result = setDirection(
            dateSort(a.shipment?.bookingDate ?? null, b.shipment?.bookingDate ?? null),
            sort.direction
          );
          break;
        case 'shipmentInvoiceNo':
          result = setDirection(
            stringSort(a.shipment?.invoiceNo ?? null, b.shipment?.invoiceNo ?? null),
            sort.direction
          );
          break;
        case 'shipmentContractNo':
          result = setDirection(
            stringSort(a.shipment?.contractNo ?? null, b.shipment?.contractNo ?? null),
            sort.direction
          );
          break;
        case 'shipmentCarrier':
          result = setDirection(
            stringSort(a.shipment?.carrier ?? null, b.shipment?.carrier ?? null),
            sort.direction
          );
          break;
        case 'shipmentNumOfVoyages':
          result = setDirection(
            numberSort(a.shipment?.voyages?.length ?? 0, b.shipment?.voyages?.length ?? 0),
            sort.direction
          );
          break;
        case 'shipmentLoadPort':
          result = setDirection(
            stringSort(
              a.shipment?.voyages?.[0]?.departurePort?.seaportName ??
                a.shipment?.voyages?.[0]?.departurePort?.airportName ??
                '',
              b.shipment?.voyages?.[0]?.departurePort?.seaportName ??
                a.shipment?.voyages?.[0]?.departurePort?.airportName ??
                ''
            ),
            sort.direction
          );
          break;
        case 'shipmentLoadPortDeparture':
          result = setDirection(
            dateSort(
              getLatestDate(a.shipment?.voyages?.[0]?.departure) || new Date(),
              getLatestDate(b.shipment?.voyages?.[0]?.departure) || new Date()
            ),
            sort.direction
          );
          break;
        case 'shipmentDischargePort':
          result = setDirection(
            stringSort(
              a.shipment?.voyages?.[(a.shipment?.voyages?.length ?? 0) - 1]?.arrivalPort
                ?.seaportName ??
                a.shipment?.voyages?.[(a.shipment?.voyages?.length ?? 0) - 1]?.arrivalPort
                  ?.airportName ??
                '',
              b.shipment?.voyages?.[(b.shipment?.voyages?.length ?? 0) - 1]?.arrivalPort
                ?.seaportName ??
                b.shipment?.voyages?.[(b.shipment?.voyages?.length ?? 0) - 1]?.arrivalPort
                  ?.airportName ??
                ''
            ),
            sort.direction
          );
          break;
        case 'shipmentDischargePortArrival':
          result = setDirection(
            dateSort(
              getLatestDate(
                a.shipment?.voyages?.[(a.shipment?.voyages?.length ?? 0) - 1]?.arrival
              ) || new Date(),
              getLatestDate(
                b.shipment?.voyages?.[(b.shipment?.voyages?.length ?? 0) - 1]?.arrival
              ) || new Date()
            ),
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
