// @flow
import * as React from 'react';
import { FieldItem, Label, TagsInput } from 'components/Form';
import { TagsWrapperStyle } from './style';

export default function Tags() {
  const isFocused = false;

  return (
    <div className={TagsWrapperStyle}>
      <FieldItem
        vertical
        label={<Label>TAGS</Label>}
        input={<TagsInput isFocused={isFocused} tagType="Order" />}
      />
    </div>
  );
}
