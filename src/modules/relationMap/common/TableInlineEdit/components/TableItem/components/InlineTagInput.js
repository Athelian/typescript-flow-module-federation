// @flow
import * as React from 'react';
import { TagsInput } from 'components/Form';
import { useTagInput } from 'modules/form/hooks';
import emitter from 'utils/emitter';

type Props = {
  name: string,
  tagType: string,
  id: string,
  values: Array<Object>,
};

export default function InlineTagInput({ name, tagType, values, id }: Props) {
  const { onChange } = useTagInput(values);
  return (
    <TagsInput
      id={`input-${id}`}
      name={name}
      tagType={tagType}
      values={values}
      onChange={(field, value) => {
        onChange(value);
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value,
        });
      }}
    />
  );
}
