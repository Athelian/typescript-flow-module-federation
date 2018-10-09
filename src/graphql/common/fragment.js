// @flow
import gql from 'graphql-tag';

export const metricFragment = gql`
  fragment metricFragment on MetricValue {
    value
    metric
  }
`;

/*
import { metricFragment } from 'graphql';

${metricFragment}
*/
export const sizeFragment = gql`
  fragment sizeFragment on Size {
    length {
      ...metricFragment
    }
    width {
      ...metricFragment
    }
    height {
      ...metricFragment
    }
  }
`;

export const priceFragment = gql`
  fragment priceFragment on Price {
    amount
    currency
  }
`;

export const tagFragment = gql`
  fragment tagFragment on Tag {
    id
    name
    color
  }
`;

export const filesFragment = gql`
  fragment filesFragment on File {
    id
    path
  }
`;

export const userAvatarFragment = gql`
  fragment userAvatarFragment on User {
    id
    firstName
    lastName
  }
`;

export const partnerNameFragment = gql`
  fragment partnerNameFragment on Group {
    id
    name
  }
`;

/*
import { userAvatarFragment } from 'graphql';

${userAvatarFragment}
*/
export const timelineDateFullFragment = gql`
  fragment timelineDateFullFragment on TimelineDate {
    id
    date
    assignedTo {
      ...userAvatarFragment
    }
    approvedBy {
      ...userAvatarFragment
    }
    approvedAt
    timelineDateRevisions {
      id
      date
      type
      memo
      updatedAt
      updatedBy {
        ...userAvatarFragment
      }
    }
  }
`;

export const timelineDateMinimalFragment = gql`
  fragment timelineDateMinimalFragment on TimelineDate {
    id
    date
    approvedAt
    timelineDateRevisions {
      id
      date
    }
  }
`;

export const portFragment = gql`
  fragment portFragment on Port {
    seaport
    airport
  }
`;
