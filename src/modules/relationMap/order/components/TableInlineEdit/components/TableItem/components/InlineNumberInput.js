// @flow
import * as React from 'react';
import { DefaultStyle, NumberInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useNumberInput } from 'modules/form/hooks';

type OptionalProps = {
  isRequired: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: number,
  id: string,
};

const defaultProps = {
  isRequired: false,
};

export default function InlineNumberInput({ name, value, isRequired, id }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useNumberInput(value, { isRequired });
  return (
    <DefaultStyle type="number" tabIndex="-1" isFocused={isFocused} hasError={hasError}>
      <NumberInput
        id={`input-${id}`}
        name={name}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: inputHandlers.value,
          });
        }}
        align="left"
      />
    </DefaultStyle>
  );
}

InlineNumberInput.defaultProps = defaultProps;
