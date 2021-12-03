// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskFormInTemplateFragment,
} from 'graphql';

export const orderTasksQuery = gql`
  query ordersByIDs($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ... on Order {
        todo {
          tasks {
            ...taskWithoutParentInfoFragment
            __typename
          }
          taskTemplate {
            ...taskTemplateCardFragment
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
`;

export const orderItemTasksQuery = gql`
  query orderItemsByIDs($ids: [ID!]!) {
    orderItemsByIDs(ids: $ids) {
      ... on OrderItem {
        todo {
          tasks {
            ...taskWithoutParentInfoFragment
            __typename
          }
          taskTemplate {
            ...taskTemplateCardFragment
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
`;

export const batchTasksQuery = gql`
  query batchesByIDs($ids: [ID!]!) {
    batchesByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Batch {
        no
        todo {
          tasks {
            ...taskWithoutParentInfoFragment
            __typename
          }
          taskTemplate {
            ...taskTemplateCardFragment
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
`;

export const shipmentTasksQuery = gql`
  query shipmentsByIDs($ids: [ID!]!) {
    shipmentsByIDs(ids: $ids) {
      ... on Shipment {
        id
        todo {
          tasks {
            ...taskWithoutParentInfoFragment
            __typename
          }
          taskTemplate {
            ...taskTemplateCardFragment
            __typename
          }
          __typename
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
`;
