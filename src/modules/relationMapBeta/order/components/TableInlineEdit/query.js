// @flow
import gql from 'graphql-tag';

export const ordersByIDsExportQuery = gql`
  query ordersByIDsExport($ids: [ID!]!, $templateId: ID!, $fields: [String!]) {
    ordersByIDsExport(ids: $ids, templateId: $templateId, fields: $fields) {
      ... on File {
        path
      }
    }
  }
`;

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Order {
          id
          poNo
          piNo
          issuedAt
          exporter {
            ... on Group {
              id
              name
            }
          }
          currency
          incoterm
          deliveryPlace
          inCharges {
            ... on User {
              id
              firstName
              lastName
            }
          }
          tags {
            ... on Tag {
              id
              name
              color
            }
          }
          shipments {
            ... on Shipment {
              id
              batches {
                ... on Batch {
                  id
                }
              }
            }
            ... on Shipment {
              id
              no
              blNo
              transportType
              totalVolume {
                ... on MetricValue {
                  metric
                  value
                }
              }
              bookingNo
              bookingDate
              invoiceNo
              loadType
              incoterm
              carrier

              forwarders {
                ... on Group {
                  id
                  name
                }
              }
              inCharges {
                ... on User {
                  id
                  firstName
                  lastName
                }
              }
              tags {
                ... on Tag {
                  id
                  name
                  color
                }
              }
              cargoReady {
                ... on TimelineDate {
                  id
                  date
                  approvedAt
                  timelineDateRevisions {
                    ... on TimelineDateRevision {
                      id
                      date
                    }
                  }
                }
              }
              voyages {
                ... on Voyage {
                  id
                  departurePort {
                    ... on Port {
                      seaport
                      airport
                    }
                  }
                  arrivalPort {
                    ... on Port {
                      seaport
                      airport
                    }
                  }
                  departure {
                    ... on TimelineDate {
                      id
                      date
                      approvedAt
                      timelineDateRevisions {
                        ... on TimelineDateRevision {
                          id
                          date
                        }
                      }
                    }
                  }
                  arrival {
                    ... on TimelineDate {
                      id
                      date
                      approvedAt
                      timelineDateRevisions {
                        ... on TimelineDateRevision {
                          id
                          date
                        }
                      }
                    }
                  }
                }
              }
              containerGroups {
                ... on ContainerGroup {
                  id
                  customClearance {
                    ... on TimelineDate {
                      id
                      date
                      approvedAt
                      timelineDateRevisions {
                        ... on TimelineDateRevision {
                          id
                          date
                        }
                      }
                    }
                  }
                  warehouseArrival {
                    ... on TimelineDate {
                      id
                      date
                      approvedAt
                      timelineDateRevisions {
                        ... on TimelineDateRevision {
                          id
                          date
                        }
                      }
                    }
                  }
                  deliveryReady {
                    ... on TimelineDate {
                      id
                      date
                      approvedAt
                      timelineDateRevisions {
                        ... on TimelineDateRevision {
                          id
                          date
                        }
                      }
                    }
                  }
                  warehouse {
                    ... on Warehouse {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
          orderItems {
            ... on OrderItem {
              id
              quantity
              price {
                ... on Price {
                  amount
                  currency
                }
              }
              productProvider {
                ... on ProductProvider {
                  id
                  product {
                    ... on Product {
                      id
                      name
                      serial
                    }
                  }
                  exporter {
                    ... on Group {
                      id
                      name
                    }
                  }
                  supplier {
                    ... on Group {
                      id
                      name
                    }
                  }
                }
              }
              batches {
                ... on Batch {
                  id
                  no
                  quantity
                  deliveredAt
                  expiredAt
                  producedAt
                  totalAdjusted
                  tags {
                    ... on Tag {
                      id
                      name
                      color
                    }
                  }
                  packageName
                  packageQuantity
                  packageGrossWeight {
                    ... on MetricValue {
                      value
                      metric
                    }
                  }
                  packageVolume {
                    ... on MetricValue {
                      value
                      metric
                    }
                  }
                  packageSize {
                    ... on Size {
                      length {
                        ... on MetricValue {
                          value
                          metric
                        }
                      }
                      width {
                        ... on MetricValue {
                          value
                          metric
                        }
                      }
                      height {
                        ... on MetricValue {
                          value
                          metric
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default ordersByIDsExportQuery;
