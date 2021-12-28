// @flow
import type { ColumnConfig } from 'components/Sheet/SheetState/types';

const groupedBatchQuantityColumns = [
  'batch.quantity',
  'batch.producedQuantity',
  'batch.preShippedQuantity',
  'batch.shippedQuantity',
  'batch.postShippedQuantity',
  'batch.deliveredQuantity',
];

const groupedCargoReadyColumns = [
  'shipment.cargoReady.latestDate',
  'shipment.cargoReady.dateDifference',
];

const groupedLoadPortDepartureColumns = [
  'shipment.voyage.0.departure.latestDate',
  'shipment.voyage.0.departure.dateDifference',
];

const groupedFirstTransitArrivalColumns = [
  'shipment.voyage.0.firstTransitArrival.latestDate',
  'shipment.voyage.0.firstTransitArrival.dateDifference',
];

const groupedFirstTransitDepartureColumns = [
  'shipment.voyage.1.firstTransitDeparture.latestDate',
  'shipment.voyage.1.firstTransitDeparture.dateDifference',
];

const groupedSecondTransitArrivalColumns = [
  'shipment.voyage.1.secondTransitArrival.latestDate',
  'shipment.voyage.1.secondTransitArrival.dateDifference',
];

const groupedSecondTransitDepartureColumns = [
  'shipment.voyage.2.secondTransitDeparture.latestDate',
  'shipment.voyage.2.secondTransitDeparture.dateDifference',
];

const groupedDischargePortArrivalColumns = [
  'shipment.voyage.2.arrival.latestDate',
  'shipment.voyage.2.arrival.dateDifference',
];

const groupedCustomClearanceColumns = [
  'shipment.containerGroup.customClearance.latestDate',
  'shipment.containerGroup.customClearance.dateDifference',
];

const groupedWarehouseArrivalColumns = [
  'shipment.containerGroup.warehouseArrival.latestDate',
  'shipment.containerGroup.warehouseArrival.dateDifference',
];

const groupedDeliveryReadyColumns = [
  'shipment.containerGroup.deliveryReady.latestDate',
  'shipment.containerGroup.deliveryReady.dateDifference',
];

const fullGroupedColumnsList = [
  groupedBatchQuantityColumns,
  groupedCargoReadyColumns,
  groupedLoadPortDepartureColumns,
  groupedFirstTransitArrivalColumns,
  groupedFirstTransitDepartureColumns,
  groupedSecondTransitArrivalColumns,
  groupedSecondTransitDepartureColumns,
  groupedDischargePortArrivalColumns,
  groupedCustomClearanceColumns,
  groupedWarehouseArrivalColumns,
  groupedDeliveryReadyColumns,
];

const groupColumns = ({
  columns,
  index,
  groupedColumns,
}: {
  columns: Array<ColumnConfig>,
  index: number,
  groupedColumns: Array<string>,
}): Array<ColumnConfig> => {
  const newGroupedColumns = [];

  for (let i = 0; i < groupedColumns.length; i += 1) {
    if (groupedColumns.includes(columns[index + i]?.key)) {
      newGroupedColumns.push({
        ...columns[index + i],
        hidden: !!columns[index + i].hidden,
        isNew: !!columns[index + i].isNew,
      });
    }
  }

  return newGroupedColumns;
};

export const convertMappingColumns = (
  columns: Array<ColumnConfig>
): Array<ColumnConfig | Array<ColumnConfig>> => {
  const mappingColumns: Array<ColumnConfig | Array<ColumnConfig>> = [];

  columns.forEach((column, index) => {
    const groupedColumns = fullGroupedColumnsList.find(groupedColumnList => {
      return groupedColumnList.includes(column.key) && groupedColumnList[0] === column.key;
    });

    mappingColumns.push(
      groupedColumns
        ? groupColumns({ columns, index, groupedColumns })
        : {
            ...column,
            hidden: !!column.hidden,
            isNew: !!column.isNew,
          }
    );
  });

  return mappingColumns;
};

export const flattenColumns = (columns: Array<ColumnConfig | Array<ColumnConfig>>) => {
  return (columns.flatMap(cols => (Array.isArray(cols) ? [...cols] : cols)): Array<ColumnConfig>);
};
