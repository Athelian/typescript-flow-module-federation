// @flow
import gql from 'graphql-tag';
import { fieldDefinitionFragment } from 'graphql';

export const allCustomFieldDefinitionsQuery = gql`
  query allCustomFieldDefinitionsQuery {
    order: fieldDefinitions(entityType: Order) {
      ...fieldDefinitionFragment
    }

    orderItem: fieldDefinitions(entityType: OrderItem) {
      ...fieldDefinitionFragment
    }

    batch: fieldDefinitions(entityType: Batch) {
      ...fieldDefinitionFragment
    }

    shipment: fieldDefinitions(entityType: Shipment) {
      ...fieldDefinitionFragment
    }

    product: fieldDefinitions(entityType: Product) {
      ...fieldDefinitionFragment
    }
  }

  ${fieldDefinitionFragment}
`;

export default allCustomFieldDefinitionsQuery;
