// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, DateInput, DefaultStyle } from 'components/Form';
import type { FilterInputProps } from '../../types';
import messages from '../../messages';

const DateRange = ({
  value,
  readonly,
  onChange,
}: FilterInputProps<{ after: Date | null, before: Date | null }>) => {
  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.from} />
      </Label>
      <DefaultStyle>
        <DateInput
          value={value.after}
          onChange={e => {
            onChange({ ...value, after: e.target.value ? new Date(e.target.value) : null });
          }}
          readOnly={readonly}
        />
      </DefaultStyle>

      <Label height="30px">
        <FormattedMessage {...messages.to} />
      </Label>
      <DefaultStyle>
        <DateInput
          value={value.before}
          onChange={e => {
            onChange({ ...value, before: e.target.value ? new Date(e.target.value) : null });
          }}
          readOnly={readonly}
        />
      </DefaultStyle>
    </>
  );
};

export default DateRange;
