// @flow
import * as React from 'react';
import { TagsInput } from 'components/Form';
import { useTagInput } from 'modules/form/hooks';
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
  const { onChange } = useTagInput(values);
  return (
    <TagsInput
      id={`input-${id}`}
      name={name}
      editable={editable}
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
