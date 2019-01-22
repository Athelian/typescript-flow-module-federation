// @flow
import gql from 'graphql-tag';

import {
  userAvatarFragment,
  warehouseCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  metricFragment,
  tagFragment,
  batchFormFragment,
  sizeFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const containerFormQuery = gql`
  query($id: ID!) {
    container(id: $id) {
      archived
      updatedAt
      no
      memo
      updatedBy {
        ...userAvatarFragment
      }
      warehouse {
        ...warehouseCardFragment
      }
      warehouseArrivalAgreedDate
      warehouseArrivalActualDate
      warehouseArrivalAgreedDateApprovedAt
      warehouseArrivalActualDateApprovedAt
      warehouseArrivalAgreedDateApprovedBy {
        ...userAvatarFragment
      }
      warehouseArrivalActualDateApprovedBy {
        ...userAvatarFragment
      }
      tags {
        ...tagFragment
      }
      totalVolume {
        ...metricFragment
      }
      totalWeight {
        ...metricFragment
      }
      totalPrice {
        ...metricFragment
      }
      totalBatchQuantity
      totalBatchPackages
      totalNumberOfUniqueOrderItems
      shipment {
        ...shipmentCardFragment
      }

      batches {
        ...batchFormFragment
      }
    }
  }

  ${userAvatarFragment}
  ${warehouseCardFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}

  ${metricFragment}
  ${tagFragment}
  ${batchFormFragment}

  ${sizeFragment}

  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}

  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export default containerFormQuery;
