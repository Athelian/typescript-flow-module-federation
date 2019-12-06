// @flow
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import orderColumns from 'modules/order/sheet/columns';
import shipmentColumns from 'modules/shipment/sheet/columns';
import batchColumns from 'modules/batch/sheet/columns';

export const getColumnsConfig = (
  type: string,
  customFields: Array<Object>
): Array<ColumnConfig> => {
  if (type === 'OrderSheet') {
    return orderColumns({
      orderFieldDefinitions: customFields?.orderCustomFields ?? [],
      orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
      batchFieldDefinitions: customFields?.batchCustomFields ?? [],
      shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
    });
  }
  if (type === 'ShipmentSheet') {
    return shipmentColumns({
      orderFieldDefinitions: customFields?.orderCustomFields ?? [],
      orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
      batchFieldDefinitions: customFields?.batchCustomFields ?? [],
      shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      productFieldDefinitions: customFields?.productCustomFields ?? [],
    });
  }
  if (type === 'BatchSheet') {
    return batchColumns({
      orderFieldDefinitions: customFields?.orderCustomFields ?? [],
      orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
      batchFieldDefinitions: customFields?.batchCustomFields ?? [],
      shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
    });
  }
  return [];
};

export const parseColumns = (
  columnsConfig: Array<ColumnConfig>,
  queriedData: Array<{ key: string, hidden: boolean }>
): Array<ColumnConfig> | null => {
  const queriedDataAsObject = queriedData.reduce(
    (object, item) => ({
      ...object,
      [item.key]: item.hidden,
    }),
    {}
  );

  const orderedColumns = columnsConfig
    .map(col => ({ ...col, hidden: !!queriedDataAsObject[col.key] }))
    .sort((a, b) => {
      const aIdx = queriedData.findIndex(item => item.key === a.key);
      const bIdx = queriedData.findIndex(item => item.key === b.key);
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
