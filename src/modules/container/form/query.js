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
      no
      archived
      updatedAt
      updatedBy {
        ...userAvatarFragment
      }
      warehouse {
        ...warehouseCardFragment
      }
      warehouseArrivalAgreedDate
      warehouseArrivalActualDate
      warehouseArrivalAgreedDateApprovedBy {
        ...userAvatarFragment
      }
      warehouseArrivalActualDateApprovedBy {
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
