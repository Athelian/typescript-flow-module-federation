// @flow
import type { ColumnSort, SortDirection } from 'components/Sheet/SheetColumns';

function stringSort(a: string, b: string): number {
  return a.localeCompare(b);
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
            case 'no':
              result = setDirection(stringSort(a.no, b.no), sort.direction);
              break;
            case 'createdAt':
              result = setDirection(defaultSort(a, b), sort.direction);
              break;
            case 'updatedAt':
              result = setDirection(dateSort(a.updatedAt, b.updatedAt), sort.direction);
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
              case 'no':
                result = setDirection(stringSort(a.no, b.no), sort.direction);
                break;
              case 'containerNo':
                result = setDirection(
                  stringSort(a.container?.no ?? '', b.container?.no ?? ''),
                  sort.direction
                );
                break;
              case 'shipmentNo':
                result = setDirection(
                  stringSort(a.shipment?.no ?? '', b.shipment?.no ?? ''),
                  sort.direction
                );
                break;
              case 'createdAt':
                result = setDirection(defaultSort(a, b), sort.direction);
                break;
              case 'updatedAt':
                result = setDirection(dateSort(a.updatedAt, b.updatedAt), sort.direction);
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
