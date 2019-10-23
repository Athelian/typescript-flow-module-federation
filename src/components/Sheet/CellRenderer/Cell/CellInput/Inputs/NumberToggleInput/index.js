// @flow
import * as React from 'react';
import NumberInput from 'components/Form/Inputs/NumberInput';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import { WrapperStyle, CalculatorIconStyle } from './style';

type Props = {
  ...InputProps<number>,
  value: [boolean, number, number],
  onChange: ([boolean, number]) => void,
};

const NumberToggleInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: Props) => {
  const isEnableToggle = value?.[0] ?? false;
  const quantity = value?.[1] ?? 0;
  const latestQuantity = value?.[2] ?? 0;
  const readOnlyMode = isEnableToggle || readonly;

  if (readOnlyMode) {
    return (
      <InputWrapper focus={focus}>
        {({ ref }) => (
          <div className={WrapperStyle}>
            <NumberInput
              value={quantity}
              name="readOnlyNumber"
              tabIndex="-1"
              readOnly
              readOnlyHeight="25px"
              readOnlyWidth="100%"
            />
            <div className={CalculatorIconStyle}>
              <Icon icon="CALCULATOR" />
            </div>
            <ToggleInput
              inputRef={ref}
              toggled={isEnableToggle}
              onToggle={() => onChange([!isEnableToggle, quantity ? latestQuantity / quantity : 0])}
            />
          </div>
        )}
      </InputWrapper>
    );
  }

  // TODO: style coloring for disable, ready only base on figma
  return (
    <InputWrapper focus={focus} preselect>
      {({ ref }) => (
        <div className={WrapperStyle}>
          <NumberInput
            inputRef={ref}
            value={quantity}
            name="numberInput"
            tabIndex="-1"
            nullable={false}
            onChange={e => onChange([isEnableToggle, e.target.value])}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          <div className={CalculatorIconStyle}>
            <Icon icon="CALCULATOR" />
          </div>
          <ToggleInput
            toggled={isEnableToggle}
            onToggle={() => onChange([!isEnableToggle, quantity])}
          />
        </div>
      )}
    </InputWrapper>
  );
};
export default NumberToggleInput;
