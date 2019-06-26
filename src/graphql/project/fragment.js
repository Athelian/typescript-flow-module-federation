// @flow
import gql from 'graphql-tag';

export const taskCountFragment = gql`
  fragment taskCountFragment on TaskCount {
    count
    remain
    inProgress
    completed
    rejected
    approved
    skipped
    delayed
  }
`;

export const projectCardFragment = gql`
  fragment projectCardFragment on Project {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
    tags {
      ...tagFragment
    }
  }
`;

export const milestoneCardFragment = gql`
  fragment milestoneCardFragment on Milestone {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
  }
`;

export const projectFormQueryFragment = gql`
  fragment projectFormQueryFragment on Project {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
    }
    milestones {
      ... on Milestone {
        ...milestoneCardFragment
        tasks {
          ...taskCardFragment
          ... on Task {
            entity {
              ... on Order {
                todo {
                  ... on Todo {
                    milestone {
                      ... on Milestone {
                        project {
                          ... on Project {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on Product {
                todo {
                  ... on Todo {
                    milestone {
                      ... on Milestone {
                        project {
                          ... on Project {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on OrderItem {
                todo {
                  ... on Todo {
                    milestone {
                      ... on Milestone {
                        project {
                          ... on Project {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on Batch {
                todo {
                  ... on Todo {
                    milestone {
                      ... on Milestone {
                        project {
                          ... on Project {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on Shipment {
                todo {
                  ... on Todo {
                    milestone {
                      ... on Milestone {
                        project {
                          ... on Project {
                            id
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
        entitiesCount {
          ... on MilestoneEntitiesCount {
            products
            productProviders
            orders
            orderItems
            batches
            shipments
            containers
          }
        }
        entitiesRelatedCount {
          ... on MilestoneEntitiesCount {
            products
            productProviders
            orders
            orderItems
            batches
            shipments
            containers
          }
        }
      }
    }
  }
`;

export const projectFormFragment = gql`
  fragment projectFormFragment on Project {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
    }
  }
`;
