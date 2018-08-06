// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyleLessSearchInput from 'components/base/SearchInput';
import { SearchInputStyle } from './style';

type Props = {
  onChange: Function,
  onBlur?: Function,
  onClear: Function,
  name: string,
  value: string,
};

function SearchInput(props: Props) {
  return (
    <StyleLessSearchInput
      style={SearchInputStyle}
      searchIcon={<Icon icon="faSearch" />}
      clearButton={({ clearQuery }) => (
        <button type="button" onClick={clearQuery}>
          <Icon icon="faClear" />
        </button>
      )}
      {...props}
    />
  );
}

SearchInput.defaultProps = {
  onBlur: () => {},
};

export default SearchInput;
