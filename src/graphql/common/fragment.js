// @flow
import gql from 'graphql-tag';

export const metricFragment = gql`
  fragment metricFragment on MetricValue {
    value
    metric
  }
`;

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

// path = original
export const imageFragment = gql`
  fragment imageFragment on File {
    id
    path
    pathSmall: path(preset: Small)
    pathMedium: path(preset: Medium)
    pathLarge: path(preset: Large)
  }
`;

export const documentFragment = gql`
  fragment documentFragment on File {
    id
    name
    path
    type
    status
    memo
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
      ... on TimelineDateRevision {
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
  }
`;

export const timelineDateMinimalFragment = gql`
  fragment timelineDateMinimalFragment on TimelineDate {
    id
    date
    approvedAt
    timelineDateRevisions {
      ... on TimelineDateRevision {
        id
        date
      }
    }
  }
`;

export const portFragment = gql`
  fragment portFragment on Port {
    seaport
    airport
  }
`;

export const customFieldsFragment = gql`
  fragment customFieldsFragment on CustomFields {
    mask {
      ...maskFragment
    }
    fieldValues {
      ...fieldValuesFragment
    }
    fieldDefinitions {
      ...fieldDefinitionFragment
    }
  }
`;

export const maskFragment = gql`
  fragment maskFragment on Mask {
    id
    name
    memo
    fieldDefinitions {
      ...fieldDefinitionFragment
    }
    entityType
  }
`;

export const fieldValuesFragment = gql`
  fragment fieldValuesFragment on FieldValue {
    value {
      ... on StringValue {
        string
      }
    }
    fieldDefinition {
      ...fieldDefinitionFragment
    }
    entity {
      __typename
    }
  }
`;

export const fieldDefinitionFragment = gql`
  fragment fieldDefinitionFragment on FieldDefinition {
    id
    name
    entityType
    sort
  }
`;

export const ownedByFragment = gql`
  fragment ownedByFragment on Group {
    id
    partner {
      ... on Partner {
        id
      }
    }
    name
  }
`;
