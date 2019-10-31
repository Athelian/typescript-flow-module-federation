// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BaseNumberInput from 'components/Form/Inputs/NumberInput';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';
import { DayInputStyle, DayStyle } from './style';

const DayInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<number>) => (
  <div className={DayInputStyle}>
    <InputWrapper focus={focus} preselect>
      {({ ref }) => (
        <BaseNumberInput
          inputRef={ref}
          value={value}
          tabIndex="-1"
          readOnly={readonly}
          readOnlyHeight="30px"
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )}
    </InputWrapper>
    <span className={DayStyle}>
      <FormattedMessage id="components.inputs.days" defaultMessage="Days" />
    </span>
  </div>
);

export default DayInput;
