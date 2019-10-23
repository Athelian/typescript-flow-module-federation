// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Form/Inputs/NumberInput';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import {
  NumberToggleInputWrapperStyle,
  NumberToggleInputReadonlyWrapperStyle,
  ReadonlyWrapperStyle,
  ReadonlyNumberStyle,
  CalculatorIconStyle,
} from './style';

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
      <div className={NumberToggleInputReadonlyWrapperStyle}>
        <div className={ReadonlyWrapperStyle}>
          <div className={ReadonlyNumberStyle}>
            <FormattedNumber value={quantity} />
          </div>

          <div className={CalculatorIconStyle}>
            <Icon icon="CALCULATOR" />
          </div>
        </div>

        <InputWrapper focus={focus}>
          {({ ref }) => (
            <ToggleInput
              inputRef={ref}
              toggled={isEnableToggle}
              onToggle={() => onChange([!isEnableToggle, quantity ? latestQuantity / quantity : 0])}
            />
          )}
        </InputWrapper>
      </div>
    );
  }

  return (
    <div className={NumberToggleInputWrapperStyle}>
      <InputWrapper focus={focus} preselect>
        {({ ref }) => (
          <BaseNumberInput
            inputRef={ref}
            value={quantity}
            name="numberInput"
            nullable={false}
            onChange={e => onChange([isEnableToggle, e.target.value])}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={e => {
              if (e.key === 'Tab' && !e.shiftKey) {
                e.stopPropagation();
              } else if (onKeyDown) {
                onKeyDown(e);
              }
            }}
          />
        )}
      </InputWrapper>

      <div className={CalculatorIconStyle}>
        <Icon icon="CALCULATOR" />
      </div>

      <ToggleInput
        toggled={isEnableToggle}
        onToggle={() => onChange([!isEnableToggle, quantity])}
      />
    </div>
  );
};
export default NumberToggleInput;
