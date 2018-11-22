// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, DefaultPriceStyle, NumberInput } from 'components/Form';
import { DayRangeWrapperStyle } from './style';
import messages from '../messages';

export default function DayRange() {
  return (
    <div className={DayRangeWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.min} />
          </Label>
        }
        input={
          <DefaultPriceStyle
            type="number"
            forceHoverStyle
            currency={<FormattedMessage {...messages.days} />}
          >
            <NumberInput align="left" />
          </DefaultPriceStyle>
        }
      />
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.max} />
          </Label>
        }
        input={
          <DefaultPriceStyle
            type="number"
            forceHoverStyle
            currency={<FormattedMessage {...messages.days} />}
          >
            <NumberInput align="left" />
          </DefaultPriceStyle>
        }
      />
    </div>
  );
}
