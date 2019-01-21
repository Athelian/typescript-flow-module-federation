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
      warehouse {
        ...warehouseCardFragment
      }
      warehouseArrivalAgreedDate
      warehouseArrivalActualDate
      warehouseArrivalAgreedDateApprovedBy {
        ...userAvatarFragment
      }
      tags {
        ...tagFragment
      }
      warehouseArrivalActualDateApprovedBy {
        ...userAvatarFragment
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
