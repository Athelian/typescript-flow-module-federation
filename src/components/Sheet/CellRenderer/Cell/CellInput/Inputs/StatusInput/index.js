// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';
import { StatusInputWrapperStyle } from './style';

const StatusInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<boolean>) => {
  return (
    <InputWrapper focus={focus}>
      {({ ref }) => (
        <div className={StatusInputWrapperStyle(value)}>
          <Icon icon={value ? 'ARCHIVE' : 'ACTIVE'} />
          <FormattedMessage id={`components.form.${value ? 'archived' : 'active'}`} />

          <ToggleInput
            inputRef={ref}
            toggled={!value}
            editable={!readonly}
            onToggle={() => {
              onChange(!value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </InputWrapper>
  );
};

export default StatusInput;
