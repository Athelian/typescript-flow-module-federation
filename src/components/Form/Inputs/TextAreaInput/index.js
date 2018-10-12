// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

// $FlowFixMe
const TextAreaInput = React.forwardRef(({ align, value, ...rest }: Props, ref) => (
  <textarea
    style={{ textAlign: align }}
    value={value || ''}
    ref={ref}
    {...rest}
    spellCheck={false}
  />
));

TextAreaInput.defaultProps = defaultInputProps;

export default TextAreaInput;
