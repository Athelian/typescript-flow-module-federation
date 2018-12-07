// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, DefaultStyle, DateInput } from 'components/Form';
import { DateRangeWrapperStyle } from './style';
import messages from '../messages';

type Props = {
  onChangeFromDate: Function,
  onChangeToDate: Function,
  fromDate?: Date,
  toDate?: Date,
};
const defaultProps = {
  onChangeFromDate: () => {},
  onChangeToDate: () => {},
};
function DateRange({ onChangeFromDate, onChangeToDate, fromDate, toDate }: Props) {
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
            <DateInput align="left" onChange={onChangeFromDate} value={fromDate} />
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
            <DateInput align="left" onChange={onChangeToDate} value={toDate} />
          </DefaultStyle>
        }
      />
    </div>
  );
}

DateRange.defaultProps = defaultProps;
export default DateRange;
