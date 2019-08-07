// @flow
import React, { useRef } from 'react';

import { ButtonStyle, InputStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  width: string,
  height: string,
};

type Props = OptionalProps & {
  name: string,
  value: string,
};

const defaultProps = {
  disabled: false,
  width: '100px',
  height: '35px',
};

const InlineTextInput = ({ name, value, disabled, width, height }: Props) => {
  const inputRef = useRef(null);

  const onFocus = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <button
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
        disabled={disabled}
        align="left"
      />
    </div>
  );
};

InlineTextInput.defaultProps = defaultProps;

export default InlineTextInput;
