// @flow
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';

type Props = {
  name: string,
  value: string,
};

function TextareaInput(props: Props) {
  return (
    <DebounceInput
      element="textarea"
      type="text"
      spellCheck={false}
      debounceTimeout={500}
      {...props}
    />
  );
}

export default TextareaInput;
