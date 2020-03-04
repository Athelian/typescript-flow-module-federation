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
    size
    memo
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    # TODO: move to common fragment for entity
    entity {
      ... on Model {
        id
      }
      ... on Owned {
        ownedBy {
          ...ownedByFragment
        }
      }
      ... on Order {
        poNo
      }
      ... on OrderItem {
        no
      }
      ... on Shipment {
        no
      }
      ... on Batch {
        no
      }
      ... on Product {
        name
      }
      ... on ProductProvider {
        name
        product {
          ... on Product {
            id
            name
          }
        }
      }
      ... on Milestone {
        name
        project {
          ... on Project {
            id
          }
        }
      }
    }
  }
`;

export const userAvatarFragment = gql`
  fragment userAvatarFragment on User {
    id
    firstName
    lastName
    organization {
      ... on Organization {
        id
        name
      }
    }
  }
`;

export const partnerNameFragment = gql`
  fragment partnerNameFragment on Organization {
    id
    name
    types
    partner {
      ... on Partner {
        id
        name
        code
      }
    }
  }
`;

export const timelineDateFullFragment = gql`
  fragment timelineDateFullFragment on TimelineDate {
    id
    date
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
    approvedBy {
      ...userAvatarFragment
    }
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
  fragment ownedByFragment on Organization {
    id
    name
  }
`;
