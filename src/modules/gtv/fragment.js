// @flow
import gql from 'graphql-tag';

export const orderSheetFragment = gql`
  fragment orderSheetFragment on Order {
    id
    archived
    poNo
    memo
    tags {
      ...tagFragment
    }
    issuedAt
    piNo
    currency
    incoterm
    deliveryPlace
    deliveryDate
    inCharges {
      ...userAvatarFragment
    }
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
    }
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const orderItemSheetFragment = gql`
  fragment orderItemSheetFragment on OrderItem {
    id
    no
    quantity
    price {
      value: amount
      metric: currency
    }
    deliveryDate
    sort
    memo
    tags {
      ...tagFragment
    }
    productProvider {
      ...forbiddenFragment
      ... on ProductProvider {
        id
        product {
          ...forbiddenFragment
          ... on Product {
            id
            name
            serial
            ownedBy {
              ... on Organization {
                id
              }
            }
          }
        }
        ownedBy {
          ... on Organization {
            id
          }
        }
      }
    }
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const batchSheetFragment = gql`
  fragment batchSheetFragment on Batch {
    id
    no
    quantity
    batchQuantityRevisions {
      ... on BatchQuantityRevision {
        id
        quantity
        type
      }
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
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const shipmentSheetFragment = gql`
  fragment shipmentSheetFragment on Shipment {
    id
    archived
    no
    createdAt
    updatedAt
    blNo
    blDate
    booked
    bookingNo
    bookingDate
    invoiceNo
    contractNo
    transportType
    loadType
    incoterm
    carrier
    containerCount
    memo
    inCharges {
      ...userAvatarFragment
    }
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
    }
    forwarders {
      ...partnerNameFragment
    }
    tags {
      ...tagFragment
    }
    cargoReady {
      ...timelineDateFragment
    }
    voyages {
      ... on Voyage {
        id
        vesselName
        vesselCode
        departurePort {
          seaport
          airport
        }
        arrivalPort {
          seaport
          airport
        }
        departure {
          ...timelineDateFragment
        }
        arrival {
          ...timelineDateFragment
        }
        ownedBy {
          ... on Organization {
            id
          }
        }
      }
    }
    containerGroups {
      ... on ContainerGroup {
        id
        warehouse {
          ...warehouseFragment
        }
        customClearance {
          ...timelineDateFragment
        }
        warehouseArrival {
          ...timelineDateFragment
        }
        deliveryReady {
          ...timelineDateFragment
        }
        ownedBy {
          ... on Organization {
            id
          }
        }
      }
    }
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    id
    date
    assignedTo {
      ...userAvatarFragment
    }
    approvedBy {
      ...userAvatarFragment
    }
    approvedAt
    timelineDateRevisions {
      ... on TimelineDateRevision {
        id
        date
        type
      }
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const containerSheetFragment = gql`
  fragment containerSheetFragment on Container {
    id
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
      ...warehouseFragment
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
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const warehouseFragment = gql`
  fragment warehouseFragment on Warehouse {
    id
    name
  }
`;
