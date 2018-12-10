// @flow
import * as React from 'react';
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
};

const defaultProps = {
  isRequired: false,
  adjustment: 0,
};

export default function InlineNumberInput({ name, value, adjustment, isRequired }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useNumberInput(value + adjustment, {
    isRequired,
  });
  return (
    <DefaultStyle type="number" isFocused={isFocused} hasError={hasError}>
      <NumberInput
        name={name}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: inputHandlers.value - adjustment,
          });
        }}
        align="left"
      />
    </DefaultStyle>
  );
}

InlineNumberInput.defaultProps = defaultProps;
