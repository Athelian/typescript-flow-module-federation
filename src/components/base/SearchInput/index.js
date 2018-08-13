// @flow
import * as React from 'react';
import TextInput from '../TextInput';

type Props = {
  style: any,
  searchIcon?: React.Node,
  clearButton: ({ clearQuery: () => void }) => React.Node,
  onChange: Function,
  onBlur: Function,
  onClear: Function,
  name: string,
  value: string,
};

const defaultProps = {
  searchIcon: null,
};

function SearchInput(props: Props) {
  const { searchIcon, clearButton, style, value, onClear, ...rest } = props;
  const hasContent = !!value;

  return (
    <div className={style}>
      {searchIcon && searchIcon}
      <TextInput type="text" value={value} debounceTimeout={500} {...rest} />
      {hasContent && clearButton && clearButton({ clearQuery: onClear })}
    </div>
  );
}

SearchInput.defaultProps = defaultProps;

export default SearchInput;
