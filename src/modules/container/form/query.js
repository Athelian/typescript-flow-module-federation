// @flow
import gql from 'graphql-tag';

import { userAvatarFragment, warehouseCardFragment } from 'graphql';

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

      warehouseArrivalActualDateApprovedBy {
        ...userAvatarFragment
      }
    }
  }

  ${userAvatarFragment}
  ${warehouseCardFragment}
`;

export default containerFormQuery;
