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
        group {
          ... on Group {
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
        group {
          ... on Group {
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
      entity {
        ... on Model {
          id
        }
      }
      translationKey
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
