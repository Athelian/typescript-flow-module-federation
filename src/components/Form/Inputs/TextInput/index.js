// @flow
import * as React from 'react';
import { Display } from 'components/Form';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const TextInput = ({ value, align, readOnly, readOnlyWidth, readOnlyHeight, ...rest }: Props) => {
  return readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      {value}
    </Display>
  ) : (
    <input value={value} style={{ textAlign: align }} {...rest} type="text" spellCheck={false} />
  );
};

TextInput.defaultProps = defaultInputProps;

export default TextInput;
