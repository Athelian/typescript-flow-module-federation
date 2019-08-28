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

export const focusesQuery = gql`
  query focuses($id: ID!, $entities: [EntityInput!]!) {
    focuses(id: $id, entities: $entities) {
      ...focusFragment
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
    focusSubscribe(id: $id, input: $input)
  }
`;

export const focusUnsubscribeAllMutation = gql`
  mutation focusUnsubscribeAll($id: ID!) {
    focusUnsubscribeAll(id: $id)
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
      }
      changes {
        field
        new {
          ... on StringValue {
            string
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

export const entityUnsubscribeAllMutation = gql`
  mutation entityUnsubscribeAll($id: ID!) {
    entityUnsubscribeAll(id: $id)
  }
`;
