// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ToggleInput as BaseToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import { ToggleInputWrapperStyle } from './style';

const ToggleInput = ({ on, off }: { on: React.Node, off: React.Node }) => ({
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
        <div className={ToggleInputWrapperStyle(!!value)}>
          <BaseToggleInput
            inputRef={ref}
            toggled={value}
            editable={!readonly}
            onToggle={() => {
              onChange(!value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          {value ? on : off}
        </div>
      )}
    </InputWrapper>
  );
};

export default {
  Booked: ToggleInput({
    on: <FormattedMessage id="components.sheet.booked" defaultMessage="Booked" />,
    off: <FormattedMessage id="components.sheet.unbooked" defaultMessage="Unbooked" />,
  }),
};
