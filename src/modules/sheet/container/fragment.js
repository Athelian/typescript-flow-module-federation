// @flow
import gql from 'graphql-tag';

export const sheetContainerFragment = gql`
  fragment sheetContainerFragment on Container {
    followers {
      ...userAvatarFragment
    }
    no
    autoCalculatedFreeTimeStartDate
    freeTimeStartDate
    freeTimeDuration
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalAgreedDateApprovedAt
    warehouseArrivalActualDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalActualDateApprovedAt
    warehouse {
      ...sheetWarehouseFragment
    }
    yardName
    departureDate
    departureDateApprovedBy {
      ...userAvatarFragment
    }
    departureDateApprovedAt
    containerType
    containerOption
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    memo
    sort
  }
`;

export default sheetContainerFragment;
