// @flow
import gql from 'graphql-tag';
import { badRequestFragment, documentFormFragment, userAvatarFragment } from 'graphql';
import { parseParentIdField, parseEnumField, parseMemoField } from 'utils/data';

// TODO: Match API
export const documentUpdateMutation: Object = gql`
  mutation documentUpdate($id: ID!, $input: DocumentUpdateInput!) {
    documentUpdate(id: $id, input: $input) {
      ...documentFormFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${userAvatarFragment}
  ${documentFormFragment}
`;

export const prepareParsedDocumentInput = (originalValues: ?Object, newValues: Object): Object => {
  return {
    ...parseEnumField('type', originalValues?.type, newValues.type),
    ...parseEnumField('status', originalValues?.status, newValues.status),
    ...parseParentIdField('entityId', originalValues?.entity, newValues.entity),
    ...parseMemoField('memo', originalValues?.memo, newValues.memo),
  };
};
