import gql from 'graphql-tag';

export const sheetShipmentFragment = gql`
  fragment sheetShipmentFragment on Shipment {
    followers {
      ...userAvatarFragment
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
        no
        vesselName
        vesselCode
        departurePort {
          seaport
          seaportName
          airport
          airportName
        }
        arrivalPort {
          seaport
          seaportName
          airport
          airportName
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
    files @include(if: $isSummary) {
      ...documentSummaryFragment
      ...forbiddenFragment
      __typename
    }
    files @skip(if: $isSummary) {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    todo {
      tasks @skip(if: $isSummary) {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate @skip(if: $isSummary) {
        ...taskTemplateCardFragment
        __typename
      }
      tasks @include(if: $isSummary) {
        ...taskInfoSummaryFragment
      }
      __typename
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
