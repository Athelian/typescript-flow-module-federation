// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
  tagFragment,
  partnerNameFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskFormInTemplateFragment,
} from 'graphql';
import {
  batchSheetFragment,
  containerSheetFragment,
  orderItemSheetFragment,
  shipmentSheetFragment,
  timelineDateFragment,
  warehouseFragment,
} from './fragment';

export const orderItemByIDQuery = gql`
  query orderItemByIDQuery($id: ID!) {
    orderItem(id: $id) {
      ...orderItemSheetFragment
      ... on OrderItem {
        sort
        order {
          ... on Order {
            id
          }
        }
        batches {
          ...batchSheetFragment
          ... on Batch {
            container {
              ...containerSheetFragment
            }
            shipment {
              ...shipmentSheetFragment
            }
          }
        }
      }
    }
  }

  ${orderItemSheetFragment}
  ${batchSheetFragment}
  ${shipmentSheetFragment}
  ${containerSheetFragment}
  ${partnerNameFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${warehouseFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const batchByIDQuery = gql`
  query batchByIDQuery($id: ID!) {
    batch(id: $id) {
      ...batchSheetFragment
      ... on Batch {
        sort
        orderItem {
          ... on OrderItem {
            id
            order {
              ... on Order {
                id
              }
            }
          }
        }
        container {
          ...containerSheetFragment
        }
        shipment {
          ...shipmentSheetFragment
        }
      }
    }
  }

  ${batchSheetFragment}
  ${shipmentSheetFragment}
  ${containerSheetFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${partnerNameFragment}
  ${warehouseFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const batchQuantityRevisionByIDQuery = gql`
  query batchQuantityRevisionByIDQuery($id: ID!) {
    batchQuantityRevision(id: $id) {
      ... on BatchQuantityRevision {
        id
        quantity
        type
        sort
        batch {
          ... on Batch {
            id
          }
        }
      }
    }
  }
`;

export const containerByIDQuery = gql`
  query containerByIDQuery($id: ID!) {
    container(id: $id) {
      ...containerSheetFragment
    }
  }

  ${containerSheetFragment}
  ${userAvatarFragment}
  ${warehouseFragment}
  ${tagFragment}
`;

export const shipmentByIDQuery = gql`
  query shipmentByIDQuery($id: ID!) {
    shipment(id: $id) {
      ...shipmentSheetFragment
    }
  }

  ${shipmentSheetFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${partnerNameFragment}
  ${warehouseFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const userByIDQuery = gql`
  query userByIDQuery($id: ID!) {
    user(id: $id) {
      ...userAvatarFragment
    }
  }

  ${userAvatarFragment}
`;

export const usersByIDsQuery = gql`
  query usersByIDsQuery($ids: [ID!]!) {
    usersByIDs(ids: $ids) {
      ...userAvatarFragment
    }
  }

  ${userAvatarFragment}
`;

export const organizationByIDQuery = gql`
  query organizationByIDQuery($id: ID!) {
    organization(id: $id) {
      ...partnerNameFragment
    }
  }

  ${partnerNameFragment}
`;

export const organizationsByIDsQuery = gql`
  query organizationsByIDsQuery($ids: [ID!]!) {
    organizationsByIDs(ids: $ids) {
      ...partnerNameFragment
    }
  }

  ${partnerNameFragment}
`;

export const warehouseByIDQuery = gql`
  query warehouseByIDQuery($id: ID!) {
    warehouse(id: $id) {
      ...warehouseFragment
    }
  }

  ${warehouseFragment}
`;

export const tagsByIDsQuery = gql`
  query tagsByIDsQuery($ids: [ID!]!) {
    tagsByIDs(ids: $ids) {
      ...tagFragment
    }
  }

  ${tagFragment}
`;
