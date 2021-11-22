// @flow
import gql from 'graphql-tag';

const sheetOrderFragment = gql`
  fragment sheetOrderFragment on Order {
    followers {
      ...userAvatarFragment
      __typename
    }
    archived
    poNo
    memo
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    issuedAt
    piNo
    currency
    incoterm
    deliveryPlace
    deliveryDate
    importer {
      ...partnerNameFragment
      __typename
    }
    exporter {
      ...partnerNameFragment
      __typename
    }
    files {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate {
        ...taskTemplateCardFragment
        __typename
      }
      __typename
    }
    __typename
  }
`;

const sheetOrderItemFragment = gql`
  fragment sheetOrderItemFragment on OrderItem {
    no
    quantity
    price {
      value: amount
      metric: currency
      __typename
    }
    deliveryDate
    memo
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    files {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate {
        ...taskTemplateCardFragment
        __typename
      }
      __typename
    }
    sort
    __typename
  }
`;

const sheetBatchFragment = gql`
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
      __typename
    }
    packageVolume {
      value
      metric
      __typename
    }
    autoCalculatePackageVolume
    packageSize {
      width {
        value
        metric
        __typename
      }
      length {
        value
        metric
        __typename
      }
      height {
        value
        metric
        __typename
      }
      __typename
    }
    memo
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate {
        ...taskTemplateCardFragment
        __typename
      }
      __typename
    }
    sort
    containerSort
    shipmentSort
    __typename
  }
`;

const sheetProductFragment = gql`
  fragment sheetProductFragment on Product {
    id
    name
    serial
    material
    __typename
  }
`;

const sheetProductProviderFragment = gql`
  fragment sheetProductProviderFragment on ProductProvider {
    id
    supplier {
      ...partnerNameFragment
      __typename
    }
    name
    unitPrice {
      value: amount
      metric: currency
      __typename
    }
    files {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    __typename
  }
`;

const sheetShipmentFragment = gql`
  fragment sheetShipmentFragment on Shipment {
    followers {
      ...userAvatarFragment
      __typename
    }
    archived
    no
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
    memo
    totalWeightOverride {
      value
      metric
      __typename
    }
    totalWeightOverriding
    totalWeightDisplayMetric
    totalVolumeOverride {
      value
      metric
      __typename
    }
    totalVolumeOverriding
    totalVolumeDisplayMetric
    totalPackageQuantityOverride
    totalPackageQuantityOverriding
    importer {
      ...partnerNameFragment
      __typename
    }
    exporter {
      ...partnerNameFragment
      __typename
    }
    forwarders {
      ...partnerNameFragment
      __typename
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    cargoReady {
      ...sheetTimelineDateFragment
      __typename
    }
    voyages {
      ... on Voyage {
        id
        no
        vesselName
        vesselCode
        departurePort {
          seaport
          seaportName
          airport
          airportName
          __typename
        }
        arrivalPort {
          seaport
          seaportName
          airport
          airportName
          __typename
        }
        departure {
          ...sheetTimelineDateFragment
          __typename
        }
        arrival {
          ...sheetTimelineDateFragment
          __typename
        }
        ownedBy {
          ... on Organization {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    containerGroups {
      ... on ContainerGroup {
        id
        warehouse {
          ...sheetWarehouseFragment
          __typename
        }
        customClearance {
          ...sheetTimelineDateFragment
          __typename
        }
        warehouseArrival {
          ...sheetTimelineDateFragment
          __typename
        }
        deliveryReady {
          ...sheetTimelineDateFragment
          __typename
        }
        ownedBy {
          ... on Organization {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    files {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate {
        ...taskTemplateCardFragment
        __typename
      }
      __typename
    }
    __typename
  }
`;

const sheetContainerFragment = gql`
  fragment sheetContainerFragment on Container {
    no
    autoCalculatedFreeTimeStartDate
    freeTimeStartDate
    freeTimeDuration
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedBy {
      ...userAvatarFragment
      __typename
    }
    warehouseArrivalAgreedDateApprovedAt
    warehouseArrivalActualDateApprovedBy {
      ...userAvatarFragment
      __typename
    }
    warehouseArrivalActualDateApprovedAt
    warehouse {
      ...sheetWarehouseFragment
      __typename
    }
    yardName
    departureDate
    departureDateApprovedBy {
      ...userAvatarFragment
      __typename
    }
    departureDateApprovedAt
    containerType
    containerOption
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    memo
    sort
    __typename
  }
`;

