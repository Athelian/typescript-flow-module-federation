// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Label, RadioInput, TagsInput } from 'components/Form';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { reduceTagsByName } from 'utils/tags';
import { TAG_GET } from 'modules/permission/constants/tag';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { tagsByIDsQuery } from './query';
import { OperatorWrapperStyle } from './style';

type ImplProps = {
  ...FilterInputProps<{
    operator: string,
    ids: Array<string>,
    integratedIds: Array<Array<string>>,
  }>,
  tagType: string,
};

const TagsImpl = ({ value, readonly, onChange, tagType }: ImplProps) => {
  const hasPermissions = useViewerHasPermissions();
  const { data } = useQuery(tagsByIDsQuery, {
    variables: { ids: [...new Set([...value.ids, ...(value?.integratedIds?.flat() ?? [])])] },
    fetchPolicy: 'cache-and-network',
  });

  const tags = React.useMemo(() => {
    return Object.values(reduceTagsByName(data?.tagsByIDs ?? []));
  }, [data]);

  return (
    <>
      <Label height="30px">
        <div className={OperatorWrapperStyle}>
          <FormattedMessage {...messages.tags} />
          <RadioInput
            onToggle={() => onChange({ ...value, operator: 'AND' })}
            editable
            selected={value.operator === 'AND'}
          >
            AND
          </RadioInput>
          <RadioInput
            onToggle={() => onChange({ ...value, operator: 'OR' })}
            editable
            selected={value.operator === 'OR'}
          >
            OR
          </RadioInput>
        </div>
      </Label>

      <TagsInput
        name="tags"
        width="200px"
        includeAllShared
        tagType={tagType}
        disabled={readonly}
        values={tags}
        hasIntegratedTags
        onChange={newTags => {
          const { newIds, newIntegratedIds } = newTags.reduce(
            (arr, newTag) => {
              if (newTag.integratedTags && Object.keys(newTag.integratedTags).length > 1) {
                arr.newIntegratedIds.push(Object.keys(newTag.integratedTags));
              } else {
                arr.newIds.push(newTag.id);
              }

              return arr;
            },
            {
              newIds: [],
              newIntegratedIds: [],
            }
          );
          onChange({ ...value, ids: newIds, integratedIds: newIntegratedIds });
        }}
        onClickRemove={removedTag => {
          const removedTagIntegratedIds = Object.keys(removedTag.integratedTags);
          const isIntegratedId = removedTagIntegratedIds.length > 1;

          let newIds = [...value.ids];
          let newIntegratedIds = [...(value?.integratedIds ?? [])];

          if (isIntegratedId) {
            // only to search for one id
            const [removedId] = removedTagIntegratedIds;
            newIntegratedIds = newIntegratedIds.filter((integratedIds: string[]) => {
              return !integratedIds.includes(removedId);
            });
          } else {
            newIds = newIds.filter(id => id !== removedTag.id);
          }
          onChange({ ...value, ids: newIds, integratedIds: newIntegratedIds });
        }}
        editable={{
          set: hasPermissions(TAG_GET),
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
  integratedIds: Array<Array<string>>,
}>) => <TagsImpl value={value} readonly={readonly} onChange={onChange} tagType={tagType} />;

export const ProductTagsWithOperator = TagsWithOperator('Product');
export const OrderTagsWithOperator = TagsWithOperator('Order');
export const BatchTagsWithOperator = TagsWithOperator('Batch');
export const ShipmentTagsWithOperator = TagsWithOperator('Shipment');
export const ProjectTagsWithOperator = TagsWithOperator('Project');
export const FileTagsWithOperator = TagsWithOperator('File');

export default TagsWithOperator;
