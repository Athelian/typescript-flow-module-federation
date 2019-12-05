// @flow
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import orderColumns from 'modules/order/sheet/columns';
import shipmentColumns from 'modules/shipment/sheet/columns';
import batchColumns from 'modules/batch/sheet/columns';

export const getColumnsConfig = (
  type: string,
  customFields: Array<Object>
): Array<ColumnConfig> => {
  const allFieldDefinitions = {
    orderFieldDefinitions: customFields?.orderCustomFields ?? [],
    orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
    batchFieldDefinitions: customFields?.batchCustomFields ?? [],
    shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
    productFieldDefinitions: customFields?.productCustomFields ?? [],
  };
  if (type === 'OrderSheet') {
    return orderColumns(allFieldDefinitions);
  }
  if (type === 'ShipmentSheet') {
    return shipmentColumns(allFieldDefinitions);
  }
  if (type === 'BatchSheet') {
    return batchColumns(allFieldDefinitions);
  }
  return [];
};

export const parseColumns = (
  columnsConfig: Array<ColumnConfig>,
  queriedData: Array<{ key: string, hidden: boolean }>
): Array<ColumnConfig> | null => {
  const cacheKeysOrder = Object.keys(queriedData);

  const orderedColumns = columnsConfig
    .map(col => ({ ...col, hidden: !!queriedData[col.key] }))
    .sort((a, b) => {
      const aIdx = cacheKeysOrder.indexOf(a.key);
      const bIdx = cacheKeysOrder.indexOf(b.key);
      if (aIdx > bIdx) {
        return 1;
      }
      if (bIdx > aIdx) {
        return -1;
      }
      return 0;
    });

  const groupedColumns = orderedColumns.reduce(
    (grouped, col) => ({
      ...grouped,
      [col.icon]: [...(grouped[col.icon] ?? []), col],
    }),
    {}
  );

  // $FlowFixMe: flat
  return Object.values(groupedColumns).flat();
};
