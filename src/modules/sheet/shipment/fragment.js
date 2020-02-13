import gql from 'graphql-tag';

export const sheetShipmentFragment = gql`
  fragment sheetShipmentFragment on Shipment {
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
    }
    totalWeightOverriding
    totalWeightDisplayMetric
    totalVolumeOverride {
      value
      metric
    }
    totalVolumeOverriding
    totalVolumeDisplayMetric
    totalPackageQuantityOverride
    totalPackageQuantityOverriding
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
      ...forbiddenFragment
    }
    cargoReady {
      ...sheetTimelineDateFragment
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
          ...sheetTimelineDateFragment
        }
        arrival {
          ...sheetTimelineDateFragment
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
          ...sheetWarehouseFragment
        }
        customClearance {
          ...sheetTimelineDateFragment
        }
        warehouseArrival {
          ...sheetTimelineDateFragment
        }
        deliveryReady {
          ...sheetTimelineDateFragment
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
  }
`;

export const sheetTimelineDateFragment = gql`
  fragment sheetTimelineDateFragment on TimelineDate {
    id
    date
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
