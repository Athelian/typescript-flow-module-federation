import gql from 'graphql-tag';

export const sheetBatchFragment = gql`
  fragment sheetBatchFragment on Batch {
    no
    quantity
    batchQuantityRevisions {
      ...sheetBatchQuantityRevisionFragment
    }
    deliveredAt
    desiredAt
    expiredAt
    producedAt
    packageName
    packageCapacity
    packageQuantity
    autoCalculatePackageQuantity
    packageGrossWeight {
      value
      metric
    }
    packageVolume {
      value
      metric
    }
    packageSize {
      width {
        value
        metric
      }
      length {
        value
        metric
      }
      height {
        value
        metric
      }
    }
    memo
    tags {
      ...tagFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    sort
    containerSort
    shipmentSort
  }
`;

export const sheetBatchQuantityRevisionFragment = gql`
  fragment sheetBatchQuantityRevisionFragment on BatchQuantityRevision {
    id
    quantity
    type
    sort
  }
`;
