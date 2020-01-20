// @flow
import type { ColumnConfig } from 'components/Sheet';
import { MaskEditTypeValues } from 'generated/graphql';
import type { MaskEdit, MaskEditType } from 'generated/graphql';
import orderColumns from 'modules/order/sheet/columns';
import shipmentColumns from 'modules/shipment/sheet/columns';
import batchColumns from 'modules/batch/sheet/columns';
import {
  computeMilestoneTaskColumnsTemplate,
  computeProjectColumnConfigsFromTemplate,
  defaultColumns as projectDefaultColumns,
  generateMilestoneTaskColumns,
} from 'modules/project/sheet/columns';

export const getDefaultColumns = (
  type: MaskEditType,
  customFields: Object
): Array<ColumnConfig> => {
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

export const getOverrideConfiguredColumnsGeneration = (type: MaskEditType) => {
  switch (type) {
    case MaskEditTypeValues.ProjectSheet:
      return (template: MaskEdit): Array<ColumnConfig> =>
        computeProjectColumnConfigsFromTemplate(template);
    default:
      return null;
  }
};

export const getPreComputeDefaultColumnsOnReorder = (type: MaskEditType) => {
  switch (type) {
    case MaskEditTypeValues.ProjectSheet:
      return (
        defaultColumns: Array<ColumnConfig>,
        columns: Array<ColumnConfig>
      ): Array<ColumnConfig> => {
        const { milestoneCount, taskCount } = computeMilestoneTaskColumnsTemplate(columns);
        const {
          milestoneColumnsTemplate,
          taskColumnsTemplate,
        } = computeMilestoneTaskColumnsTemplate(defaultColumns);

        return generateMilestoneTaskColumns(
          milestoneColumnsTemplate,
          milestoneCount,
          taskColumnsTemplate,
          taskCount
        );
      };
    default:
      return null;
  }
};
