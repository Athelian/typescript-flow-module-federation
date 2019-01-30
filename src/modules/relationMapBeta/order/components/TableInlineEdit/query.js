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
                  tags {
                    ... on Tag {
                      id
                      name
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
                  shipment {
                    ... on Shipment {
                      id
                      no
                      blNo
                      blDate
                      bookingNo
                      bookingDate
                      invoiceNo
                      transportType
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
                        }
                      }
                      cargoReady {
                        ... on TimelineDate {
                          id
                          date
                          timelineDateRevisions {
                            ... on TimelineDateRevision {
                              id
                              date
                              type
                            }
                          }
                        }
                      }
                      voyages {
                        ... on Voyage {
                          id
                          departure {
                            ... on TimelineDate {
                              id
                              date
                              timelineDateRevisions {
                                ... on TimelineDateRevision {
                                  id
                                  date
                                  type
                                }
                              }
                            }
                          }
                          arrival {
                            ... on TimelineDate {
                              id
                              date
                              timelineDateRevisions {
                                ... on TimelineDateRevision {
                                  id
                                  date
                                  type
                                }
                              }
                            }
                          }
                        }
                      }
                      containerGroups {
                        ... on ContainerGroup {
                          customClearance {
                            ... on TimelineDate {
                              id
                              date
                              timelineDateRevisions {
                                ... on TimelineDateRevision {
                                  id
                                  date
                                  type
                                }
                              }
                            }
                          }
                          warehouseArrival {
                            ... on TimelineDate {
                              id
                              date
                              timelineDateRevisions {
                                ... on TimelineDateRevision {
                                  id
                                  date
                                  type
                                }
                              }
                            }
                          }
                          deliveryReady {
                            ... on TimelineDate {
                              id
                              date
                              timelineDateRevisions {
                                ... on TimelineDateRevision {
                                  id
                                  date
                                  type
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
