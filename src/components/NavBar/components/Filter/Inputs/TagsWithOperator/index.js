// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Label, TagsInput } from 'components/Form';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { TAG_LIST } from 'modules/permission/constants/tag';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { tagsByIDsQuery } from './query';

type ImplProps = {
  ...FilterInputProps<{
    operator: string,
    ids: Array<string>,
  }>,
  tagType: string,
};

const TagsImpl = ({ value, readonly, onChange, tagType }: ImplProps) => {
  const hasPermissions = useViewerHasPermissions();
  const { data } = useQuery(tagsByIDsQuery, {
    variables: { ids: value.ids },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.tags} />
        <label>
          <input
            name={`tags-operator-${tagType}`}
            type="radio"
            value="AND"
            checked={value.operator === 'AND'}
            onChange={() => onChange({ ...value, operator: 'AND' })}
          />
          AND
        </label>
        <label>
          <input
            name={`tags-operator-${tagType}`}
            type="radio"
            value="OR"
            checked={value.operator === 'OR'}
            onChange={() => onChange({ ...value, operator: 'OR' })}
          />
          OR
        </label>
      </Label>

      <TagsInput
        name="tags"
        width="200px"
        tagType={tagType}
        disabled={readonly}
        values={data?.tagsByIDs ?? []}
        onChange={newTags => {
          onChange({ ...value, ids: newTags.map(t => t.id) });
        }}
        onClickRemove={removedTag => {
          onChange({ ...value, ids: value.ids.filter(id => id !== removedTag.id) });
        }}
        editable={{
          set: hasPermissions(TAG_LIST),
          remove: true,
        }}
      />
    </>
  );
};

const TagsWithOperator = (tagType: string) => ({
  value,
  onChange,
  readonly,
}: FilterInputProps<{
  operator: string,
  ids: Array<string>,
}>) => <TagsImpl value={value} readonly={readonly} onChange={onChange} tagType={tagType} />;

export const ShipmentTagsWithOperator = TagsWithOperator('Shipment');

export default TagsWithOperator;
