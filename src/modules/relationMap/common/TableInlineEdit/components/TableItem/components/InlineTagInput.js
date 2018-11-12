// @flow
import * as React from 'react';
import { TagsInput } from 'components/Form';
import { useTagInput } from 'modules/relationMap/common/TableInlineEdit/hooks';
import emitter from 'utils/emitter';

type Props = {
  name: string,
  tagType: string,
  values: Array<Object>,
};

export default function InlineTagInput({ name, tagType, values }: Props) {
  const { onChange } = useTagInput(values);
  return (
    <TagsInput
      editable={false}
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
