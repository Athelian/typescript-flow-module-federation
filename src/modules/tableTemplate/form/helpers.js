// @flow
import type { ColumnConfig } from 'components/Sheet';
import { MaskEditTypeValues } from 'generated/graphql';
import orderColumns from 'modules/order/sheet/columns';
import shipmentColumns from 'modules/shipment/sheet/columns';
import batchColumns from 'modules/batch/sheet/columns';
import { defaultColumns as projectDefaultColumns } from 'modules/project/sheet/columns';

export const getDefaultColumns = (type: string, customFields: Object): Array<ColumnConfig> => {
  switch (type) {
    case MaskEditTypeValues.OrderSheet:
      return orderColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case MaskEditTypeValues.ShipmentSheet:
      return shipmentColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case MaskEditTypeValues.BatchSheet:
      return batchColumns({
        orderFieldDefinitions: customFields?.orderCustomFields ?? [],
        productFieldDefinitions: customFields?.productCustomFields ?? [],
        orderItemFieldDefinitions: customFields?.orderItemCustomFields ?? [],
        batchFieldDefinitions: customFields?.batchCustomFields ?? [],
        shipmentFieldDefinitions: customFields?.shipmentCustomFields ?? [],
      });
    case MaskEditTypeValues.ProjectSheet:
      return projectDefaultColumns;
    default:
      return [];
  }
};
