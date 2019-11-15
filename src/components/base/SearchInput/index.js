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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSetQuery]);

  return (
    <div className={className}>
      {searchIcon && searchIcon}
      {/* $FlowFixMe This comment suppresses an error found when upgrading Flow
       * to v0.112.0. To view the error, delete this comment and run Flow. */}
      <CInput className={inputClassName} value={query} onInputChange={handleOnChange} {...rest} />
      {hasContent &&
        clearButton &&
        clearButton({
          clearQuery: () => {
            setQuery('');
            onChange('');
            onClear();
          },
        })}
    </div>
  );
}

SearchInput.defaultProps = defaultProps;

export default SearchInput;
