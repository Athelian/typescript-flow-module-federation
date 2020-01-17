// @flow
import type { MaskEditType } from 'generated/graphql';
import type { ColumnConfig } from 'components/Sheet';
import { convertMappingColumns } from 'utils/template';
import { OrderSheetColumnGroups } from 'modules/order/sheet/columns';
import { ShipmentSheetColumnGroups } from 'modules/shipment/sheet/columns';
import { BatchSheetColumnGroups } from 'modules/batch/sheet/columns';
import { ProjectSheetColumnGroups } from 'modules/project/sheet/columns';
import { MaskEditTypeValues } from 'generated/graphql';

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

export const stickiedColumns = (type: MaskEditType, columns: Array<ColumnConfig>) => {
  if (type === MaskEditTypeValues.ProjectSheet) {
    return columns;
  }

  return convertMappingColumns(columns);
};
