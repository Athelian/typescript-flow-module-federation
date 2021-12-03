import gql from 'graphql-tag';

export const sheetBatchFragment = gql`
  fragment sheetBatchFragment on Batch {
    no
    quantity
    producedQuantity
    preShippedQuantity
    shippedQuantity
    postShippedQuantity
    deliveredQuantity
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
    autoCalculatePackageVolume
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
      ...forbiddenFragment
    }
    todo {
      tasks @skip(if: $isSummary) {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate @skip(if: $isSummary) {
        ...taskTemplateCardFragment
        __typename
      }
      tasks @include(if: $isSummary) {
        ...taskInfoSummaryFragment
      }
      __typename
    }
    sort
    containerSort
    shipmentSort
  }
`;

export default sheetBatchFragment;
