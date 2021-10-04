// @flow
import gql from 'graphql-tag';
import { partnerNameFragment } from 'graphql';

export const commentFragment = gql`
  fragment commentFragment on TimelineComment {
    id
    content
    createdBy {
      ... on User {
        id
        firstName
        lastName
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
        ... on Milestone {
          id
          name
        }
        ...partnerNameFragment
      }
    }
  }
`;

export const eventFragment = gql`
  fragment eventFragment on TimelineEvent {
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
  ${partnerNameFragment}
`;

export const messagePreferencesQuery = gql`
  query messagePreferences {
    viewer {
      messagePreferences {
        ... on MessagePreferences {
          sendMessageByEnter
        }
      }
    }
  }
`;
