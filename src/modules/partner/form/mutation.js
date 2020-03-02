// @flow
import gql from 'graphql-tag';
import {
  partnerFormFragment,
  userAvatarFragment,
  tagFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';
import { parseArrayOfIdsField } from 'utils/data';

export const partnerUpdateMutation = gql`
  mutation partnerUpdate($id: ID!, $input: PartnerUpdateInput!) {
    partnerUpdate(id: $id, input: $input) {
      ...partnerFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${partnerFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedPartnerInput = (originalValues: ?Object, newValues: Object): Object => ({
  ...parseArrayOfIdsField('tagIds', originalValues?.tags ?? [], newValues.tags),
});
