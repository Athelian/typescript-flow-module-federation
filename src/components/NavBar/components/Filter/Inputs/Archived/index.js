// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Label, ToggleInput } from 'components/Form';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { StatusStyle } from './style';

const Archived = ({ value, readonly, onChange }: FilterInputProps<boolean>) => {
  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.status} />
      </Label>

      <div className={StatusStyle(value)}>
        <ToggleInput
          toggled={!value}
          editable={!readonly}
          onToggle={() => {
            onChange(!value);
          }}
        />

        <Icon icon={value ? 'ARCHIVE' : 'ACTIVE'} />

        <span>
          {value ? (
            <FormattedMessage {...messages.archived} />
          ) : (
            <FormattedMessage {...messages.active} />
          )}
        </span>
      </div>
    </>
  );
};

export default Archived;
