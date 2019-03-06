// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, TagsInput } from 'components/Form';
import { TagsWrapperStyle } from './style';
import messages from '../messages';

type Props = {
  values: any,
  onChange: Function,
  tagType: string,
};
export default function Tags({ values, onChange, tagType }: Props) {
  const isFocused = false;

  return (
    <div className={TagsWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.tags} />
          </Label>
        }
        input={
          <TagsInput
            editable={{
              set: true,
              remove: true,
            }}
            isFocused={isFocused}
            tagType={tagType}
            name={tagType}
            values={values}
            onChange={onChange}
          />
        }
      />
    </div>
  );
}
