// @flow
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import { getColumnsConfigured } from 'components/Sheet/useColumns';
import orderColumns, { OrderSheetColumnGroups } from 'modules/order/sheet/columns';
import shipmentColumns, { ShipmentSheetColumnGroups } from 'modules/shipment/sheet/columns';
import batchColumns, { BatchSheetColumnGroups } from 'modules/batch/sheet/columns';
import {
  computeProjectColumnConfigsFromTemplate,
  ProjectSheetColumnGroups,
} from 'modules/project/sheet/columns';

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
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'ShipmentSheet':
      return shipmentColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case 'BatchSheet':
      return batchColumns({
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
  state: Object
): Array<
  | {
      title: React$Node,
      hidden: boolean,
      key: string,
    }
  | Array<{
      title: React$Node,
      hidden: boolean,
      key: string,
    }>
> => {
  if (state.type === 'ProjectSheet') {
    return computeProjectColumnConfigsFromTemplate(state).map(column => ({
      title: column.title,
      key: column.key,
      hidden: !!column.hidden,
    }));
  }

  const groupBatchQuantityColumns = [
    'batch.quantity',
    'batch.producedQuantity',
    'batch.preShippedQuantity',
    'batch.shippedQuantity',
    'batch.postShippedQuantity',
    'batch.deliveredQuantity',
  ];

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

  const mappingColumns = [];
  let counter = 0;
  columns.forEach((column, index) => {
    if (groupBatchQuantityColumns.includes(column.key)) {
      if (counter < groupBatchQuantityColumns.length) {
        const quantityColumns = [];
        while (counter < groupBatchQuantityColumns.length) {
          quantityColumns.push({
            title: columns[index + counter].title,
            key: columns[index + counter].key,
            hidden: !!columns[index + counter].hidden,
          });
          counter += 1;
        }
        mappingColumns.push(quantityColumns);
      }
    } else {
      mappingColumns.push({
        title: column.title,
        key: column.key,
        hidden: !!column.hidden,
      });
    }
  });

  return mappingColumns;
};
