// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Label, ToggleInput } from 'components/Form';
import { StatusStyle } from './style';

type Props = {
  value: boolean,
  readonly: boolean,
  onChange: boolean => void,
};

const Archived = ({ value, readonly, onChange }: Props) => {
  return (
    <>
      <Label height="30px">Status</Label>

      <div className={StatusStyle(value)}>
        <ToggleInput
          toggled={!value}
          editable={!readonly}
          onToggle={() => {
            onChange(!value);
          }}
        />

        <Icon icon={value ? 'ARCHIVE' : 'ACTIVE'} />

        {value ? (
          <FormattedMessage id="components.form.archived" defaultMessage="Archived" />
        ) : (
          <FormattedMessage id="components.form.active" defaultMessage="Active" />
        )}
      </div>
    </>
  );
};

export default Archived;
