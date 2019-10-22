// @flow
import type { ColumnSort } from 'components/Sheet/SheetColumns';

function containerSorter(/* sorts: Array<ColumnSort> */) {
  return (/* a: Object, b: Object */): number => {
    return 0;
  };
}

function batchSorter(/* sorts: Array<ColumnSort> */) {
  return (/* a: Object, b: Object */): number => {
    return 0;
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
                    batches: container.batches.sort(batchSorter(batchSorts)),
                  };
              }
            })
            .sort(containerSorter(containerSorts)),
        };
    }
  });
}
