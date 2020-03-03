// @flow
import gql from 'graphql-tag';

export const commentFragment = gql`
  fragment commentFragment on Comment {
    id
    content
    createdBy {
      ... on User {
        id
        firstName
        lastName
        email
        avatar {
          ... on File {
            path(preset: Small)
          }
        }
        organization {
          ... on Organization {
            id
            name
          }
        }
        roles {
          ... on Role {
            id
            name
          }
        }
      }
    }
    createdAt
    updatedAt
  }
`;

const valueFragment = gql`
  fragment valueFragment on Value {
    ... on StringValue {
      string
    }
    ... on IntValue {
      int
    }
    ... on FloatValue {
      float
    }
    ... on BooleanValue {
      boolean
    }
    ... on DateTimeValue {
      datetime
    }
    ... on MetricValueValue {
      metricValue {
        value
        metric
      }
    }
    ... on SizeValue {
      size {
        height {
          value
          metric
        }
        length {
          value
          metric
        }
        width {
          value
          metric
        }
      }
    }
    ... on EntityValue {
      entity {
        ... on Model {
          id
        }
        ... on Tag {
          id
          name
          color
        }
        ... on User {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const eventFragment = gql`
  fragment eventFragment on Event {
    id
    entity {
      ... on Model {
        id
      }
    }
    createdBy {
      ... on User {
        id
        firstName
        lastName
        email
        avatar {
          ... on File {
            path(preset: Small)
          }
        }
        organization {
          ... on Organization {
            id
            name
          }
        }
        roles {
          ... on Role {
            id
            name
          }
        }
      }
    }
    createdAt
    logs {
      id
      translationKey
      entity {
        ... on Model {
          id
        }
        ... on File {
          type
        }
      }
      parameters {
        key
        value {
          ...valueFragment
          ... on Values {
            values {
              ...valueFragment
            }
          }
        }
      }
    }
  }

  ${valueFragment}
`;
