// @flow
import gql from 'graphql-tag';

const focusFragment = gql`
  fragment focusFragment on Focus {
    id
    entity {
      ... on Model {
        id
      }
    }
    field
    user {
      ... on User {
        id
        firstName
        lastName
      }
    }
  }
`;

export const focusEventSubscription = gql`
  subscription focusEvent($id: ID!) {
    focusEvent(id: $id) {
      ...focusFragment
      ... on Blur {
        id
      }
    }
  }

  ${focusFragment}
`;

export const focusMutation = gql`
  mutation focus($id: ID!, $input: FocusingInput!) {
    focus(id: $id, input: $input)
  }
`;

export const blurMutation = gql`
  mutation blur($id: ID!) {
    blur(id: $id)
  }
`;

export const focusSubscribeMutation = gql`
  mutation focusSubscribe($id: ID!, $input: SubscriptionInput!) {
    focusSubscribe(id: $id, input: $input) {
      ...focusFragment
    }
  }

  ${focusFragment}
`;

export const focusUnsubscribeMutation = gql`
  mutation focusUnsubscribe($id: ID!, $input: SubscriptionInput!) {
    focusUnsubscribe(id: $id, input: $input)
  }
`;

export const entityEventSubscription = gql`
  subscription entityEvent($id: ID!) {
    entityEvent(id: $id) {
      lifeCycle
      entity {
        ... on Model {
          id
        }
        ... on FieldValue {
          fieldDefinition {
            ... on FieldDefinition {
              id
            }
          }
          entity {
            ... on Model {
              id
            }
          }
        }
      }
      changes {
        field
        new {
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
              width {
                value
                metric
              }
              length {
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
          ... on Values {
            values {
              ... on EntityValue {
                entity {
                  ... on Model {
                    id
                  }
                }
              }
            }
          }
          ... on IntervalValue {
            interval {
              days
              weeks
              months
            }
          }
        }
      }
    }
  }
`;

export const entitySubscribeMutation = gql`
  mutation entitySubscribe($id: ID!, $input: SubscriptionInput!) {
    entitySubscribe(id: $id, input: $input)
  }
`;

export const entityUnsubscribeMutation = gql`
  mutation entityUnsubscribe($id: ID!, $input: SubscriptionInput!) {
    entityUnsubscribe(id: $id, input: $input)
  }
`;
