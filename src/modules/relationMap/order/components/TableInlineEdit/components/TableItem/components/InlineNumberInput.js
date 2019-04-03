// @flow
import * as React from 'react';
import { DefaultStyle, NumberInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useNumberInput } from 'modules/form/hooks';

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: number,
  id: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
};

export default function InlineNumberInput({ name, value, isRequired, disabled, id }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useNumberInput(value, { isRequired });
  return (
    <DefaultStyle
      disabled={disabled}
      type="number"
      tabIndex="-1"
      isFocused={isFocused}
      hasError={hasError}
    >
      <NumberInput
        id={`input-${id}`}
        disabled={disabled}
        name={name}
        {...(disabled ? { placeholder: '' } : {})}
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
