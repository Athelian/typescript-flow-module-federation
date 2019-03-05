// @flow
import * as React from 'react';
import { DefaultStyle, TextInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/form/hooks';

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
};

type Props = OptionalProps & {
  id: string,
  name: string,
  value: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
};

export default function InlineTextInput({ id, name, value, isRequired, disabled }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });
  return (
    <DefaultStyle
      disabled={disabled}
      type="text"
      tabIndex="-1"
      isFocused={isFocused}
      hasError={hasError}
    >
      <TextInput
        id={`input-${id}`}
        name={name}
        disabled={disabled}
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

InlineTextInput.defaultProps = defaultProps;
