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
} from 'graphql';

export const containerFormQuery = gql`
  query($id: ID!) {
    container(id: $id) {
      no
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
    }
  }

  ${userAvatarFragment}
  ${warehouseCardFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}

  ${metricFragment}
  ${tagFragment}
`;

export default containerFormQuery;
