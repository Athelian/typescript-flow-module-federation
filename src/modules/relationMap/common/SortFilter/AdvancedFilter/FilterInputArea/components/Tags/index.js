// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, TagsInput } from 'components/Form';
import { TagsWrapperStyle } from './style';
import messages from '../messages';

type Props = {
  tagType: string,
  values: any,
  onChange: Function,
  onClickRemove: Function,
};
export default function Tags({ values, onChange, onClickRemove, tagType }: Props) {
  return (
    <div className={TagsWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label height="30px">
            <FormattedMessage {...messages.tags} />
          </Label>
        }
        input={
          <TagsInput
            editable={{
              set: true,
              remove: true,
            }}
            tagType={tagType}
            name={tagType}
            values={values}
            onChange={onChange}
            onClickRemove={onClickRemove}
          />
        }
      />
    </div>
  );
}
