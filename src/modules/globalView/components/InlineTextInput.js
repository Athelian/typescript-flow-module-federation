// @flow
import * as React from 'react';
import { TextInput } from 'components/Form';

import { useTextInput } from 'modules/form/hooks';
import DefaultStyle from './DefaultStyle';

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

export default function InlineTextInput({ name, value, isRequired, disabled, ...rest }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { ...rest, isRequired });
  return (
    <DefaultStyle
      disabled={disabled}
      type="text"
      tabIndex="-1"
      isFocused={isFocused}
      hasError={hasError}
    >
      <TextInput
        name={name}
        disabled={disabled}
        {...(disabled ? { placeholder: '' } : {})}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
        }}
        align="left"
      />
    </DefaultStyle>
  );
}

InlineTextInput.defaultProps = defaultProps;