const sheetTimelineDateFragment = gql`
  fragment sheetTimelineDateFragment on TimelineDate {
    id
    date
    approvedBy {
      ...userAvatarFragment
      __typename
    }
    approvedAt
    timelineDateRevisions {
      ... on TimelineDateRevision {
        id
        date
        type
        __typename
      }
      __typename
    }
    ownedBy {
      ... on Organization {
        id
        __typename
      }
      __typename
    }
    __typename
  }
`;

const sheetModelFragment = gql`
  fragment sheetModelFragment on Model {
    id
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
      __typename
    }
    updatedBy {
      ...userAvatarFragment
      __typename
    }
    __typename
  }
`;

const sheetOwnedFragment = gql`
  fragment sheetOwnedFragment on Owned {
    ownedBy {
      ... on Organization {
        id
        __typename
      }
      __typename
    }
    __typename
  }
`;

const sheetCustomizableFragment = gql`
  fragment sheetCustomizableFragment on Customizable {
    customFields {
      mask {
        ...sheetMaskFragment
        __typename
      }
      fieldValues {
        ... on FieldValue {
          value {
            ... on StringValue {
              string
              __typename
            }
            __typename
          }
          fieldDefinition {
            ... on FieldDefinition {
              id
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
`;

const sheetWarehouseFragment = gql`
  fragment sheetWarehouseFragment on Warehouse {
    id
    name
    __typename
  }
`;

const sheetMaskFragment = gql`
  fragment sheetMaskFragment on Mask {
    id
    name
    fieldDefinitions {
      ... on FieldDefinition {
        id
        __typename
      }
      __typename
    }
    __typename
  }
`;

const userAvatarFragment = gql`
  fragment userAvatarFragment on User {
    id
    firstName
    lastName
    organization {
      ... on Organization {
        id
        name
        __typename
      }
      __typename
    }
    __typename
  }
`;

const partnerNameFragment = gql`
  fragment partnerNameFragment on Organization {
    id
    name
    types
    partner {
      ... on Partner {
        id
        name
        code
        __typename
      }
      __typename
    }
    __typename
  }
`;

const documentFragment = gql`
  fragment documentFragment on File {
    id
    name
    path
    type
    size
    memo
    createdAt
    ownedBy {
      ...ownedByFragment
      __typename
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    entity {
      ... on Model {
        id
        __typename
      }
      ... on Owned {
        ownedBy {
          ...ownedByFragment
          __typename
        }
        __typename
      }
      ... on Order {
        poNo
        __typename
      }
      ... on OrderItem {
        no
        __typename
      }
      ... on Shipment {
        no
        __typename
      }
      ... on Batch {
        no
        __typename
      }
      ... on Product {
        name
        __typename
      }
      ... on ProductProvider {
        name
        product {
          ... on Product {
            id
            name
            __typename
          }
          __typename
        }
        __typename
      }
      ... on Milestone {
        name
        project {
          ... on Project {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
`;

const tagFragment = gql`
  fragment tagFragment on Tag {
    id
    name
    color
    ownedBy {
      ... on Organization {
        id
        name
        __typename
      }
      __typename
    }
    __typename
  }
`;

const taskInfoFragment = gql`
  fragment taskInfoFragment on Task {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
      __typename
    }
    ownedBy {
      ...ownedByFragment
      __typename
    }
    name
    description
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    startDate
    startDateInterval {
      months
      weeks
      days
      __typename
    }
    startDateBinding
    dueDate
    dueDateInterval {
      months
      weeks
      days
      __typename
    }
    dueDateBinding
    inProgressAt
    inProgressBy {
      ...userAvatarFragment
      __typename
    }
    skippedAt
    skippedBy {
      ...userAvatarFragment
      __typename
    }
    completedAt
    completedBy {
      ...userAvatarFragment
      __typename
    }
    approvable
    rejectedAt
    rejectedBy {
      ...userAvatarFragment
      __typename
    }
    approvedAt
    approvedBy {
      ...userAvatarFragment
      __typename
    }
    approvers {
      ...userAvatarFragment
      __typename
    }
    __typename
  }
`;

const taskWithoutParentInfoFragment = gql`
  fragment taskWithoutParentInfoFragment on Task {
    ...taskInfoFragment
    milestone {
      ... on Milestone {
        ...milestoneCardFragment
        project {
          ...projectCardFragment
          __typename
        }
        __typename
      }
      __typename
    }
    taskTemplate {
      ... on TaskTemplate {
        id
        __typename
      }
      __typename
    }
    __typename
  }

  ${taskInfoFragment}
`;

const ownedByFragment = gql`
  fragment ownedByFragment on Organization {
    id
    name
    types
    __typename
  }
`;

