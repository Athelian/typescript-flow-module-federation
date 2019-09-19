// @flow
import type { ColumnSort, SortDirection } from 'components/Sheet/SheetColumns';

function stringSort(a: string, b: string): number {
  return a.localeCompare(b);
}

function numberSort(a: number, b: number): number {
  return a - b;
}

function dateSort(a: Date, b: Date): number {
  return a - b;
}

function defaultSort(a: Object, b: Object): number {
  return a.sort - b.sort;
}

function setDirection(result, direction?: SortDirection): number {
  return direction === 'DESCENDING' ? -result : result;
}

export default function sorter(items: Array<Object>, sorts: Array<ColumnSort>): Array<Object> {
  const itemSorts = sorts.filter(s => s.group === 'orderItem');
  const batchSorts = sorts.filter(s => s.group === 'batch');

  return items.map(order => ({
    ...order,
    orderItems: order.orderItems
      .sort((a, b) => {
        let result = 0;

        itemSorts.every(sort => {
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
      })
      .map(orderItem => ({
        ...orderItem,
        batches: orderItem.batches.sort((a, b) => {
          let result = 0;

          batchSorts.every(sort => {
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
                result = setDirection(
                  numberSort(a.packageCapacity, b.packageCapacity),
                  sort.direction
                );
                break;
              case 'packageQuantity':
                result = setDirection(
                  numberSort(a.packageQuantity, b.packageQuantity),
                  sort.direction
                );
                break;
              case 'containerCreatedAt':
                result = setDirection(
                  dateSort(
                    a.container?.createdAt ?? new Date(),
                    b.container?.createdAt ?? new Date()
                  ),
                  sort.direction
                );
                break;
              case 'containerUpdatedAt':
                result = setDirection(
                  dateSort(
                    a.container?.updatedAt ?? new Date(),
                    b.container?.updatedAt ?? new Date()
                  ),
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
                  dateSort(
                    a.shipment?.createdAt ?? new Date(),
                    b.shipment?.createdAt ?? new Date()
                  ),
                  sort.direction
                );
                break;
              case 'shipmentUpdatedAt':
                result = setDirection(
                  dateSort(
                    a.shipment?.updatedAt ?? new Date(),
                    b.shipment?.updatedAt ?? new Date()
                  ),
                  sort.direction
                );
                break;
              case 'shipmentNo':
                result = setDirection(
                  stringSort(a.shipment?.no ?? '', b.shipment?.no ?? ''),
                  sort.direction
                );
                break;
              default:
                break;
            }

            return result === 0;
          });

          return result;
        }),
      })),
  }));
}
