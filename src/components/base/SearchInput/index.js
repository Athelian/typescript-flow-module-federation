// @flow
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';

type Props = {
  style: any,
  searchIcon: React.Node,
  clearButton: ({ clearQuery: () => void }) => React.Node,
  onChange: Function,
  onBlur: Function,
  onClear: Function,
  name: string,
  value: string,
};

function SearchInput(props: Props) {
  const { searchIcon, clearButton, style, value, onClear, ...rest } = props;
  const hasContent = !!value;

  return (
    <div className={style}>
      {searchIcon && searchIcon}
      <DebounceInput type="text" value={value} spellCheck={false} debounceTimeout={500} {...rest} />
      {hasContent && clearButton && clearButton({ clearQuery: onClear })}
    </div>
  );
}

export default SearchInput;
