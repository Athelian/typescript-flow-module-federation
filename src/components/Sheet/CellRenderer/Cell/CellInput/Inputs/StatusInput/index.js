// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { StatusInputWrapperStyle } from './style';

const StatusInput = ({ value, onChange, readonly }: InputProps<boolean>) => (
  <div className={CellInputWrapperStyle}>
    <div className={StatusInputWrapperStyle(!!value)}>
      <Icon icon={value ? 'ARCHIVE' : 'ACTIVE'} />
      <FormattedMessage id={`components.form.${value ? 'archived' : 'active'}`} />

      <ToggleInput
        toggled={!value}
        editable={!readonly}
        onToggle={() => {
          onChange(!value);
        }}
      />
    </div>
  </div>
);

export default StatusInput;