const taskTemplateCardFragment = gql`
  fragment taskTemplateCardFragment on TaskTemplate {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
      __typename
    }
    name
    description
    entityType
    tasks {
      ...taskFormInTemplateFragment
      __typename
    }
    __typename
  }
`;

const milestoneCardFragment = gql`
  fragment milestoneCardFragment on Milestone {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
      __typename
    }
    project {
      ... on Project {
        id
        ownedBy {
          ...ownedByFragment
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
`;

const taskCountFragment = gql`
  fragment taskCountFragment on TaskCount {
    count
    remain
    inProgress
    completed
    rejected
    approved
    skipped
    delayed
    __typename
  }
`;

const milestoneInProjectCardFragment = gql`
  fragment milestoneInProjectCardFragment on Milestone {
    id
    name
    dueDate
    completedAt
    estimatedCompletionDate
    tasks {
      ... on Task {
        id
        completedAt
        skippedAt
        __typename
      }
      __typename
    }
    __typename
  }
`;

const projectCardFragment = gql`
  fragment projectCardFragment on Project {
    id
    name
    description
    dueDate
    archived
    ... on Followed {
      notificationUnseenCount
      __typename
    }
    timeline {
      unreadCount
      unreadMessageCount
      __typename
    }
    ownedBy {
      ...ownedByFragment
      __typename
    }
    milestones {
      ...milestoneInProjectCardFragment
      __typename
    }
    taskCount {
      ...taskCountFragment
      __typename
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    __typename
  }

  ${taskCountFragment}
  ${milestoneInProjectCardFragment}
`;

const taskFormInTemplateFragment = gql`
  fragment taskFormInTemplateFragment on Task {
    id
    approvable
    updatedAt
    updatedBy {
      ...userAvatarFragment
      __typename
    }
    name
    startDateInterval {
      months
      weeks
      days
      __typename
    }
    startDateBinding
    dueDateInterval {
      months
      weeks
      days
      __typename
    }
    dueDateBinding
    description
    tags {
      ...tagFragment
      ...forbiddenFragment
      __typename
    }
    approvers {
      ...userAvatarFragment
      __typename
    }
    taskTemplate {
      ... on TaskTemplate {
        id
        __typename
      }
      __typename
    }
    __typename
  }
`;

const forbiddenFragment = gql`
  fragment forbiddenFragment on Forbidden {
    reason
    reference {
      id
      __typename
    }
    __typename
  }
`;

// eslint-disable-next-line
export const shipmentsQuery = gql`
  query shipmentsQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...sheetShipmentFragment
        ...sheetModelFragment
        ...sheetOwnedFragment
        ...sheetCustomizableFragment
        ... on Shipment {
          batchesWithoutContainer {
            ...sheetBatchFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ...sheetCustomizableFragment
            ... on Batch {
              orderItem {
                ...sheetOrderItemFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
                ...sheetCustomizableFragment
                ... on OrderItem {
                  order {
                    ...sheetOrderFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                    ...sheetCustomizableFragment
                    __typename
                  }
                  productProvider {
                    ...sheetProductProviderFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                    ...sheetCustomizableFragment
                    ... on ProductProvider {
                      product {
                        ...sheetProductFragment
                        ...sheetModelFragment
                        ...sheetOwnedFragment
                        ...sheetCustomizableFragment
                        __typename
                      }
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          containers {
            ...sheetContainerFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ...sheetCustomizableFragment
            ... on Container {
              batches {
                ...sheetBatchFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
                ...sheetCustomizableFragment
                ... on Batch {
                  orderItem {
                    ...sheetOrderItemFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                    ...sheetCustomizableFragment
                    ... on OrderItem {
                      order {
                        ...sheetOrderFragment
                        ...sheetModelFragment
                        ...sheetOwnedFragment
                        ...sheetCustomizableFragment
                        __typename
                      }
                      productProvider {
                        ...sheetProductProviderFragment
                        ...sheetModelFragment
                        ...sheetOwnedFragment
                        ...sheetCustomizableFragment
                        ... on ProductProvider {
                          product {
                            ...sheetProductFragment
                            ...sheetModelFragment
                            ...sheetOwnedFragment
                            ...sheetCustomizableFragment
                            __typename
                          }
                          __typename
                        }
                        __typename
                      }
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        ...forbiddenFragment
        __typename
      }
      page
      totalPage
      __typename
    }
  }

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetBatchFragment}
  ${sheetProductFragment}
  ${sheetProductProviderFragment}
  ${sheetShipmentFragment}
  ${sheetContainerFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}
  ${sheetMaskFragment}

  ${userAvatarFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
  ${ownedByFragment}
`;
