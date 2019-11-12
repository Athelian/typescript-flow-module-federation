// @flow
import gql from 'graphql-tag';

export const sheetModelFragment = gql`
  fragment sheetModelFragment on Model {
    id
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
  }
`;

export const sheetOwnedFragment = gql`
  fragment sheetOwnedFragment on Owned {
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const sheetCustomizableFragment = gql`
  fragment sheetCustomizableFragment on Customizable {
    customFields {
      mask {
        ... on Mask {
          fieldDefinitions {
            ... on FieldDefinition {
              id
            }
          }
        }
      }
      fieldValues {
        ... on FieldValue {
          value {
            ... on StringValue {
              string
            }
          }
          fieldDefinition {
            ... on FieldDefinition {
              id
            }
          }
        }
      }
    }
  }
`;

export const sheetWarehouseFragment = gql`
  fragment sheetWarehouseFragment on Warehouse {
    id
    name
  }
`;
