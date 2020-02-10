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
  milestoneCardFragment,
  partnerNameFragment,
  priceFragment,
  tagFragment,
  metricFragment,
  portFragment,
  timelineDateMinimalFragment,
  imageFragment,
  productProviderPackagingFragment,
  sizeFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';
import {
  parseParentIdField,
  parseEnumField,
  parseMemoField,
  parseArrayOfIdsField,
} from 'utils/data';

// TODO: Match API
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

export const prepareParsedDocumentInput = (originalValues: ?Object, newValues: Object): Object => {
  return {
    ...parseEnumField('type', originalValues?.type, newValues.type),
    ...parseEnumField('status', originalValues?.status, newValues.status),
    ...parseParentIdField('entityId', originalValues?.entity, newValues.entity),
    ...parseMemoField('memo', originalValues?.memo, newValues.memo),
    ...parseArrayOfIdsField('tagIds', originalValues?.tags ?? [], newValues.tags),
  };
};
