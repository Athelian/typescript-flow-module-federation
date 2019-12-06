// @flow
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import orderColumns, { OrderSheetColumnGroups } from 'modules/order/sheet/columns';
import shipmentColumns, { ShipmentSheetColumnGroups } from 'modules/shipment/sheet/columns';
import batchColumns, { BatchSheetColumnGroups } from 'modules/batch/sheet/columns';

export const getColumnGroupTypes = (type: string): Array<string> => {
  switch (type) {
    case 'OrderSheet':
      return OrderSheetColumnGroups;
    case 'ShipmentSheet':
      return ShipmentSheetColumnGroups;
    case 'BatchSheet':
      return BatchSheetColumnGroups;
    default:
      return [];
  }
};

export const getColumnsConfig = (
  type: string,
  customFields: Array<Object>
): Array<ColumnConfig> => {
  switch (type) {
    case 'OrderSheet':
      return orderColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'ShipmentSheet':
      return shipmentColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
      });
    case 'BatchSheet':
      return batchColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    default:
      return [];
  }
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
