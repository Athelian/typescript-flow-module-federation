// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, DefaultStyle, DateInput } from 'components/Form';
import { DateRangeWrapperStyle } from './style';
import messages from './messages';

export default function DateRange() {
  return (
    <div className={DateRangeWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.from} />
          </Label>
        }
        input={
          <DefaultStyle type="date" forceHoverStyle>
            <DateInput align="left" />
          </DefaultStyle>
        }
      />
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.to} />
          </Label>
        }
        input={
          <DefaultStyle type="date" forceHoverStyle>
            <DateInput align="left" />
          </DefaultStyle>
        }
      />
    </div>
  );
}
