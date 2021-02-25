// @flow
import gql from 'graphql-tag';
import {
  documentFormFragment,
  userAvatarFragment,
  ownedByFragment,
  orderCardFragment,
  itemCardFragment,
  shipmentCardFragment,
  productProviderCardFragment,
  documentFragment,
  milestoneCardFragment,
  partnerNameFragment,
  priceFragment,
  tagFragment,
  taskCountFragment,
  metricFragment,
  portFragment,
  timelineDateMinimalFragment,
  imageFragment,
  productProviderPackagingFragment,
  sizeFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';
import { parseEnumField, parseMemoField, parseArrayOfIdsField } from 'utils/data';
import { toLowerFirst } from 'utils/string';

export const documentUpdateMutation: Object = gql`
  mutation documentUpdate($id: ID!, $input: FileInput!) {
    fileUpdate(id: $id, input: $input) {
      ...documentFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${documentFormFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${orderCardFragment}
  ${itemCardFragment}
  ${shipmentCardFragment}
  ${productProviderCardFragment}
  ${milestoneCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${tagFragment}
  ${metricFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${imageFragment}
  ${productProviderPackagingFragment}
  ${sizeFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const documentUpdateShipmentMutation: Object = gql`
  mutation shipmentUpdate($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentUpdate(id: $id, input: $input) {
      ...shipmentCardFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${shipmentCardFragment}
  ${metricFragment}
  ${userAvatarFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const documentUpdateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderCardFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${orderCardFragment}
  ${priceFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const documentUpdateOrderItemMutation = gql`
  mutation orderItemUpdate($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemUpdate(id: $id, input: $input) {
      ...itemCardFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${itemCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const documentUpdateProductMutation: Object = gql`
  mutation productUpdate($id: ID!, $input: ProductUpdateInput!) {
    productUpdate(id: $id, input: $input) {
      ... on Product {
        id
        productProviders {
          ... on ProductProvider {
            id
            name
            archived
            updatedAt
            updatedBy {
              ...userAvatarFragment
            }
            memo
            files {
              ...documentFragment
              ...forbiddenFragment
            }
          }
        }
      }
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${userAvatarFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const documentUpdateProjectMutation = gql`
  mutation projectUpdate($id: ID!, $input: ProjectUpdateInput!) {
    projectUpdate(id: $id, input: $input) {
      ... on Project {
        milestones {
          ... on Milestone {
            ...milestoneCardFragment
          }
        }
      }
      ...forbiddenFragment
      ...badRequestFragment
    }
  }
  ${milestoneCardFragment}

  ${taskCountFragment}
  ${ownedByFragment}

  ${ownedByFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedDocumentInput = (originalValues: ?Object, newValues: Object): Object => {
  // entity id is not used but may need in future
  return {
    ...parseEnumField('type', originalValues?.type, newValues.type),
    // ...parseParentIdField('entityId', originalValues?.entity, newValues.entity),
    ...parseMemoField('memo', originalValues?.memo, newValues.memo),
    ...parseArrayOfIdsField('tagIds', originalValues?.tags ?? [], newValues.tags),
  };
};

export const prepareParsedDocumentParentInput = (
  newValues: Object,
  originalEntity: Object // the original unchanged entity
): Object => {
  const loweredTypename = toLowerFirst(newValues?.entity?.__typename);

  const entity = newValues[loweredTypename];

  if (!entity) {
    return null;
  }

  let input = {};

  switch (newValues?.entity?.__typename) {
    case 'Milestone': {
      const newFiles = newValues.milestone.files.map(file => {
        return {
          id: file.id,
          name: file.name,
          type: file.type,
        };
      });

      input = {
        id: originalEntity.project.id,
        input: {
          milestones: originalEntity.project.milestones.map(_milestone => {
            if (_milestone.id === newValues.milestone.id) {
              const oldMilestoneFiles = _milestone.files.map(file => ({
                id: file.id,
              }));

              return {
                id: _milestone.id,
                dueDate: _milestone.dueDate,
                files: [...newFiles, ...oldMilestoneFiles],
                tasks: _milestone.tasks.map(task => ({ id: task.id })),
              };
            }

            return { id: _milestone.id };
          }),
        },
      };

      break;
    }
    case 'ProductProvider': {
      const newFiles = newValues.productProvider.files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
      }));

      input = {
        id: originalEntity.product.id, // product id
        input: {
          productProviders: originalEntity.product.productProviders.map(productProvider => {
            if (productProvider.id === newValues.productProvider.id) {
              const oldProductProviderFiles = productProvider.files.map(file => ({
                id: file.id,
              }));

              return {
                id: productProvider.id,
                files: [...oldProductProviderFiles, ...newFiles],
              };
            }

            return {
              id: productProvider.id,
            };
          }),
        },
      };
      break;
    }
    default: {
      const oldFiles = originalEntity[loweredTypename].files.map(file => ({
        id: file.id,
      }));

      const newFiles = entity.files.map(file => {
        return {
          id: file.id,
          name: file.name,
          type: file.type,
        };
      });

      input = {
        id: entity.id,
        input: {
          files: [...oldFiles, ...newFiles],
        },
      };
    }
  }

  return input;
};
