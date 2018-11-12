// @flow
import * as React from 'react';
import { DefaultStyle, TextInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
};

export default function InlineTextInput({ name, value, isRequired, disabled }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });
  return (
    <DefaultStyle
      disabled={disabled}
      type="text"
      isFocused={isFocused}
      hasError={hasError}
      forceHoverStyle
    >
      <TextInput
        name={name}
        disabled={disabled}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: inputHandlers.value,
          });
        }}
      />
    </DefaultStyle>
  );
}

InlineTextInput.defaultProps = defaultProps;
