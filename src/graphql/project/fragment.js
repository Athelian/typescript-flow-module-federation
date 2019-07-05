// @flow
import gql from 'graphql-tag';

export const projectCardFragment = gql`
  fragment projectCardFragment on Project {
    id
    name
    description
    dueDate
    milestones {
      ... on Milestone {
        id
      }
    }
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
        id
        name
        dueDate
        completedAt
        completedBy {
          ...userAvatarFragment
        }
        taskCount {
          ...taskCountFragment
        }
        tasks {
          ...taskWithParentInfoFragment
          ... on Task {
            milestoneSort
            entity {
              ... on Order {
                todo {
                  ... on Todo {
                    milestone {
                      ... on Milestone {
                        id
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
                        id
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
                        id
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
                        id
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
                        id
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
