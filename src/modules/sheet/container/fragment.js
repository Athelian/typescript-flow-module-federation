// @flow
import gql from 'graphql-tag';

export const sheetContainerFragment = gql`
  fragment sheetContainerFragment on Container {
    no
    autoCalculatedFreeTimeStartDate
    freeTimeStartDate
    freeTimeDuration
    warehouseArrivalAgreedDate
    warehouseArrivalAgreedDateAssignedTo {
      ...userAvatarFragment
    }
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalAgreedDateApprovedAt
    warehouseArrivalActualDateAssignedTo {
      ...userAvatarFragment
    }
    warehouseArrivalActualDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalActualDateApprovedAt
    warehouse {
      ...sheetWarehouseFragment
    }
    yardName
    departureDate
    departureDateAssignedTo {
      ...userAvatarFragment
    }
    departureDateApprovedBy {
      ...userAvatarFragment
    }
    departureDateApprovedAt
    containerType
    containerOption
    tags {
      ...tagFragment
    }
    memo
    sort
  }
`;
