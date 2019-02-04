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
      ... on Container {
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
        warehouseArrivalAgreedDateAssignedTo {
          ...userAvatarFragment
        }
        warehouseArrivalActualDateAssignedTo {
          ...userAvatarFragment
        }
        tags {
          ...tagFragment
        }
        shipment {
          ...shipmentCardFragment
        }
        batches {
          ...batchFormFragment
        }
        representativeBatch {
          ... on Batch {
            id
          }
        }
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
