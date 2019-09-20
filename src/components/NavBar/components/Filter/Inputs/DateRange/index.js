// @flow
import * as React from 'react';
import { Label, DateInput, DefaultStyle } from 'components/Form';

type Props = {
  value: { after: Date | null, before: Date | null },
  readonly: boolean,
  onChange: boolean => void,
};

const DateRange = ({ value, readonly, onChange }: Props) => {
  return (
    <>
      <Label height="30px">From</Label>
      <DefaultStyle>
        <DateInput
          value={value.after}
          onChange={e => {
            onChange({ ...value, after: e.target.value ? new Date(e.target.value) : null });
          }}
          readOnly={readonly}
        />
      </DefaultStyle>

      <Label height="30px">To</Label>
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
