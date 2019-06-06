// @flow
import gql from 'graphql-tag';
import { fieldDefinitionFragment } from 'graphql';

export const allFieldDefinitionsQuery = gql`
  query allFieldDefinitionsQuery {
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
  }

  ${fieldDefinitionFragment}
`;

export default allFieldDefinitionsQuery;
