// @flow
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import type { Column } from 'components/DraggableColumn';
import { getColumnsConfigured } from 'components/Sheet/useColumns';
import orderColumns, { OrderSheetColumnGroups } from 'modules/order/sheet/columns';
import shipmentColumns, { ShipmentSheetColumnGroups } from 'modules/shipment/sheet/columns';
import batchColumns, { BatchSheetColumnGroups } from 'modules/batch/sheet/columns';
import {
  computeProjectColumnConfigsFromTemplate,
  ProjectSheetColumnGroups,
} from 'modules/project/sheet/columns';
import { convertMappingColumns } from 'utils/template';

export const getColumnGroupTypes = (type: string): Array<string> => {
  switch (type) {
    case 'OrderSheet':
      return OrderSheetColumnGroups;
    case 'ShipmentSheet':
      return ShipmentSheetColumnGroups;
    case 'BatchSheet':
      return BatchSheetColumnGroups;
    case 'ProjectSheet':
      return ProjectSheetColumnGroups;
    default:
      return [];
  }
};

const getColumnsConfig = ({
  type,
  columnsKeys,
  customFields,
}: {
  type: string,
  columnsKeys: Array<string>,
  customFields: ?Object,
}): Array<ColumnConfig> => {
  switch (type) {
    case 'OrderSheet':
      return orderColumns({
        columnsKeys,
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'ShipmentSheet':
      return shipmentColumns({
        columnsKeys,
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'BatchSheet':
      return batchColumns({
        columnsKeys,
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    default:
      return [];
  }
};

export const computeColumnConfigsFromState = (
  {
    type,
    customFields,
    columns,
  }: {
    type: string,
    customFields: Object,
    columns: Array<Object>,
  },
  getColumnKeys?: () => Array<string> = () => []
): Array<Column | Array<Column>> => {
  if (type === 'ProjectSheet') {
    return computeProjectColumnConfigsFromTemplate({ columns }).map(column => ({
      title: column.title,
      key: column.key,
      hidden: !!column.hidden,
    }));
  }
  const templateColumns = getColumnsConfigured(
    getColumnsConfig({ type, customFields, columnsKeys: getColumnKeys() }),
    columns.reduce(
      (object, item) => ({
        ...object,
        [item.key]: item.hidden,
      }),
      {}
    )
  );

  return convertMappingColumns(templateColumns);
};
