import gql from 'graphql-tag';
import {
  documentFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  userAvatarFragment,
  forbiddenFragment,
  taskWithoutParentInfoFragment,
  milestoneCardFragment,
  projectCardFragment,
} from 'graphql';
import { sheetWarehouseFragment, sheetMaskFragment } from './fragment';

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
      ...sheetWarehouseFragment
    }
  }

  ${sheetWarehouseFragment}
`;

export const tagsByIDsQuery = gql`
  query tagsByIDsQuery($ids: [ID!]!) {
    tagsByIDs(ids: $ids) {
      ...tagFragment
      ...forbiddenFragment
    }
  }

  ${tagFragment}
  ${forbiddenFragment}
`;

export const filesByIDsQuery = gql`
  query filesByIDsQuery($ids: [ID!]!) {
    filesByIDs(ids: $ids) {
      ...documentFragment
    }
  }

  ${documentFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export const maskByIDQuery = gql`
  query maskByIDQuery($id: ID!) {
    mask(id: $id) {
      ...sheetMaskFragment
    }
  }

  ${sheetMaskFragment}
`;

export const taskByIDQuery = gql`
  query taskByIDQuery($id: ID!) {
    task(id: $id) {
      ...taskWithoutParentInfoFragment
    }
  }

  ${taskWithoutParentInfoFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;
