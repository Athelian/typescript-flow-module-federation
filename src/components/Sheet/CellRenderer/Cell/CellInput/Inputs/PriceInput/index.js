// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Form/Inputs/NumberInput';
import InputWrapper from '../InputWrapper';

type Props = {
  value: {
    value: number,
    metric: string,
  },
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const PriceInput = ({
  value: price,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: Props) => {
  const { value, metric } = price;
  return (
    <InputWrapper focus={focus} preselect>
      {({ ref }) => (
        <>
          <BaseNumberInput
            inputRef={ref}
            value={value}
            name="value"
            tabIndex="-1"
            nullable={false}
            readOnly={readonly}
            readOnlyHeight="30px"
            onChange={e => {
              onChange({
                value: e.target.value,
                metric,
              });
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          {metric}
        </>
      )}
    </InputWrapper>
  );
};
export default PriceInput;
