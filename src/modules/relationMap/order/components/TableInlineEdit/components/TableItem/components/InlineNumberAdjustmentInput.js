// @flow
import * as React from 'react';
import { plus, minus } from 'utils/number';
import { DefaultStyle, NumberInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useNumberInput } from 'modules/form/hooks';

type OptionalProps = {
  isRequired: boolean,
  adjustment: number,
};

type Props = OptionalProps & {
  name: string,
  value: number,
  id: string,
};

const defaultProps = {
  isRequired: false,
  adjustment: 0,
};

export default function InlineNumberAdjustmentInput({
  name,
  value,
  adjustment,
  isRequired,
  id,
}: Props) {
  const { hasError, isFocused, ...inputHandlers } = useNumberInput(plus(value, adjustment), {
    isRequired,
  });
  return (
    <DefaultStyle type="number" isFocused={isFocused} hasError={hasError}>
      <NumberInput
        name={name}
        id={`input-${id}`}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: minus(inputHandlers.value, adjustment),
          });
        }}
        align="left"
      />
    </DefaultStyle>
  );
}

InlineNumberAdjustmentInput.defaultProps = defaultProps;
