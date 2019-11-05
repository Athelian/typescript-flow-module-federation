// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Display } from 'components/Form';
import BaseTextInput from 'components/Inputs/TextInput';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';

type Props = InputProps & {
  intl: IntlShape,
};

const TextInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  placeholder,
  inputRef,
  ...rest
}: Props) =>
  readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      {value}
    </Display>
  ) : (
    <BaseTextInput
      ref={inputRef}
      value={value}
      style={{ textAlign: align }}
      placeholder={placeholder}
      {...rest}
    />
  );

TextInput.defaultProps = defaultInputProps;

export default injectIntl(TextInput);
