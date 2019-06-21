// @flow
import * as React from 'react';
import CInput from 'react-composition-input';
import useDebounce from 'hooks/useDebounce';

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

  const [query, setQuery] = React.useState(value || '');

  const handleOnChange = evt => {
    setQuery(evt.target.value);
  };

  const debouncedSetQuery = useDebounce(query, 500);

  React.useEffect(() => {
    onChange(debouncedSetQuery);
  }, [debouncedSetQuery, onChange]);

  return (
    <div className={className}>
      {searchIcon && searchIcon}
      <CInput className={inputClassName} value={query} onInputChange={handleOnChange} {...rest} />
      {hasContent && clearButton && clearButton({ clearQuery: onClear })}
    </div>
  );
}

SearchInput.defaultProps = defaultProps;

export default SearchInput;
