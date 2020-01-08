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

const getColumnsConfig = (type: string, customFields: ?Object): Array<ColumnConfig> => {
  switch (type) {
    case 'OrderSheet':
      return orderColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        productProviderFieldDefinitions: customFields?.productProviderCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'ShipmentSheet':
      return shipmentColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        productProviderFieldDefinitions: customFields?.productProviderCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'BatchSheet':
      return batchColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        productProviderFieldDefinitions: customFields?.productProviderCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    default:
      return [];
  }
};

export const computeColumnConfigsFromState = (state: Object): Array<Column | Array<Column>> => {
  if (state.type === 'ProjectSheet') {
    return computeProjectColumnConfigsFromTemplate(state).map(column => ({
      title: column.title,
      key: column.key,
      hidden: !!column.hidden,
    }));
  }
  const columns = getColumnsConfigured(
    getColumnsConfig(state.type, state.customFields),
    state.columns.reduce(
      (object, item) => ({
        ...object,
        [item.key]: item.hidden,
      }),
      {}
    )
  );

  return convertMappingColumns(columns);
};
