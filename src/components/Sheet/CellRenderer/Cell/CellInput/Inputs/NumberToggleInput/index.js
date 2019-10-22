// @flow
import * as React from 'react';
import NumberInput from 'components/Form/Inputs/NumberInput';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import { WrapperStyle, CalculatorIconStyle } from './style';

type Props = {|
  ...InputProps<number>,
  isEnableToggle: boolean,
  onToggle: Function,
|};

const NumberToggleInput = ({
  value,
  focus,
  onToggle,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
  isEnableToggle,
}: Props) => {
  const readOnlyMode = isEnableToggle || readonly;

  if (readOnlyMode) {
    return (
      <InputWrapper focus={focus} preselect>
        {({ ref }) => (
          <div className={WrapperStyle}>
            <NumberInput
              value={value}
              name="readOnlyNumber"
              tabIndex="-1"
              readOnly
              readOnlyHeight="30px"
            />
            <div className={CalculatorIconStyle}>
              <Icon icon="CALCULATOR" />
            </div>
            <ToggleInput inputRef={ref} toggled={isEnableToggle} onToggle={onToggle} />
          </div>
        )}
      </InputWrapper>
    );
  }

  return (
    <InputWrapper focus={focus} preselect>
      {({ ref }) => (
        <div className={WrapperStyle}>
          <NumberInput
            inputRef={ref}
            value={value}
            name="numberInput"
            tabIndex="-1"
            nullable={false}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          <div className={CalculatorIconStyle}>
            <Icon icon="CALCULATOR" />
          </div>
          <ToggleInput toggled={isEnableToggle} onToggle={onToggle} />
        </div>
      )}
    </InputWrapper>
  );
};
export default NumberToggleInput;
