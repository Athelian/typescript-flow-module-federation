// @flow
import * as React from 'react';
import { FieldItem, Label, DefaultStyle, DateInput } from 'components/Form';
import { DateRangeWrapperStyle } from './style';

export default function DateRange() {
  const isFocused = false;

  return (
    <div className={DateRangeWrapperStyle}>
      <FieldItem
        vertical
        label={<Label>FROM</Label>}
        input={
          <DefaultStyle type="date" isFocused={isFocused} forceHoverStyle>
            {/* <DateInput align="left" name={name} {...rest} /> */}
            <DateInput align="left" />
          </DefaultStyle>
        }
      />
      <FieldItem
        vertical
        label={<Label>TO</Label>}
        input={
          <DefaultStyle type="date" isFocused={isFocused} forceHoverStyle>
            {/* <DateInput align="left" name={name} {...rest} /> */}
            <DateInput align="left" />
          </DefaultStyle>
        }
      />
    </div>
  );
}
