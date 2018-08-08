// @flow
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';

type Props = {
  name: string,
  value: string,
};

function SearchInput(props: Props) {
  return <DebounceInput type="text" spellCheck={false} debounceTimeout={500} {...props} />;
}

export default SearchInput;
