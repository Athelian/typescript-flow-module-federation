// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, DateInput, DefaultStyle } from 'components/Form';
import messages from '../../messages';

type Props = {
  value: { after: Date | null, before: Date | null },
  readonly: boolean,
  onChange: ({ after: Date | null, before: Date | null }) => void,
};

const DateRange = ({ value, readonly, onChange }: Props) => {
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
