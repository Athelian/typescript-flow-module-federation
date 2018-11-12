// @flow
import * as React from 'react';
import { DefaultStyle, TextInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

type OptionalProps = {
  isRequired: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: string,
};

const defaultProps = {
  isRequired: false,
};

export default function InlineTextInput({ name, value, isRequired }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });
  return (
    <DefaultStyle type="text" isFocused={isFocused} hasError={hasError} forceHoverStyle>
      <TextInput
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
      />
    </DefaultStyle>
  );
}

InlineTextInput.defaultProps = defaultProps;
