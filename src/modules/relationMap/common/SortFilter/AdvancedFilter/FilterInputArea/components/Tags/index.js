// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, TagsInput } from 'components/Form';
import { TagsWrapperStyle } from './style';
import messages from '../messages';

export default function Tags() {
  const isFocused = false;

  return (
    <div className={TagsWrapperStyle}>
      <FieldItem
        vertical
        label={<Label><FormattedMessage {...messages.tags} /></Label>}
        input={<TagsInput isFocused={isFocused} tagType="Order" />}
      />
    </div>
  );
}
