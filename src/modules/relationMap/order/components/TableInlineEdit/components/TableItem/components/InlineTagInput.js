// @flow
import * as React from 'react';
import { TagsInput } from 'components/Form';
import { useTagsInput } from 'modules/form/hooks';
import emitter from 'utils/emitter';

type OptionalProps = {
  editable: {
    set: boolean,
    remove: boolean,
  },
};

type Props = OptionalProps & {
  name: string,
  tagType: string,
  id: string,
  values: Array<Object>,
};

export default function InlineTagInput({ name, tagType, values, id, editable }: Props) {
  const { tags, onChange } = useTagsInput(values);
  return (
    <TagsInput
      id={`input-${id}`}
      name={name}
      editable={editable}
      tagType={tagType}
      values={tags}
      onChange={value => {
        onChange(value);
      }}
      onClickRemove={value => {
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value: tags.filter(tag => tag.id !== value.id),
        });
      }}
      onBlur={() => {
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value: tags,
        });
      }}
      width="200px"
    />
  );
}
