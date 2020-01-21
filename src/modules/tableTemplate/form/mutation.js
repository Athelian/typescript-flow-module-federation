// @flow
import gql from 'graphql-tag';
import { badRequestFragment, tableTemplateFragment, userAvatarFragment } from 'graphql';
import { parseGenericField, parseEnumField, parseMemoField } from 'utils/data';

export const maskEditCreateMutation: Object = gql`
  mutation maskEditCreate($input: MaskEditCreateInput!) {
    maskEditCreate(input: $input) {
      ...tableTemplateFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${userAvatarFragment}
  ${tableTemplateFragment}
`;

export const maskEditUpdateMutation: Object = gql`
  mutation maskEditUpdate($id: ID!, $input: MaskEditUpdateInput!) {
    maskEditUpdate(id: $id, input: $input) {
      ...tableTemplateFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${userAvatarFragment}
  ${tableTemplateFragment}
`;

export const prepareParsedMaskEditInput = (originalValues: ?Object, newValues: Object): Object => {
  return {
    ...parseGenericField('name', originalValues?.name, newValues.name),
    ...parseEnumField('type', originalValues?.type, newValues.type),
    ...parseMemoField('memo', originalValues?.memo, newValues.memo),
    ...parseGenericField(
      'columns',
      (originalValues?.columns ?? []).map(({ key, hidden }) => ({ key, hidden: !!hidden })),
      newValues.columns.map(({ key, hidden }) => ({ key, hidden: !!hidden }))
    ),
    fields: [],
  };
};
