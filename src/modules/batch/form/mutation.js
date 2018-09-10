// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { unflatten } from 'utils/data';
import type { BatchCreate, BatchUpdate } from '../type.js.flow';

export const createBatchMutation = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

/* eslint-disable camelcase */
export const prepareCreateBatchInput = ({
  no,
  quantity,
  orderItem,
  shipment,
  tags = [],
  batchAdjustments = [],
  packageGrossWeight_value,
  packageVolume_value,
  packageSize_length_value,
  packageSize_width_value,
  packageSize_height_value,
  ...rest
}: Object): BatchCreate => {
  const dataCopy = {};
  if (packageGrossWeight_value) {
    dataCopy.packageGrossWeight_value = packageGrossWeight_value;
    dataCopy.packageGrossWeight_metric = 'kg';
  }
  if (packageVolume_value) {
    dataCopy.packageVolume_value = packageVolume_value;
    dataCopy.packageVolume_metric = 'cm³';
  }
  if (
    packageSize_length_value ||
    packageSize_length_value === 0 ||
    packageSize_width_value ||
    packageSize_width_value === 0 ||
    packageSize_height_value ||
    packageSize_height_value === 0
  ) {
    if (!packageSize_length_value) {
      dataCopy.packageSize_length_value = 0;
    } else {
      dataCopy.packageSize_length_value = packageSize_length_value;
    }
    if (!packageSize_width_value) {
      dataCopy.packageSize_width_value = 0;
    } else {
      dataCopy.packageSize_width_value = packageSize_width_value;
    }
    if (!packageSize_height_value) {
      dataCopy.packageSize_height_value = 0;
    } else {
      dataCopy.packageSize_height_value = packageSize_height_value;
    }
    dataCopy.packageSize_length_metric = 'cm';
    dataCopy.packageSize_width_metric = 'cm';
    dataCopy.packageSize_height_metric = 'cm';
  }

  return {
    ...unflatten({ ...rest, ...dataCopy }),
    no,
    quantity,
    orderItemId: orderItem.id,
    ...(shipment ? { shipmentId: shipment.id } : {}),
    tagIds: tags.map(({ id: tagId }) => tagId),
    batchAdjustments: batchAdjustments.map(
      ({ isNew, id: adjustmentId, updatedAt: adjustmentUpdatedAt, ...adjustment }) => ({
        ...adjustment,
        ...(isNew ? {} : { id: adjustmentId }),
      })
    ),
  };
};

export const updateBatchMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

/* eslint-disable camelcase */
export const prepareUpdateBatchInput = ({
  id,
  createdAt,
  updatedAt,
  updatedBy,
  orderItem,
  shipment,
  tags = [],
  batchAdjustments = [],
  packageGrossWeight_value,
  packageVolume_value,
  packageSize_length_value,
  packageSize_width_value,
  packageSize_height_value,
  ...rest
}: Object): BatchUpdate => {
  const dataCopy = {};

  if (packageGrossWeight_value) {
    dataCopy.packageGrossWeight_value = packageGrossWeight_value;
    dataCopy.packageGrossWeight_metric = 'kg';
  }
  if (packageVolume_value) {
    dataCopy.packageVolume_value = packageVolume_value;
    dataCopy.packageVolume_metric = 'cm³';
  }
  if (
    packageSize_length_value ||
    packageSize_length_value === 0 ||
    packageSize_width_value ||
    packageSize_width_value === 0 ||
    packageSize_height_value ||
    packageSize_height_value === 0
  ) {
    if (!packageSize_length_value) {
      dataCopy.packageSize_length_value = 0;
    } else {
      dataCopy.packageSize_length_value = packageSize_length_value;
    }
    if (!packageSize_width_value) {
      dataCopy.packageSize_width_value = 0;
    } else {
      dataCopy.packageSize_width_value = packageSize_width_value;
    }
    if (!packageSize_height_value) {
      dataCopy.packageSize_height_value = 0;
    } else {
      dataCopy.packageSize_height_value = packageSize_height_value;
    }
    dataCopy.packageSize_length_metric = 'cm';
    dataCopy.packageSize_width_metric = 'cm';
    dataCopy.packageSize_height_metric = 'cm';
  }

  return {
    ...unflatten({ ...rest, ...dataCopy }),
    orderItemId: orderItem.id,
    ...(shipment ? { shipmentId: shipment.id } : {}),
    tagIds: tags.map(({ id: tagId }) => tagId),
    batchAdjustments: batchAdjustments.map(
      ({ isNew, id: adjustmentId, updatedAt: adjustmentUpdatedAt, ...adjustment }) => ({
        ...adjustment,
        ...(isNew ? {} : { id: adjustmentId }),
      })
    ),
  };
};
