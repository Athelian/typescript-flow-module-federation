// @flow
import * as React from 'react';
import TextInput from '../TextInput';

type Props = {
  className: any,
  inputClassName: any,
  searchIcon?: ?React.Node,
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
  const {
    searchIcon,
    clearButton,
    className,
    inputClassName,
    value,
    onClear,
    onChange,
    ...rest
  } = props;
  const hasContent = !!value;

  return (
    <div className={className}>
      {searchIcon && searchIcon}
      <TextInput
        className={inputClassName}
        type="text"
        value={value}
        debounceTimeout={500}
        onChange={evt => onChange(evt.target.value.trim())}
        {...rest}
      />
      {hasContent && clearButton && clearButton({ clearQuery: onClear })}
    </div>
  );
}

SearchInput.defaultProps = defaultProps;

export default SearchInput;
