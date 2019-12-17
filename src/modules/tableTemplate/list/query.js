import gql from 'graphql-tag';
import {
  tableTemplateFragment,
  userAvatarFragment,
  badRequestFragment,
  forbiddenFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const tableTemplateQuery = gql`
  query tableTemplateQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: MaskEditFilterInput
    $sortBy: MaskEditSortInput
  ) {
    maskEdits(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...tableTemplateFragment
        ...forbiddenFragment
        ...badRequestFragment
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }

  ${userAvatarFragment}
  ${tableTemplateFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const allCustomFieldDefinitionsQuery = gql`
  query allCustomFieldDefinitionsQuery {
    orderCustomFields: fieldDefinitions(entityType: Order) {
      ...fieldDefinitionFragment
    }
    orderItemCustomFields: fieldDefinitions(entityType: OrderItem) {
      ...fieldDefinitionFragment
    }
    batchCustomFields: fieldDefinitions(entityType: Batch) {
      ...fieldDefinitionFragment
    }
    shipmentCustomFields: fieldDefinitions(entityType: Shipment) {
      ...fieldDefinitionFragment
    }
    productCustomFields: fieldDefinitions(entityType: Product) {
      ...fieldDefinitionFragment
    }
  }

  ${fieldDefinitionFragment}
`;

export default tableTemplateQuery;
