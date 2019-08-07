// @flow
import React, { useRef } from 'react';

import { ButtonStyle, InputStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
};

type Props = OptionalProps & {
  name: string,
  value: string,
};

const defaultProps = {
  width: '100px',
  height: '35px',
};

const TextInput = ({ name, value, width, height }: Props) => {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const onFocus = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    if (buttonRef && buttonRef.current) {
      buttonRef.current.style.display = 'contents';
    }
  };

  const onBlur = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.blur();
    }
    if (buttonRef && buttonRef.current) {
      buttonRef.current.style.display = '';
    }
  };

  return (
    <div>
      <button
        ref={buttonRef}
        tabIndex="0"
        type="button"
        className={ButtonStyle({ width, height })}
        onDoubleClick={() => {
          onFocus();
        }}
        onKeyDown={e => {
          e.preventDefault();
          e.stopPropagation();
          if (e.key === 'Enter') {
            onFocus();
          }
        }}
      />
      <input
        className={InputStyle({ width, height })}
        tabIndex="-1"
        ref={inputRef}
        name={name}
        defaultValue={value}
        align="left"
        onBlur={onBlur}
      />
    </div>
  );
};

TextInput.defaultProps = defaultProps;

export default TextInput;
