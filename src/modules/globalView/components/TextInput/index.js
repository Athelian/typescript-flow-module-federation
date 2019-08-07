// @flow
import React from 'react';

import { InputStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
  onBlur: Function,
};

type Props = OptionalProps & {
  inputRef: React.Ref<any>,

  name: string,
  value: string,
};

const defaultProps = {
  width: '100px',
  height: '35px',
  onBlur: () => {},
};

const TextInput = ({ name, value, width, height, inputRef, onBlur }: Props) => {
  return (
    <input
      className={InputStyle({ width, height })}
      tabIndex="-1"
      ref={inputRef}
      name={name}
      defaultValue={value}
      align="left"
      onBlur={onBlur}
    />
  );
};

TextInput.defaultProps = defaultProps;

export default TextInput;
